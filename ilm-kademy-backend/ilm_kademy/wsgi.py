"""
WSGI config for ilm_kademy project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ilm_kademy.settings')

application = get_wsgi_application() 