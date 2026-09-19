import os
import logging
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

try:
    call_command('migrate', interactive=False)
except Exception as exc:
    logging.getLogger(__name__).error(f"Startup migration: {exc}")
