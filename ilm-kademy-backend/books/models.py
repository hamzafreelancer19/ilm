"""
Book models for educational content.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Book(models.Model):
    """
    Book model for educational content.
    """
    class Subject(models.TextChoices):
        MATHEMATICS = 'MATHEMATICS', _('Mathematics')
        SCIENCE = 'SCIENCE', _('Science')
        ENGLISH = 'ENGLISH', _('English')
        HISTORY = 'HISTORY', _('History')
        GEOGRAPHY = 'GEOGRAPHY', _('Geography')
        LITERATURE = 'LITERATURE', _('Literature')
        COMPUTER_SCIENCE = 'COMPUTER_SCIENCE', _('Computer Science')
        ART = 'ART', _('Art')
        MUSIC = 'MUSIC', _('Music')
        PHYSICAL_EDUCATION = 'PHYSICAL_EDUCATION', _('Physical Education')
        OTHER = 'OTHER', _('Other')
    
    class Language(models.TextChoices):
        ENGLISH = 'EN', _('English')
        URDU = 'UR', _('Urdu')
        ARABIC = 'AR', _('Arabic')
        FRENCH = 'FR', _('French')
        SPANISH = 'ES', _('Spanish')
        GERMAN = 'DE', _('German')
        CHINESE = 'ZH', _('Chinese')
        OTHER = 'OT', _('Other')
    
    class Level(models.TextChoices):
        BEGINNER = 'BEGINNER', _('Beginner')
        INTERMEDIATE = 'INTERMEDIATE', _('Intermediate')
        ADVANCED = 'ADVANCED', _('Advanced')
        EXPERT = 'EXPERT', _('Expert')
    
    class Visibility(models.TextChoices):
        PUBLIC = 'PUBLIC', _('Public')
        PRIVATE = 'PRIVATE', _('Private')
        INSTITUTE = 'INSTITUTE', _('Institute Only')
    
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=30, choices=Subject.choices)
    language = models.CharField(max_length=2, choices=Language.choices, default=Language.ENGLISH)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    description = models.TextField()
    visibility = models.CharField(
        max_length=20,
        choices=Visibility.choices,
        default=Visibility.PUBLIC
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_books'
    )
    institute = models.ForeignKey(
        'institutes.Institute',
        on_delete=models.CASCADE,
        related_name='books',
        null=True,
        blank=True
    )
    is_published = models.BooleanField(default=False)
    version = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('book')
        verbose_name_plural = _('books')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.subject})"
    
    @property
    def chapter_count(self):
        return self.chapters.filter(is_published=True).count()

class Tag(models.Model):
    """
    Book tags for categorization.
    """
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    
    class Meta:
        verbose_name = _('tag')
        verbose_name_plural = _('tags')
    
    def __str__(self):
        return self.name

class BookTag(models.Model):
    """
    Many-to-many relationship between books and tags.
    """
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='book_tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='book_tags')
    
    class Meta:
        unique_together = ['book', 'tag']

class Chapter(models.Model):
    """
    Chapter model for book content organization.
    """
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('chapter')
        verbose_name_plural = _('chapters')
        ordering = ['order']
        unique_together = ['book', 'order']
    
    def __str__(self):
        return f"{self.book.title} - Chapter {self.order}: {self.title}"

class ChapterSection(models.Model):
    """
    Chapter section model for the 13 modular content types.
    """
    class SectionKind(models.TextChoices):
        INTRODUCTION = 'INTRODUCTION', _('Introduction')
        POINT_WISE_SUMMARY = 'POINT_WISE_SUMMARY', _('Point-wise Summary')
        SLOS = 'SLOS', _('Student Learning Objectives')
        PRE_READING_QUESTIONS = 'PRE_READING_QUESTIONS', _('Pre-reading Questions')
        VOCABULARY_TEXT_TRANSLATION = 'VOCABULARY_TEXT_TRANSLATION', _('Vocabulary, Text & Translation')
        GLOSSARY = 'GLOSSARY', _('Glossary')
        EXERCISE_SHORT_QUESTIONS = 'EXERCISE_SHORT_QUESTIONS', _('Exercise: Short Questions')
        EXERCISE_OBJECTIVES = 'EXERCISE_OBJECTIVES', _('Exercise: Objectives')
        EXERCISE_VOCABULARY_GRAMMAR = 'EXERCISE_VOCABULARY_GRAMMAR', _('Exercise: Vocabulary and Grammar')
        EXERCISE_ORAL_COMMUNICATION = 'EXERCISE_ORAL_COMMUNICATION', _('Exercise: Oral Communication')
        EXERCISE_WRITING_SKILLS = 'EXERCISE_WRITING_SKILLS', _('Exercise: Writing Skills')
        IDIOMS_PHRASAL_VERBS = 'IDIOMS_PHRASAL_VERBS', _('Idioms and Phrasal Verbs of the Lesson')
        ASSESSMENT_TEST = 'ASSESSMENT_TEST', _('Assessment Test')
    
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='sections')
    kind = models.CharField(max_length=30, choices=SectionKind.choices)
    title = models.CharField(max_length=200, blank=True)
    content = models.JSONField()  # Flexible content structure
    order = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('chapter section')
        verbose_name_plural = _('chapter sections')
        ordering = ['order']
        unique_together = ['chapter', 'kind', 'order']
    
    def __str__(self):
        return f"{self.chapter.title} - {self.get_kind_display()} (Order: {self.order})"
    
    def get_content_summary(self):
        """
        Get a summary of the content for display.
        """
        if isinstance(self.content, dict):
            return self.content.get('summary', str(self.content)[:100])
        return str(self.content)[:100]
    
    @classmethod
    def get_english_book_section_order(cls):
        """
        Get the required section order for English books.
        """
        return [
            'INTRODUCTION',
            'POINT_WISE_SUMMARY', 
            'SLOS',
            'PRE_READING_QUESTIONS',
            'VOCABULARY_TEXT_TRANSLATION',
            'GLOSSARY',
            'EXERCISE_SHORT_QUESTIONS',
            'EXERCISE_OBJECTIVES',
            'EXERCISE_VOCABULARY_GRAMMAR',
            'EXERCISE_ORAL_COMMUNICATION',
            'EXERCISE_WRITING_SKILLS',
            'IDIOMS_PHRASAL_VERBS',
            'ASSESSMENT_TEST'
        ]

class ReadingProgress(models.Model):
    """
    Track user reading progress through chapters.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reading_progress'
    )
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='reading_progress')
    progress_percentage = models.PositiveIntegerField(default=0)  # 0-100
    last_read_at = models.DateTimeField(auto_now=True)
    completed_sections = models.JSONField(default=list)  # List of completed section IDs
    
    class Meta:
        verbose_name = _('reading progress')
        verbose_name_plural = _('reading progress')
        unique_together = ['user', 'chapter']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.chapter.title} ({self.progress_percentage}%)" 