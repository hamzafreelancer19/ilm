"""
Serializers for the assignments app.
"""
from rest_framework import serializers
from .models import Assignment, AssignmentSubmission

class AssignmentSerializer(serializers.ModelSerializer):
    """
    Basic serializer for Assignment model.
    """
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    institute_name = serializers.CharField(source='institute.name', read_only=True)
    submission_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 'chapter', 'institute', 'institute_name',
            'due_date', 'max_points', 'is_active', 'allow_late_submission',
            'late_penalty', 'created_by', 'created_by_name', 'created_at',
            'updated_at', 'submission_count'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_submission_count(self, obj):
        return obj.submissions.count()

class AssignmentDetailSerializer(AssignmentSerializer):
    """
    Detailed serializer for Assignment model.
    """
    class Meta(AssignmentSerializer.Meta):
        fields = AssignmentSerializer.Meta.fields

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for AssignmentSubmission model.
    """
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = AssignmentSubmission
        fields = [
            'id', 'assignment', 'assignment_title', 'student', 'student_name',
            'status', 'text_content', 'file_upload', 'submitted_at', 'graded_at',
            'grade', 'max_grade', 'feedback', 'graded_by'
        ]
        read_only_fields = ['id', 'student', 'submitted_at', 'graded_at', 'graded_by'] 