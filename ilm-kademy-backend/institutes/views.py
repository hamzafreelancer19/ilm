"""
Institute views for CRUD operations.
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import Institute, Membership, Invitation
from .serializers import (
    InstituteSerializer, InstituteDetailSerializer, 
    MembershipSerializer, InvitationSerializer
)
from users.models import User

class InstituteListView(generics.ListCreateAPIView):
    """
    List all institutes or create a new one.
    """
    serializer_class = InstituteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Institute.objects.all()
        elif user.is_institute_admin():
            return Institute.objects.filter(memberships__user=user, memberships__role__in=['OWNER', 'ADMIN'])
        else:
            return Institute.objects.filter(memberships__user=user, memberships__status='ACTIVE')
    
    def perform_create(self, serializer):
        institute = serializer.save(owner=self.request.user)
        # Create owner membership
        Membership.objects.create(
            user=self.request.user,
            institute=institute,
            role='OWNER',
            status='ACTIVE'
        )

class InstituteCreateView(generics.CreateAPIView):
    """
    Create a new institute.
    """
    serializer_class = InstituteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        institute = serializer.save(owner=self.request.user)
        # Create owner membership
        Membership.objects.create(
            user=self.request.user,
            institute=institute,
            role='OWNER',
            status='ACTIVE'
        )

class InstituteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an institute.
    """
    queryset = Institute.objects.all()
    serializer_class = InstituteDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Institute.objects.all()
        elif user.is_institute_admin():
            return Institute.objects.filter(memberships__user=user, memberships__role__in=['OWNER', 'ADMIN'])
        else:
            return Institute.objects.filter(memberships__user=user, memberships__status='ACTIVE')

class InstituteUpdateView(generics.UpdateAPIView):
    """
    Update an institute.
    """
    queryset = Institute.objects.all()
    serializer_class = InstituteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Institute.objects.all()
        elif user.is_institute_admin():
            return Institute.objects.filter(memberships__user=user, memberships__role__in=['OWNER', 'ADMIN'])
        else:
            return Institute.objects.filter(memberships__user=user, memberships__status='ACTIVE')

class InstituteMembersView(generics.ListAPIView):
    """
    List all members of an institute.
    """
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        institute_id = self.kwargs['pk']
        institute = get_object_or_404(Institute, pk=institute_id)
        
        # Check if user has access to this institute
        user = self.request.user
        if not user.is_super_admin():
            membership = get_object_or_404(
                Membership, 
                user=user, 
                institute=institute,
                status='ACTIVE'
            )
        
        return Membership.objects.filter(institute=institute)

class InviteMemberView(generics.CreateAPIView):
    """
    Invite a new member to an institute.
    """
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        institute_id = self.kwargs['pk']
        institute = get_object_or_404(Institute, pk=institute_id)
        
        # Check if user can invite members
        user = self.request.user
        if not user.is_super_admin():
            membership = get_object_or_404(
                Membership, 
                user=user, 
                institute=institute,
                role__in=['OWNER', 'ADMIN'],
                status='ACTIVE'
            )
        
        # Create invitation
        invitation = serializer.save(
            institute=institute,
            invited_by=user,
            token=str(uuid.uuid4()),
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        # TODO: Send email invitation

class MembershipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a membership.
    """
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Membership.objects.all()
        elif user.is_institute_admin():
            return Membership.objects.filter(
                institute__memberships__user=user,
                institute__memberships__role__in=['OWNER', 'ADMIN']
            )
        else:
            return Membership.objects.filter(user=user)

class MembershipUpdateView(generics.UpdateAPIView):
    """
    Update a membership.
    """
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin():
            return Membership.objects.all()
        elif user.is_institute_admin():
            return Membership.objects.filter(
                institute__memberships__user=user,
                institute__memberships__role__in=['OWNER', 'ADMIN']
            )
        else:
            return Membership.objects.filter(user=user)

class InvitationListView(generics.ListAPIView):
    """
    List all invitations for the current user.
    """
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invitation.objects.filter(email=self.request.user.email)

class InvitationDetailView(generics.RetrieveAPIView):
    """
    Retrieve an invitation.
    """
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invitation.objects.filter(email=self.request.user.email)

class AcceptInvitationView(generics.UpdateAPIView):
    """
    Accept an invitation.
    """
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        invitation = self.get_object()
        
        if invitation.email != request.user.email:
            return Response(
                {'error': 'This invitation is not for you'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if invitation.is_expired:
            return Response(
                {'error': 'This invitation has expired'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if invitation.status != 'PENDING':
            return Response(
                {'error': 'This invitation has already been processed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create membership
        Membership.objects.create(
            user=request.user,
            institute=invitation.institute,
            role=invitation.role,
            status='ACTIVE'
        )
        
        # Update invitation status
        invitation.status = 'ACCEPTED'
        invitation.save()
        
        return Response({'message': 'Invitation accepted successfully'})

class DeclineInvitationView(generics.UpdateAPIView):
    """
    Decline an invitation.
    """
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        invitation = self.get_object()
        
        if invitation.email != request.user.email:
            return Response(
                {'error': 'This invitation is not for you'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if invitation.status != 'PENDING':
            return Response(
                {'error': 'This invitation has already been processed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invitation.status = 'DECLINED'
        invitation.save()
        
        return Response({'message': 'Invitation declined successfully'}) 