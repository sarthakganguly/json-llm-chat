from sqlalchemy.orm import Session
from app.db.models import DocumentChunk
from app.services import gemini_service
# Import the pre-loaded model instance
from app.services.embedding_service import embedding_model

def get_answer_from_rag(query: str, db: Session):
    # 1. Embed the user's query using the pre-loaded model.
    query_embedding = embedding_model.encode(query)

    # 2. Retrieve relevant chunks from the database
    # The `search_path` is already set by the dependency, so this query is tenant-safe
    relevant_chunks = db.query(DocumentChunk).order_by(
        DocumentChunk.embedding.l2_distance(query_embedding)
    ).limit(5).all()

    if not relevant_chunks:
        return {"answer": "I could not find any relevant information in your documents to answer that question.", "context_used": "No context found."}

    context_text = "\n- ".join([chunk.text for chunk in relevant_chunks])
    
    # 3. Construct the prompt for the Gemini API
    prompt = f"""
    Context from financial records:
    - {context_text}

    Based ONLY on the context provided, answer the following question:
    Question: "{query}"
    """
    
    # 4. Call the Google Gemini API and get the final answer
    final_answer = gemini_service.query_gemini(prompt)
    return {"answer": final_answer, "context_used": context_text}