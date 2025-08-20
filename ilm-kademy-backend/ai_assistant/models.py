"""
AI Assistant models for educational support.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class AIConversation(models.Model):
    """
    AI conversation session for a user.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_conversations'
    )
    title = models.CharField(max_length=200, blank=True)
    context_type = models.CharField(
        max_length=50,
        choices=[
            ('GENERAL', 'General'),
            ('CHAPTER', 'Chapter'),
            ('QUIZ', 'Quiz'),
            ('ASSIGNMENT', 'Assignment'),
        ],
        default='GENERAL'
    )
    context_id = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('AI conversation')
        verbose_name_plural = _('AI conversations')
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.title or 'AI Chat'}"

class AIMessage(models.Model):
    """
    Individual message in an AI conversation.
    """
    class MessageType(models.TextChoices):
        USER = 'USER', _('User')
        AI = 'AI', _('AI Assistant')
        SYSTEM = 'SYSTEM', _('System')
    
    conversation = models.ForeignKey(
        AIConversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    message_type = models.CharField(max_length=10, choices=MessageType.choices)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('AI message')
        verbose_name_plural = _('AI messages')
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.get_message_type_display()}: {self.content[:50]}"

class GrammarCheck(models.Model):
    """
    Grammar check request and response.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='grammar_checks'
    )
    original_text = models.TextField()
    corrected_text = models.TextField()
    suggestions = models.JSONField(default=list)  # List of improvement suggestions
    language = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('grammar check')
        verbose_name_plural = _('grammar checks')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - Grammar Check ({self.created_at.strftime('%Y-%m-%d')})"

class QuizSuggestion(models.Model):
    """
    AI-generated quiz question suggestions.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_suggestions'
    )
    source_text = models.TextField()
    suggested_questions = models.JSONField()  # List of question objects
    subject = models.CharField(max_length=50, blank=True)
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('EASY', 'Easy'),
            ('MEDIUM', 'Medium'),
            ('HARD', 'Hard'),
        ],
        default='MEDIUM'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('quiz suggestion')
        verbose_name_plural = _('quiz suggestions')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - Quiz Suggestions ({self.subject})" 