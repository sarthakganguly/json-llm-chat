import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.core.security import get_current_user
from app.db.models import User
from app.workers.tasks import process_json_file
from app.schemas.document import UploadResponse

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
def upload_financial_data(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only JSON files are accepted.")

    # In a real app, you'd upload to S3/GCS and pass the URI to the worker.
    # Here, we save it locally in the container (this is temporary storage).
    temp_file_path = f"/app/temp_{current_user.tenant_id}_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Dispatch the background task
    task = process_json_file.delay(temp_file_path, current_user.tenant_id)
    
    return UploadResponse(
        task_id=task.id,
        filename=file.filename,
        message="File upload successful. Processing has started in the background."
    )
