import time
from .celery_app import celery
from sqlalchemy import text
from app.db.session import SessionLocal
from app.db.models import DocumentChunk
# Import the pre-loaded model instance
from app.services.embedding_service import embedding_model

@celery.task
def process_json_file(file_path: str, tenant_id: str):
    print(f"Starting ingestion for tenant {tenant_id} from file {file_path}")
    
    time.sleep(5) 
    chunks = [
        f"This is chunk 1 for tenant {tenant_id} from file {file_path}.",
        f"This is another chunk of data, specifically chunk 2 for tenant {tenant_id}.",
        "A final piece of context to be embedded.",
    ]
    print(f"Created {len(chunks)} chunks.")

    # 3. Create embeddings using the pre-loaded model.
    embeddings = embedding_model.encode(chunks)
    print("Created embeddings.")

    # 4. Store in PostgreSQL with pgvector for the correct tenant
    db = SessionLocal()
    try:
        with db.begin():
            db.execute(text(f'CREATE SCHEMA IF NOT EXISTS {tenant_id}'))
            db.execute(text(f'SET search_path TO {tenant_id}, public'))
            
            for i, chunk_text in enumerate(chunks):
                doc_chunk = DocumentChunk(
                    text=chunk_text,
                    embedding=embeddings[i]
                )
                db.add(doc_chunk)
    except Exception as e:
        print(f"Error during DB operation for tenant {tenant_id}: {e}")
        raise
    finally:
        db.close()

    print(f"Finished ingestion for tenant {tenant_id}")
    return {"status": "success", "chunks_created": len(chunks)}