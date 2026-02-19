from google import genai
from google.genai import types
import numpy as np
from app.config import GEMINI_API_KEY

# Initialize once
client = genai.Client(api_key=GEMINI_API_KEY)


def get_embedding(text: str):
    try:
        result = client.models.embed_content(
            model='models/gemini-embedding-001',
            contents=text,
            
        )
        return result.embeddings[0].values
    except Exception as e:
        raise Exception(f"Embedding Error: {str(e)}")


def compute_similarity(text1: str, text2: str):
    emb1 = np.array(get_embedding(text1))
    emb2 = np.array(get_embedding(text2))

    similarity = np.dot(emb1, emb2) / (
        np.linalg.norm(emb1) * np.linalg.norm(emb2)
    )

    return float(similarity)