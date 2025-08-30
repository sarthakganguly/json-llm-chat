from celery import Celery
from app.core.config import settings

# Initialize the Celery application
celery = Celery(
    'app',  # Name of the main module
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    # This is the modern, correct way to tell Celery where to find task modules.
    include=['app.workers.tasks']
)

# Optional: Update any additional configuration
celery.conf.update(
    task_track_started=True,
)