"""
Institute app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'institutes'

urlpatterns = [
    path('', views.InstituteListView.as_view(), name='institute-list'),
    path('create/', views.InstituteCreateView.as_view(), name='institute-create'),
    path('<int:pk>/', views.InstituteDetailView.as_view(), name='institute-detail'),
    path('<int:pk>/update/', views.InstituteUpdateView.as_view(), name='institute-update'),
    path('<int:pk>/members/', views.InstituteMembersView.as_view(), name='institute-members'),
    path('<int:pk>/invite/', views.InviteMemberView.as_view(), name='invite-member'),
    path('membership/<int:pk>/', views.MembershipDetailView.as_view(), name='membership-detail'),
    path('membership/<int:pk>/update/', views.MembershipUpdateView.as_view(), name='membership-update'),
    path('invitations/', views.InvitationListView.as_view(), name='invitation-list'),
    path('invitations/<str:token>/', views.InvitationDetailView.as_view(), name='invitation-detail'),
    path('invitations/<str:token>/accept/', views.AcceptInvitationView.as_view(), name='accept-invitation'),
    path('invitations/<str:token>/decline/', views.DeclineInvitationView.as_view(), name='decline-invitation'),
] 