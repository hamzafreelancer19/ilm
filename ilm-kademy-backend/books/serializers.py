"""
Books serializers for API endpoints.
"""
from rest_framework import serializers
from .models import Book, Chapter, ChapterSection, Tag, ReadingProgress

class TagSerializer(serializers.ModelSerializer):
    """
    Tag serializer.
    """
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']

class BookSerializer(serializers.ModelSerializer):
    """
    Basic book serializer.
    """
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    institute_name = serializers.CharField(source='institute.name', read_only=True)
    chapter_count = serializers.IntegerField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'subject', 'language', 'level', 'cover', 'description',
            'visibility', 'created_by', 'created_by_name', 'institute', 'institute_name',
            'is_published', 'version', 'chapter_count', 'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class BookDetailSerializer(BookSerializer):
    """
    Detailed book serializer with chapters.
    """
    chapters = serializers.SerializerMethodField()
    
    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + ['chapters']
    
    def get_chapters(self, obj):
        chapters = obj.chapters.filter(is_published=True)
        return ChapterSerializer(chapters, many=True).data

class ChapterSerializer(serializers.ModelSerializer):
    """
    Chapter serializer.
    """
    book_title = serializers.CharField(source='book.title', read_only=True)
    section_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Chapter
        fields = [
            'id', 'book', 'book_title', 'title', 'order', 'is_published',
            'section_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_section_count(self, obj):
        return obj.sections.filter(is_active=True).count()

class ChapterDetailSerializer(ChapterSerializer):
    """
    Detailed chapter serializer with sections.
    """
    sections = serializers.SerializerMethodField()
    
    class Meta(ChapterSerializer.Meta):
        fields = ChapterSerializer.Meta.fields + ['sections']
    
    def get_sections(self, obj):
        sections = obj.sections.filter(is_active=True).order_by('order')
        return ChapterSectionSerializer(sections, many=True).data

class ChapterSectionSerializer(serializers.ModelSerializer):
    """
    Chapter section serializer.
    """
    chapter_title = serializers.CharField(source='chapter.title', read_only=True)
    book_title = serializers.CharField(source='chapter.book.title', read_only=True)
    
    class Meta:
        model = ChapterSection
        fields = [
            'id', 'chapter', 'chapter_title', 'book_title', 'kind', 'title',
            'content', 'order', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_content(self, value):
        """
        Validate content based on section kind.
        """
        kind = self.initial_data.get('kind')
        if kind == 'SLOS':
            # SLOs should be a list
            if not isinstance(value, list):
                raise serializers.ValidationError("SLOs must be a list")
        elif kind in ['VOCABULARY_TRANSLATION', 'GLOSSARY']:
            # Vocabulary should be a dictionary with word: definition pairs
            if not isinstance(value, dict):
                raise serializers.ValidationError("Vocabulary must be a dictionary")
        elif kind in ['SHORT_QUESTIONS', 'OBJECTIVE_QUESTIONS']:
            # Questions should be a list of question objects
            if not isinstance(value, list):
                raise serializers.ValidationError("Questions must be a list")
        
        return value

class ReadingProgressSerializer(serializers.ModelSerializer):
    """
    Reading progress serializer.
    """
    chapter_title = serializers.CharField(source='chapter.title', read_only=True)
    book_title = serializers.CharField(source='chapter.book.title', read_only=True)
    
    class Meta:
        model = ReadingProgress
        fields = [
            'id', 'user', 'chapter', 'chapter_title', 'book_title',
            'progress_percentage', 'last_read_at', 'completed_sections'
        ]
        read_only_fields = ['id', 'user', 'last_read_at']
    
    def validate_progress_percentage(self, value):
        """
        Ensure progress percentage is between 0 and 100.
        """
        if value < 0 or value > 100:
            raise serializers.ValidationError("Progress percentage must be between 0 and 100")
        return value 