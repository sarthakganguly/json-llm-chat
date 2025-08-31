from sentence_transformers import SentenceTransformer

# This class will ensure the model is loaded only once.
class EmbeddingModelSingleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("Initializing Sentence Transformer model...")
            # Load the model into the instance
            cls._instance = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
            print("Sentence Transformer model initialized.")
        return cls._instance

# Create the single, globally accessible instance of the model.
embedding_model = EmbeddingModelSingleton()