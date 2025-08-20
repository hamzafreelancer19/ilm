"""
Notification models for user communication.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Announcement(models.Model):
    """
    Institute-wide or system-wide announcements.
    """
    class Scope(models.TextChoices):
        SYSTEM = 'SYSTEM', _('System-wide')
        INSTITUTE = 'INSTITUTE', _('Institute-wide')
        CLASS = 'CLASS', _('Class-specific')
        USER = 'USER', _('User-specific')
    
    class Priority(models.TextChoices):
        LOW = 'LOW', _('Low')
        NORMAL = 'NORMAL', _('Normal')
        HIGH = 'HIGH', _('High')
        URGENT = 'URGENT', _('Urgent')
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    scope = models.CharField(max_length=20, choices=Scope.choices)
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL
    )
    institute = models.ForeignKey(
        'institutes.Institute',
        on_delete=models.CASCADE,
        related_name='announcements',
        null=True,
        blank=True
    )
    target_class = models.CharField(max_length=100, blank=True)  # For class-specific announcements
    target_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='targeted_announcements',
        null=True,
        blank=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_announcements'
    )
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('announcement')
        verbose_name_plural = _('announcements')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_scope_display()})"
    
    @property
    def is_expired(self):
        if not self.expires_at:
            return False
        from django.utils import timezone
        return timezone.now() > self.expires_at

class Notification(models.Model):
    """
    Individual user notifications.
    """
    class NotificationType(models.TextChoices):
        ANNOUNCEMENT = 'ANNOUNCEMENT', _('Announcement')
        ASSIGNMENT = 'ASSIGNMENT', _('Assignment')
        QUIZ = 'QUIZ', _('Quiz')
        GRADE = 'GRADE', _('Grade')
        INVITATION = 'INVITATION', _('Invitation')
        REMINDER = 'REMINDER', _('Reminder')
        SYSTEM = 'SYSTEM', _('System')
    
    class Priority(models.TextChoices):
        LOW = 'LOW', _('Low')
        NORMAL = 'NORMAL', _('Normal')
        HIGH = 'HIGH', _('High')
        URGENT = 'URGENT', _('Urgent')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.NORMAL
    )
    payload = models.JSONField(default=dict, blank=True)  # Additional data
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    action_url = models.URLField(blank=True)  # URL to navigate to when clicked
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            from django.utils import timezone
            self.read_at = timezone.now()
            self.save()
    
    @property
    def is_expired(self):
        if not self.expires_at:
            return False
        from django.utils import timezone
        return timezone.now() > self.expires_at

class NotificationPreference(models.Model):
    """
    User preferences for notification types.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    in_app_notifications = models.BooleanField(default=True)
    preferences = models.JSONField(default=dict)  # Type-specific preferences
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('notification preference')
        verbose_name_plural = _('notification preferences')
    
    def __str__(self):
        return f"Preferences for {self.user.full_name}"
    
    def get_preference(self, notification_type, default=True):
        """Get preference for a specific notification type."""
        return self.preferences.get(notification_type, default)
    
    def set_preference(self, notification_type, value):
        """Set preference for a specific notification type."""
        self.preferences[notification_type] = value
        self.save() 