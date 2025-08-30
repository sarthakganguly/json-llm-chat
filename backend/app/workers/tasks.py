import time
from .celery_app import celery
from sentence_transformers import SentenceTransformer
from sqlalchemy import text
from app.db.session import SessionLocal
from app.db.models import DocumentChunk

@celery.task
def process_json_file(file_path: str, tenant_id: str):
    # In a real app, this file_path would point to a shared volume or cloud storage
    # For now, we simulate processing.
    
    print(f"Starting ingestion for tenant {tenant_id} from file {file_path}")
    
    # 1. Simulate loading and parsing a large JSON file
    time.sleep(5) # Simulate long processing time
    # In reality: data = streaming_json_parser(file_path)

    # 2. Perform semantic chunking
    # chunks = create_semantic_chunks(data)
    chunks = [
        f"This is chunk 1 for tenant {tenant_id} from file {file_path}.",
        f"This is another chunk of data, specifically chunk 2 for tenant {tenant_id}.",
        "A final piece of context to be embedded.",
    ]
    print(f"Created {len(chunks)} chunks.")

    # 3. Create embeddings
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    embeddings = embedding_model.encode(chunks)
    print("Created embeddings.")

    # 4. Store in PostgreSQL with pgvector for the correct tenant
    db = SessionLocal()
    try:
        # The 'with db.begin()' block manages the entire transaction.
        # It automatically commits on success or rolls back on failure.
        with db.begin():
            # Use the text() construct for executing raw SQL statements.
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
        # Re-raise the exception so the Celery task is marked as 'FAILED'.
        raise
    finally:
        db.close()

    print(f"Finished ingestion for tenant {tenant_id}")
    return {"status": "success", "chunks_created": len(chunks)}