import requests
import json
import re
from app.config import GEMINI_API_KEY

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
        ],
        "generationConfig": {
            "temperature": 0.2,  # Lower temperature = more deterministic JSON
        }
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


def safe_json_parse(raw_output: str):
    """
    Attempts to safely parse LLM JSON output.
    Handles markdown wrapping and malformed outputs.
    """

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        pass

    # Remove markdown code fences if present
    cleaned = re.sub(r"```json|```", "", raw_output).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Final fallback: return structured wrapper
        return {
            "overall_assessment": raw_output,
            "skill_improvements": [],
            "experience_improvements": [],
            "bullet_improvements": [],
            "actionable_suggestions": []
        }


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

Job Description:
{jd_text}

Resume:
{resume_text}

IMPORTANT:
- You MUST respect experience mismatch.
- You MUST emphasize missing skills.
- Do NOT contradict ATS analysis.
- Return ONLY valid JSON.
- No markdown.
- No explanation outside JSON.

Return strictly this format:

{{
  "overall_assessment": "string",
  "skill_improvements": ["string"],
  "experience_improvements": ["string"],
  "bullet_improvements": ["string"],
  "actionable_suggestions": ["string"]
}}
"""

    raw_output = generate_text(prompt)

    structured_output = safe_json_parse(raw_output)

    return structured_output