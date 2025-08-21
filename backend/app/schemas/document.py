from pydantic import BaseModel
from celery.result import AsyncResult

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    context_used: str

class UploadResponse(BaseModel):
    task_id: str
    filename: str
    message: str

    def get_task_status(self):
        task_result = AsyncResult(self.task_id)
        return {
            "task_id": self.task_id,
            "status": task_result.status,
            "result": task_result.result,
        }
