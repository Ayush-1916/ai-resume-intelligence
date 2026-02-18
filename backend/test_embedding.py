from app.services.llm_service import generate_resume_feedback
from app.services.scoring_service import compute_ats_score


jd = """
We are looking for a Machine Learning Engineer with 3+ years of experience
in building scalable ML systems.

Required Skills:
- Strong proficiency in Python
- Experience with Docker and Kubernetes
- Hands-on experience with AWS (S3, EC2, SageMaker)
- Deep Learning frameworks such as TensorFlow or PyTorch
- Experience deploying ML models in production
- Knowledge of NLP or Computer Vision

Preferred:
- Experience with FastAPI or Flask
- Experience working with large datasets
"""
resume = """
Machine Learning Engineer with 2 years of experience in developing predictive models.

Skills:
Python, PyTorch, TensorFlow, FastAPI, SQL, NLP.

Experience:
Developed deep learning models for text classification using PyTorch.
Built REST APIs using FastAPI for model inference.
Worked with large datasets and performed feature engineering.
Deployed models locally but no production cloud deployment experience.

Projects:
- NLP based sentiment analysis system.
- Real-time object detection using OpenCV.
"""

ats_result = compute_ats_score(jd, resume)

feedback = generate_resume_feedback(jd, resume, ats_result)

print("ATS RESULT:\n", ats_result)
print("\nLLM FEEDBACK:\n", feedback)