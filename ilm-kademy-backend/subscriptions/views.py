"""
Subscriptions views for managing subscription plans and user subscriptions.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Plan, Subscription, Entitlement
from .serializers import (
    PlanSerializer, SubscriptionSerializer,
    EntitlementSerializer
)

class PlanListView(generics.ListAPIView):
    """
    List all active subscription plans.
    """
    serializer_class = PlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Plan.objects.filter(is_active=True)

class SubscriptionListView(generics.ListCreateAPIView):
    """
    List user subscriptions or create a new one.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, current_period_start=timezone.now())

class SubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a user subscription.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

class CurrentSubscriptionView(generics.GenericAPIView):
    """
    Get the current user's active subscription.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            # Get the user's current active subscription
            subscription = Subscription.objects.filter(
                user=request.user,
                status__in=['ACTIVE', 'TRIAL']
            ).first()
            
            if subscription:
                serializer = SubscriptionSerializer(subscription)
                return Response(serializer.data)
            else:
                # Return a default free plan structure
                return Response({
                    'id': 'free',
                    'name': 'Free Plan',
                    'price': 0,
                    'period': 'month',
                    'status': 'active',
                    'next_billing_date': None,
                    'start_date': None,
                    'auto_renew': False
                })
        except Exception as e:
            # If there's an error, return a default free plan
            return Response({
                'id': 'free',
                'name': 'Free Plan',
                'price': 0,
                'period': 'month',
                'status': 'active',
                'next_billing_date': None,
                'start_date': None,
                'auto_renew': False
            })

class BillingHistoryView(generics.GenericAPIView):
    """
    Get the user's billing history.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            # For now, return the user's subscriptions as billing history
            # In a real app, you'd have a separate BillingRecord model
            subscriptions = Subscription.objects.filter(user=request.user).order_by('-created_at')
            
            # Transform subscriptions into billing history format
            billing_history = []
            for subscription in subscriptions:
                billing_history.append({
                    'id': subscription.id,
                    'date': subscription.created_at.strftime('%Y-%m-%d'),
                    'amount': float(subscription.get_price()),
                    'status': subscription.status.lower(),
                    'invoice_number': f'INV-{subscription.id:03d}',
                    'description': f'{subscription.plan.name} - {subscription.billing_cycle} Subscription'
                })
            
            return Response({
                'results': billing_history,
                'count': len(billing_history)
            })
        except Exception as e:
            # If there's an error, return empty billing history
            return Response({
                'results': [],
                'count': 0
            })

class EntitlementListView(generics.ListAPIView):
    """
    List entitlements for the current user.
    """
    serializer_class = EntitlementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Entitlement.objects.filter(subscription__user=self.request.user)

class EntitlementDetailView(generics.RetrieveAPIView):
    """
    Retrieve an entitlement.
    """
    serializer_class = EntitlementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Entitlement.objects.filter(subscription__user=self.request.user) 