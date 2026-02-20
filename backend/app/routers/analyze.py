from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.scoring_service import compute_ats_score
from app.services.llm_service import generate_resume_feedback
from app.utils.text_extraction import extract_text_from_pdf

router = APIRouter()


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd_text: str = Form(...)
):
    try:
        resume_bytes = await resume.read()
        resume_text = extract_text_from_pdf(resume_bytes)

        ats_result = compute_ats_score(jd_text, resume_text)

        try:
            feedback = generate_resume_feedback(jd_text, resume_text, ats_result)
        except Exception as llm_error:
            feedback = {
                "overall_assessment": "LLM feedback temporarily unavailable due to quota limits.",
                "skill_improvements": [],
                "experience_improvements": [],
                "bullet_improvements": [],
                "actionable_suggestions": []
            }

        return {
            "ats_analysis": ats_result,
            "llm_feedback": feedback
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))