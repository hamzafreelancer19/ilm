"""
Serializers for the subscriptions app.
"""
from rest_framework import serializers
from .models import Plan, Subscription, Entitlement

class PlanSerializer(serializers.ModelSerializer):
    """
    Serializer for Plan model.
    """
    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'plan_type', 'description', 'price_monthly',
            'price_yearly', 'max_students', 'max_books', 'features',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for Subscription model.
    """
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'user_name', 'plan', 'plan_name', 'status',
            'billing_cycle', 'current_period_start', 'current_period_end',
            'trial_end', 'cancelled_at', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

class EntitlementSerializer(serializers.ModelSerializer):
    """
    Serializer for Entitlement model.
    """
    subscription_plan = serializers.CharField(source='subscription.plan.name', read_only=True)
    user_name = serializers.CharField(source='subscription.user.full_name', read_only=True)
    
    class Meta:
        model = Entitlement
        fields = [
            'id', 'subscription', 'subscription_plan', 'user_name',
            'feature_name', 'is_enabled', 'limit', 'used', 'remaining',
            'is_available', 'created_at'
        ]
        read_only_fields = ['id', 'created_at'] 