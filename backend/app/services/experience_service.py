import re


def extract_years_of_experience(text: str):
    """
    Extract years of experience from text.
    Handles:
    - 3+ years
    - 5 years
    - 2 yrs
    - 1 year
    """

    text_lower = text.lower()

    patterns = [
        r"(\d+)\+?\s*years?",
        r"(\d+)\+?\s*yrs?"
    ]

    years = []

    for pattern in patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            years.append(int(match))

    if years:
        return max(years)

    return 0


def compute_experience_score(jd_text: str, resume_text: str):
    jd_years = extract_years_of_experience(jd_text)
    resume_years = extract_years_of_experience(resume_text)

    if jd_years == 0:
        return 1.0, jd_years, resume_years  # no requirement

    if resume_years >= jd_years:
        return 1.0, jd_years, resume_years
    else:
        score = resume_years / jd_years
        return float(score), jd_years, resume_years