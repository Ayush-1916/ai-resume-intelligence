from app.services.scoring_service import compute_ats_score

jd = "Machine Learning"
resume = "machine learning"

result = compute_ats_score(jd, resume)

print(result)