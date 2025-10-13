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
        
        # For English books, ensure all 13 sections are present in correct order
        if obj.book.language == 'EN':
            return self._get_english_book_sections(obj, sections)
        
        # For other book types, return sections as they are
        return ChapterSectionSerializer(sections, many=True).data
    
    def _get_english_book_sections(self, chapter, existing_sections):
        """
        Get sections for English books ensuring all 13 required sections are present.
        """
        from .models import ChapterSection
        
        required_sections = ChapterSection.get_english_book_section_order()
        sections_data = []
        
        # Create a map of existing sections by kind
        existing_sections_map = {section.kind: section for section in existing_sections}
        
        for order, section_kind in enumerate(required_sections, 1):
            if section_kind in existing_sections_map:
                # Use existing section
                section = existing_sections_map[section_kind]
                section_data = {
                    'type': section.kind,
                    'order': order,
                    'content': section.content
                }
                sections_data.append(section_data)
            else:
                # Create placeholder for missing section
                sections_data.append({
                    'type': section_kind,
                    'order': order,
                    'content': self._get_default_content(section_kind)
                })
        
        return sections_data
    
    def to_representation(self, instance):
        """
        Custom representation to match the required JSON format.
        """
        data = super().to_representation(instance)
        
        # Transform to required format for English books
        if instance.book.language == 'EN':
            return {
                'chapter_id': data['id'],
                'chapter_title': data['title'],
                'sections': data['sections']
            }
        
        return data
    
    def _get_default_content(self, section_kind):
        """Get default content structure for a section kind."""
        default_content = {
            'INTRODUCTION': {
                'text': 'Introduction content will be added here.',
                'overview': 'Chapter overview will be provided.',
                'key_concepts': []
            },
            'POINT_WISE_SUMMARY': {
                'points': ['Summary points will be listed here.'],
                'main_ideas': []
            },
            'SLOS': {
                'objectives': ['Learning objectives will be defined here.'],
                'outcomes': []
            },
            'PRE_READING_QUESTIONS': {
                'questions': ['Pre-reading questions will be listed here.'],
                'purpose': 'Questions to prepare students for reading.'
            },
            'VOCABULARY_TEXT_TRANSLATION': {
                'vocabulary': {},
                'text': 'Main text content will be provided here.',
                'translation': 'Translation will be available here.'
            },
            'GLOSSARY': {
                'terms': {},
                'definitions': {}
            },
            'EXERCISE_SHORT_QUESTIONS': {
                'questions': ['Exercise questions will be provided here.'],
                'answers': {}
            },
            'EXERCISE_OBJECTIVES': {
                'questions': ['Objective questions will be listed here.'],
                'options': {},
                'correct_answers': {}
            },
            'EXERCISE_VOCABULARY_GRAMMAR': {
                'vocabulary_exercises': [],
                'grammar_exercises': []
            },
            'EXERCISE_ORAL_COMMUNICATION': {
                'speaking_activities': [],
                'discussion_topics': []
            },
            'EXERCISE_WRITING_SKILLS': {
                'writing_prompts': [],
                'writing_tasks': []
            },
            'IDIOMS_PHRASAL_VERBS': {
                'idioms': {},
                'phrasal_verbs': {}
            },
            'ASSESSMENT_TEST': {
                'questions': [],
                'time_limit': '30 minutes',
                'total_marks': 100
            }
        }
        return default_content.get(section_kind, {})

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
        elif kind in ['VOCABULARY_TEXT_TRANSLATION', 'GLOSSARY']:
            # Vocabulary should be a dictionary with word: definition pairs
            if not isinstance(value, dict):
                raise serializers.ValidationError("Vocabulary must be a dictionary")
        elif kind in ['EXERCISE_SHORT_QUESTIONS', 'EXERCISE_OBJECTIVES']:
            # Questions should be a list of question objects
            if not isinstance(value, list):
                raise serializers.ValidationError("Questions must be a list")
        elif kind == 'POINT_WISE_SUMMARY':
            # Summary should have points and main ideas
            if not isinstance(value, dict) or 'points' not in value:
                raise serializers.ValidationError("Summary must have points structure")
        elif kind == 'PRE_READING_QUESTIONS':
            # Pre-reading questions should have questions and purpose
            if not isinstance(value, dict) or 'questions' not in value:
                raise serializers.ValidationError("Pre-reading questions must have questions structure")
        elif kind == 'EXERCISE_VOCABULARY_GRAMMAR':
            # Should have vocabulary and grammar exercises
            if not isinstance(value, dict) or 'vocabulary_exercises' not in value or 'grammar_exercises' not in value:
                raise serializers.ValidationError("Vocabulary and grammar exercises must have proper structure")
        elif kind == 'EXERCISE_ORAL_COMMUNICATION':
            # Should have speaking activities and discussion topics
            if not isinstance(value, dict) or 'speaking_activities' not in value or 'discussion_topics' not in value:
                raise serializers.ValidationError("Oral communication exercises must have proper structure")
        elif kind == 'EXERCISE_WRITING_SKILLS':
            # Should have writing prompts and tasks
            if not isinstance(value, dict) or 'writing_prompts' not in value or 'writing_tasks' not in value:
                raise serializers.ValidationError("Writing skills exercises must have proper structure")
        elif kind == 'IDIOMS_PHRASAL_VERBS':
            # Should have idioms and phrasal verbs
            if not isinstance(value, dict) or 'idioms' not in value or 'phrasal_verbs' not in value:
                raise serializers.ValidationError("Idioms and phrasal verbs must have proper structure")
        elif kind == 'ASSESSMENT_TEST':
            # Should have questions, time limit, and total marks
            if not isinstance(value, dict) or 'questions' not in value or 'total_marks' not in value:
                raise serializers.ValidationError("Assessment test must have proper structure")
        
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