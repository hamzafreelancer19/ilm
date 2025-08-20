"""
Subscriptions app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'subscriptions'

urlpatterns = [
    path('plans/', views.PlanListView.as_view(), name='plan-list'),
    path('subscriptions/', views.SubscriptionListView.as_view(), name='subscription-list'),
    path('subscriptions/<int:pk>/', views.SubscriptionDetailView.as_view(), name='subscription-detail'),
    path('entitlements/', views.EntitlementListView.as_view(), name='entitlement-list'),
    path('entitlements/<int:pk>/', views.EntitlementDetailView.as_view(), name='entitlement-detail'),
    path('current/', views.CurrentSubscriptionView.as_view(), name='current-subscription'),
    path('billing-history/', views.BillingHistoryView.as_view(), name='billing-history'),
] 