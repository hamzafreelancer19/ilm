"""
Institute models for multi-tenant functionality.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Institute(models.Model):
    """
    Institute model for multi-tenant functionality.
    """
    class PlanTier(models.TextChoices):
        FREE = 'FREE', _('Free')
        BASIC = 'BASIC', _('Basic')
        PREMIUM = 'PREMIUM', _('Premium')
        ENTERPRISE = 'ENTERPRISE', _('Enterprise')
    
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        SUSPENDED = 'SUSPENDED', _('Suspended')
        INACTIVE = 'INACTIVE', _('Inactive')
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_institutes'
    )
    plan_tier = models.CharField(
        max_length=20,
        choices=PlanTier.choices,
        default=PlanTier.FREE
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    max_members = models.PositiveIntegerField(default=10)
    logo = models.ImageField(upload_to='institute_logos/', null=True, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('institute')
        verbose_name_plural = _('institutes')
    
    def __str__(self):
        return self.name
    
    @property
    def member_count(self):
        return self.memberships.filter(status=Membership.Status.ACTIVE).count()
    
    @property
    def is_full(self):
        return self.member_count >= self.max_members

class Membership(models.Model):
    """
    User membership in an institute.
    """
    class Role(models.TextChoices):
        OWNER = 'OWNER', _('Owner')
        ADMIN = 'ADMIN', _('Admin')
        TEACHER = 'TEACHER', _('Teacher')
        STUDENT = 'STUDENT', _('Student')
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        ACTIVE = 'ACTIVE', _('Active')
        SUSPENDED = 'SUSPENDED', _('Suspended')
        INACTIVE = 'INACTIVE', _('Inactive')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='institute_memberships'
    )
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('membership')
        verbose_name_plural = _('memberships')
        unique_together = ['user', 'institute']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.institute.name} ({self.role})"
    
    def save(self, *args, **kwargs):
        # Ensure owner role is set correctly
        if self.institute.owner == self.user:
            self.role = self.Role.OWNER
            self.status = self.Status.ACTIVE
        super().save(*args, **kwargs)

class Invitation(models.Model):
    """
    Institute invitation model.
    """
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        ACCEPTED = 'ACCEPTED', _('Accepted')
        DECLINED = 'DECLINED', _('Declined')
        EXPIRED = 'EXPIRED', _('Expired')
    
    email = models.EmailField()
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name='invitations'
    )
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_invitations'
    )
    role = models.CharField(max_length=20, choices=Membership.Role.choices)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    token = models.CharField(max_length=100, unique=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('invitation')
        verbose_name_plural = _('invitations')
    
    def __str__(self):
        return f"Invitation to {self.email} for {self.institute.name}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at 