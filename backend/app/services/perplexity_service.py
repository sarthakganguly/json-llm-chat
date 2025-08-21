import requests
from app.core.config import settings

def query_perplexity(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "pplx-7b-online",
        "messages": [
            {"role": "system", "content": "You are a helpful financial assistant. Answer questions based only on the provided context."},
            {"role": "user", "content": prompt},
        ],
    }
    
    try:
        response = requests.post("https://api.perplexity.ai/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f"Error calling Perplexity API: {e}")
        return "Error: Could not connect to the language model."
