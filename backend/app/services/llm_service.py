import requests
import json
from app.config import GEMINI_API_KEY

print("DEBUG API KEY:", GEMINI_API_KEY)
GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"


def generate_text(prompt: str):
    headers = {
        "Content-Type": "application/json",
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        headers=headers,
        data=json.dumps(payload)
    )

    if response.status_code != 200:
        raise Exception(f"Gemini API Error: {response.text}")

    result = response.json()
    return result["candidates"][0]["content"]["parts"][0]["text"]



def generate_resume_feedback(jd_text: str, resume_text: str, ats_result: dict):
    prompt = f"""
You are an AI hiring assistant.

You must strictly base your evaluation on the computed ATS analysis below.

===== ATS ANALYSIS =====
Overall ATS Score: {ats_result["ats_score"]}%

Semantic Similarity Score: {ats_result["breakdown"]["semantic_score"]}%
Skill Match Score: {ats_result["breakdown"]["skill_score"]}%
Experience Alignment Score: {ats_result["breakdown"]["experience_score"]}%

JD Required Years: {ats_result["jd_required_years"]}
Resume Years: {ats_result["resume_years"]}

Matched Skills: {ats_result["matched_skills"]}
Missing Skills: {ats_result["missing_skills"]}
========================

Now evaluate the resume accordingly.

Job Description:
{jd_text}

Resume:
{resume_text}

IMPORTANT:
- You MUST respect the experience mismatch if Resume Years < JD Required Years.
- You MUST emphasize missing skills.
- Do NOT contradict the ATS analysis.
- Return ONLY valid JSON.
- Do NOT include markdown or extra text.

Return strictly:

{{
  "overall_assessment": "string",
  "skill_improvements": ["string"],
  "experience_improvements": ["string"],
  "bullet_improvements": ["string"],
  "actionable_suggestions": ["string"]
}}
"""

    raw_output = generate_text(prompt)

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse LLM response",
            "raw_output": raw_output
        }