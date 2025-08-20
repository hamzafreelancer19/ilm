"""
Assignments views for CRUD operations.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.exceptions import PermissionDenied
from django.db import models

from .models import Assignment, AssignmentSubmission
from .serializers import (
    AssignmentSerializer, AssignmentDetailSerializer,
    AssignmentSubmissionSerializer
)

class AssignmentListView(generics.ListCreateAPIView):
    """
    List all assignments or create a new one.
    """
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Assignment.objects.all()
        elif user.is_teacher():
            return Assignment.objects.filter(
                models.Q(created_by=user) |
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN', 'TEACHER'])
            )
        else:
            return Assignment.objects.filter(
                is_active=True,
                institute__memberships__user=user,
                institute__memberships__status='ACTIVE'
            )
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AssignmentCreateView(generics.CreateAPIView):
    """
    Create a new assignment.
    """
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an assignment.
    """
    queryset = Assignment.objects.all()
    serializer_class = AssignmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Assignment.objects.all()
        elif user.is_teacher():
            return Assignment.objects.filter(
                models.Q(created_by=user) |
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN', 'TEACHER'])
            )
        else:
            return Assignment.objects.filter(
                is_active=True,
                institute__memberships__user=user,
                institute__memberships__status='ACTIVE'
            )

class AssignmentUpdateView(generics.UpdateAPIView):
    """
    Update an assignment.
    """
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Assignment.objects.all()
        elif user.is_teacher():
            return Assignment.objects.filter(
                models.Q(created_by=user) |
                models.Q(institute__memberships__user=user, institute__memberships__role__in=['OWNER', 'ADMIN', 'TEACHER'])
            )
        else:
            return Assignment.objects.filter(
                is_active=True,
                institute__memberships__user=user,
                institute__memberships__status='ACTIVE'
            )

class SubmitAssignmentView(generics.CreateAPIView):
    """
    Submit an assignment.
    """
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        assignment = get_object_or_404(Assignment, pk=self.kwargs['pk'])
        serializer.save(
            student=self.request.user,
            assignment=assignment
        )

class AssignmentSubmissionListView(generics.ListAPIView):
    """
    List assignment submissions.
    """
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return AssignmentSubmission.objects.all()
        elif user.is_teacher():
            return AssignmentSubmission.objects.filter(
                assignment__created_by=user
            )
        else:
            return AssignmentSubmission.objects.filter(student=user)

class AssignmentSubmissionDetailView(generics.RetrieveAPIView):
    """
    Retrieve an assignment submission.
    """
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return AssignmentSubmission.objects.all()
        elif user.is_teacher():
            return AssignmentSubmission.objects.filter(
                assignment__created_by=user
            )
        else:
            return AssignmentSubmission.objects.filter(student=user)

class GradeSubmissionView(generics.UpdateAPIView):
    """
    Grade an assignment submission.
    """
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return AssignmentSubmission.objects.all()
        elif user.is_teacher():
            return AssignmentSubmission.objects.filter(
                assignment__created_by=user
            )
        else:
            return AssignmentSubmission.objects.none()

class SubmissionFeedbackView(generics.UpdateAPIView):
    """
    Add feedback to an assignment submission.
    """
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return AssignmentSubmission.objects.all()
        elif user.is_teacher():
            return AssignmentSubmission.objects.filter(
                assignment__created_by=user
            )
        else:
            return AssignmentSubmission.objects.none() 