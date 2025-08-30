import google.generativeai as genai
from app.core.config import settings

# Configure the Gemini API with the key from settings
genai.configure(api_key=settings.GOOGLE_API_KEY)

def query_gemini(prompt: str) -> str:
    """
    Sends a prompt to the Google Gemini Pro model and returns the response.
    """
    # For text-only input, use the gemini-pro model
    model = genai.GenerativeModel('gemini-pro')
    
    # System instructions can be part of the prompt for Gemini
    system_enhanced_prompt = (
        "You are a helpful financial assistant. Answer questions based only on the provided context.\n"
        "----------------\n"
        f"{prompt}"
    )

    try:
        response = model.generate_content(system_enhanced_prompt)
        # Accessing the text part of the response
        return response.text
    except Exception as e:
        print(f"Error calling Google Gemini API: {e}")
        return "Error: Could not connect to the language model."