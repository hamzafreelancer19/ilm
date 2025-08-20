"""
ASGI config for ilm_kademy project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ilm_kademy.settings')

application = get_asgi_application() 