import re

# Basic technical skill dictionary (expand later)
SKILL_KEYWORDS = [
    "python", "java", "c++", "sql", "mysql", "postgresql",
    "machine learning", "deep learning", "tensorflow", "pytorch",
    "scikit-learn", "docker", "kubernetes", "aws", "azure",
    "gcp", "fastapi", "django", "flask", "react", "node",
    "nlp", "computer vision", "pandas", "numpy"
]


def extract_skills(text: str):
    text_lower = text.lower()
    found_skills = []

    for skill in SKILL_KEYWORDS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return list(set(found_skills))


def compute_skill_match(jd_text: str, resume_text: str):
    jd_skills = extract_skills(jd_text)
    resume_skills = extract_skills(resume_text)

    if not jd_skills:
        return 0.0, [], []

    matched = list(set(jd_skills) & set(resume_skills))
    missing = list(set(jd_skills) - set(resume_skills))

    score = len(matched) / len(jd_skills)

    return float(score), matched, missing