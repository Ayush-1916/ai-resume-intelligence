from app.services.embedding_service import compute_similarity

text1 = "Machine learning engineer skilled in Python and deep learning."
text2 = "ML engineer with strong Python and deep learning experience."
text3 = "Marketing manager ."

print("Similar:", compute_similarity(text1, text2))
print("Different:", compute_similarity(text1, text3))