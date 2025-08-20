"""
Core views for the application.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring.
    """
    permission_classes = []
    
    def get(self, request):
        """
        Return health status.
        """
        return Response({
            'status': 'OK',
            'message': 'Ilm Kademy Backend is running',
            'timestamp': request.data.get('timestamp', 'N/A')
        }, status=status.HTTP_200_OK) 