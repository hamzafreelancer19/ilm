"""
Assignment models for homework and projects.
"""
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _

class Assignment(models.Model):
    """
    Assignment model for homework and projects.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    chapter = models.ForeignKey(
        'books.Chapter',
        on_delete=models.CASCADE,
        related_name='assignments',
        null=True,
        blank=True
    )
    institute = models.ForeignKey(
        'institutes.Institute',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_assignments'
    )
    due_date = models.DateTimeField()
    max_points = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        default=100
    )
    is_active = models.BooleanField(default=True)
    allow_late_submission = models.BooleanField(default=False)
    late_penalty = models.PositiveIntegerField(
        help_text='Late penalty percentage',
        default=10
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('assignment')
        verbose_name_plural = _('assignments')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - Due: {self.due_date.strftime('%Y-%m-%d')}"
    
    @property
    def submission_count(self):
        return self.submissions.count()
    
    @property
    def is_overdue(self):
        from django.utils import timezone
        return timezone.now() > self.due_date

class AssignmentSubmission(models.Model):
    """
    Student submission for an assignment.
    """
    class Status(models.TextChoices):
        SUBMITTED = 'SUBMITTED', _('Submitted')
        GRADED = 'GRADED', _('Graded')
        LATE = 'LATE', _('Late')
        RETURNED = 'RETURNED', _('Returned for Revision')
    
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assignment_submissions'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUBMITTED
    )
    text_content = models.TextField(blank=True)
    file_upload = models.FileField(
        upload_to='assignment_submissions/',
        null=True,
        blank=True
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    grade = models.PositiveIntegerField(
        validators=[MinValueValidator(0)],
        null=True,
        blank=True
    )
    max_grade = models.PositiveIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='graded_submissions',
        null=True,
        blank=True
    )
    
    class Meta:
        verbose_name = _('assignment submission')
        verbose_name_plural = _('assignment submissions')
        ordering = ['-submitted_at']
        unique_together = ['assignment', 'student']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.assignment.title}"
    
    @property
    def is_late(self):
        return self.submitted_at > self.assignment.due_date
    
    @property
    def percentage_grade(self):
        if self.grade is not None and self.max_grade:
            return (self.grade / self.max_grade) * 100
        return None
    
    def calculate_final_grade(self):
        """
        Calculate final grade considering late penalties.
        """
        if self.grade is None or self.max_grade is None:
            return None
        
        if self.is_late and not self.assignment.allow_late_submission:
            penalty = (self.assignment.late_penalty / 100) * self.max_grade
            final_grade = max(0, self.grade - penalty)
            return final_grade
        
        return self.grade 