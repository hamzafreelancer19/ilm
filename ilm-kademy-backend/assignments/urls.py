"""
Assignments app URL configuration.
"""
from django.urls import path
from . import views

app_name = 'assignments'

urlpatterns = [
    path('', views.AssignmentListView.as_view(), name='assignment-list'),
    path('create/', views.AssignmentCreateView.as_view(), name='assignment-create'),
    path('<int:pk>/', views.AssignmentDetailView.as_view(), name='assignment-detail'),
    path('<int:pk>/update/', views.AssignmentUpdateView.as_view(), name='assignment-update'),
    path('<int:pk>/submit/', views.SubmitAssignmentView.as_view(), name='submit-assignment'),
    path('submissions/', views.AssignmentSubmissionListView.as_view(), name='submission-list'),
    path('submissions/<int:pk>/', views.AssignmentSubmissionDetailView.as_view(), name='submission-detail'),
    path('submissions/<int:pk>/grade/', views.GradeSubmissionView.as_view(), name='grade-submission'),
    path('submissions/<int:pk>/feedback/', views.SubmissionFeedbackView.as_view(), name='submission-feedback'),
] 