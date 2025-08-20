"""
Quiz models for assessments.
"""
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _

class Quiz(models.Model):
    """
    Quiz model for assessments.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    chapter = models.ForeignKey(
        'books.Chapter',
        on_delete=models.CASCADE,
        related_name='quizzes',
        null=True,
        blank=True
    )
    institute = models.ForeignKey(
        'institutes.Institute',
        on_delete=models.CASCADE,
        related_name='quizzes',
        null=True,
        blank=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_quizzes'
    )
    time_limit = models.PositiveIntegerField(
        help_text='Time limit in minutes (0 for no limit)',
        default=0
    )
    passing_score = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=70
    )
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    allow_multiple_attempts = models.BooleanField(default=True)
    max_attempts = models.PositiveIntegerField(default=3)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('quiz')
        verbose_name_plural = _('quizzes')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def question_count(self):
        return self.questions.filter(is_active=True).count()
    
    @property
    def total_points(self):
        return sum(q.points for q in self.questions.filter(is_active=True))

class Question(models.Model):
    """
    Question model for quiz content.
    """
    class QuestionType(models.TextChoices):
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', _('Multiple Choice')
        TRUE_FALSE = 'TRUE_FALSE', _('True/False')
        FILL_BLANK = 'FILL_BLANK', _('Fill in the Blank')
        SHORT_ANSWER = 'SHORT_ANSWER', _('Short Answer')
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QuestionType.choices)
    text = models.TextField()
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('question')
        verbose_name_plural = _('questions')
        ordering = ['order']
        unique_together = ['quiz', 'order']
    
    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}: {self.text[:50]}"

class QuestionOption(models.Model):
    """
    Options for multiple choice questions.
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField()
    
    class Meta:
        verbose_name = _('question option')
        verbose_name_plural = _('question options')
        ordering = ['order']
        unique_together = ['question', 'order']
    
    def __str__(self):
        return f"{self.question.text[:30]} - Option {self.order}: {self.text[:30]}"

class QuizAttempt(models.Model):
    """
    User attempt at a quiz.
    """
    class Status(models.TextChoices):
        IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
        COMPLETED = 'COMPLETED', _('Completed')
        ABANDONED = 'ABANDONED', _('Abandoned')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS
    )
    score = models.PositiveIntegerField(null=True, blank=True)
    max_score = models.PositiveIntegerField(null=True, blank=True)
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    passed = models.BooleanField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_taken = models.PositiveIntegerField(
        help_text='Time taken in seconds',
        null=True,
        blank=True
    )
    
    class Meta:
        verbose_name = _('quiz attempt')
        verbose_name_plural = _('quiz attempts')
        ordering = ['-started_at']
        unique_together = ['user', 'quiz']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.quiz.title} ({self.status})"
    
    def calculate_score(self):
        """
        Calculate and update the score for this attempt.
        """
        if self.status != self.Status.COMPLETED:
            return
        
        total_points = 0
        earned_points = 0
        
        for answer in self.answers.all():
            question = answer.question
            total_points += question.points
            
            if answer.is_correct:
                earned_points += question.points
        
        self.score = earned_points
        self.max_score = total_points
        self.percentage = (earned_points / total_points * 100) if total_points > 0 else 0
        self.passed = self.percentage >= self.quiz.passing_score
        self.save()

class QuizAnswer(models.Model):
    """
    User's answer to a specific question.
    """
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    selected_option = models.ForeignKey(
        QuestionOption,
        on_delete=models.CASCADE,
        related_name='answers',
        null=True,
        blank=True
    )
    text_answer = models.TextField(blank=True)  # For fill-in-the-blank and short answer
    is_correct = models.BooleanField(null=True, blank=True)
    points_earned = models.PositiveIntegerField(default=0)
    answered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('quiz answer')
        verbose_name_plural = _('quiz answers')
        unique_together = ['attempt', 'question']
    
    def __str__(self):
        return f"{self.attempt.user.full_name} - {self.question.text[:30]}"
    
    def check_answer(self):
        """
        Check if the answer is correct and calculate points.
        """
        if self.question.question_type == Question.QuestionType.MULTIPLE_CHOICE:
            if self.selected_option and self.selected_option.is_correct:
                self.is_correct = True
                self.points_earned = self.question.points
            else:
                self.is_correct = False
                self.points_earned = 0
        
        elif self.question.question_type == Question.QuestionType.TRUE_FALSE:
            # For now, assume correct if option is selected and correct
            if self.selected_option and self.selected_option.is_correct:
                self.is_correct = True
                self.points_earned = self.question.points
            else:
                self.is_correct = False
                self.points_earned = 0
        
        elif self.question.question_type == Question.QuestionType.FILL_BLANK:
            # This would need more sophisticated checking logic
            # For now, mark as not checked
            self.is_correct = None
            self.points_earned = 0
        
        else:  # SHORT_ANSWER
            # Manual grading required
            self.is_correct = None
            self.points_earned = 0
        
        self.save() 