from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str):
    return model.encode(text)


def compute_similarity(text1: str, text2: str):
    emb1 = get_embedding(text1)
    emb2 = get_embedding(text2)

    score = cosine_similarity([emb1], [emb2])[0][0]
    return float(score)