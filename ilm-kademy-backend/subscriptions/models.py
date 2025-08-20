"""
Subscription models for plan management.
"""
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Plan(models.Model):
    """
    Subscription plan model.
    """
    class PlanType(models.TextChoices):
        FREE = 'FREE', _('Free')
        BASIC = 'BASIC', _('Basic')
        PREMIUM = 'PREMIUM', _('Premium')
        ENTERPRISE = 'ENTERPRISE', _('Enterprise')
    
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PlanType.choices, unique=True)
    description = models.TextField()
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_students = models.PositiveIntegerField(default=1)
    max_books = models.PositiveIntegerField(default=5)
    features = models.JSONField(default=list)  # List of feature strings
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('plan')
        verbose_name_plural = _('plans')
        ordering = ['price_monthly']
    
    def __str__(self):
        return f"{self.name} - ${self.price_monthly}/month"

class Subscription(models.Model):
    """
    User or institute subscription to a plan.
"""
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        TRIAL = 'TRIAL', _('Trial')
        EXPIRED = 'EXPIRED', _('Expired')
        CANCELLED = 'CANCELLED', _('Cancelled')
        SUSPENDED = 'SUSPENDED', _('Suspended')
    
    class BillingCycle(models.TextChoices):
        MONTHLY = 'MONTHLY', _('Monthly')
        YEARLY = 'YEARLY', _('Yearly')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        null=True,
        blank=True
    )
    institute = models.ForeignKey(
        'institutes.Institute',
        on_delete=models.CASCADE,
        related_name='subscriptions',
        null=True,
        blank=True
    )
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='subscriptions')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TRIAL
    )
    billing_cycle = models.CharField(
        max_length=20,
        choices=BillingCycle.choices,
        default=BillingCycle.MONTHLY
    )
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    trial_end = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('subscription')
        verbose_name_plural = _('subscriptions')
        ordering = ['-created_at']
    
    def __str__(self):
        owner = self.user.full_name if self.user else self.institute.name
        return f"{owner} - {self.plan.name} ({self.status})"
    
    @property
    def is_active(self):
        return self.status in [self.Status.ACTIVE, self.Status.TRIAL]
    
    @property
    def is_trial(self):
        return self.status == self.Status.TRIAL
    
    def get_price(self):
        """Get the appropriate price based on billing cycle."""
        if self.billing_cycle == self.BillingCycle.YEARLY:
            return self.plan.price_yearly
        return self.plan.price_monthly

class Entitlement(models.Model):
    """
    Feature entitlements based on subscription.
    """
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='entitlements')
    feature_name = models.CharField(max_length=100)
    is_enabled = models.BooleanField(default=True)
    limit = models.PositiveIntegerField(null=True, blank=True)
    used = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('entitlement')
        verbose_name_plural = _('entitlements')
        unique_together = ['subscription', 'feature_name']
    
    def __str__(self):
        return f"{self.subscription} - {self.feature_name}"
    
    @property
    def remaining(self):
        if self.limit is None:
            return None
        return max(0, self.limit - self.used)
    
    @property
    def is_available(self):
        if not self.is_enabled:
            return False
        if self.limit is None:
            return True
        return self.used < self.limit 