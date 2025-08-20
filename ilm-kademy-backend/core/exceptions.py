"""
Custom exception handler for consistent error responses.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.http import Http404
from django.utils.translation import gettext_lazy as _

def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error format.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the error response format
        error_data = {
            'code': response.status_code,
            'message': response.data.get('detail', str(response.data)),
            'fields': None
        }
        
        # Handle validation errors
        if isinstance(response.data, dict) and 'detail' not in response.data:
            if 'non_field_errors' in response.data:
                error_data['message'] = response.data['non_field_errors'][0]
            else:
                error_data['fields'] = response.data
                error_data['message'] = 'Validation error'
        
        response.data = error_data
        return response
    
    # Handle Django-specific exceptions
    if isinstance(exc, ValidationError):
        error_data = {
            'code': status.HTTP_400_BAD_REQUEST,
            'message': 'Validation error',
            'fields': exc.message_dict if hasattr(exc, 'message_dict') else str(exc)
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
    
    if isinstance(exc, Http404):
        error_data = {
            'code': status.HTTP_404_NOT_FOUND,
            'message': 'Resource not found',
            'fields': None
        }
        return Response(error_data, status=status.HTTP_404_NOT_FOUND)
    
    # Handle unexpected errors
    error_data = {
        'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
        'message': 'Internal server error',
        'fields': None
    }
    return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 