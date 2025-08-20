"""
Institute serializers for API endpoints.
"""
from rest_framework import serializers
from .models import Institute, Membership, Invitation
from users.serializers import UserProfileSerializer

class InstituteSerializer(serializers.ModelSerializer):
    """
    Basic institute serializer.
    """
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    member_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Institute
        fields = [
            'id', 'name', 'description', 'owner', 'owner_name', 'plan_tier', 
            'status', 'max_members', 'member_count', 'logo', 'website', 
            'address', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

class InstituteDetailSerializer(InstituteSerializer):
    """
    Detailed institute serializer with members.
    """
    members = serializers.SerializerMethodField()
    
    class Meta(InstituteSerializer.Meta):
        fields = InstituteSerializer.Meta.fields + ['members']
    
    def get_members(self, obj):
        members = obj.memberships.filter(status='ACTIVE')
        return MembershipSerializer(members, many=True).data

class MembershipSerializer(serializers.ModelSerializer):
    """
    Membership serializer.
    """
    user = UserProfileSerializer(read_only=True)
    institute_name = serializers.CharField(source='institute.name', read_only=True)
    
    class Meta:
        model = Membership
        fields = [
            'id', 'user', 'institute', 'institute_name', 'role', 'status',
            'joined_at', 'updated_at'
        ]
        read_only_fields = ['id', 'joined_at', 'updated_at']

class InvitationSerializer(serializers.ModelSerializer):
    """
    Invitation serializer.
    """
    institute_name = serializers.CharField(source='institute.name', read_only=True)
    invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Invitation
        fields = [
            'id', 'email', 'institute', 'institute_name', 'invited_by', 
            'invited_by_name', 'role', 'status', 'token', 'expires_at',
            'is_expired', 'created_at'
        ]
        read_only_fields = ['id', 'token', 'expires_at', 'created_at']
    
    def validate_email(self, value):
        # Check if user already has a membership in this institute
        institute = self.context.get('institute')
        if institute and Membership.objects.filter(
            user__email=value, 
            institute=institute
        ).exists():
            raise serializers.ValidationError(
                'User already has a membership in this institute'
            )
        return value 