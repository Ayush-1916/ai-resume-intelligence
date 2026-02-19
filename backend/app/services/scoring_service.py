from app.services.embedding_service import compute_similarity
from app.services.skill_service import compute_skill_match
from app.services.experience_service import compute_experience_score


def compute_ats_score(jd_text: str, resume_text: str):
    # 1️⃣ Semantic similarity (raw cosine 0–1)
    raw_similarity = compute_similarity(jd_text, resume_text)

    # 🔧 Calibration threshold
    threshold = 0.65

    if raw_similarity < threshold:
        semantic_score = 0
    else:
        semantic_score = (raw_similarity - threshold) / (1 - threshold)

    # 2️⃣ Skill match
    skill_score, matched_skills, missing_skills = compute_skill_match(
        jd_text, resume_text
    )

    # 3️⃣ Experience alignment
    experience_score, jd_years, resume_years = compute_experience_score(
        jd_text, resume_text
    )

    # 4️⃣ Weighted score
    ats_score = (
        0.5 * semantic_score
        + 0.3 * skill_score
        + 0.2 * experience_score
    )

    return {
        "ats_score": round(ats_score * 100, 2),
        "breakdown": {
            "semantic_score": round(semantic_score * 100, 2),
            "skill_score": round(skill_score * 100, 2),
            "experience_score": round(experience_score * 100, 2),
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "jd_required_years": jd_years,
        "resume_years": resume_years,
    }