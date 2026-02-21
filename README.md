# AI Resume Intelligence

An AI-powered resume screening system that analyzes resumes against a job description and generates:

1. ATS Score (weighted scoring system)

   ○ Skill match analysis

   ○ Experience alignment evaluation

   ○ Structured AI feedback for resume improvement
  

🔗 Live Demo (Frontend): https://ai-resume-intelligence.vercel.app

🔗 Backend API: https://ai-resume-intelligence-1.onrender.com

## Features

1. ATS Score Engine
   
   ○ Semantic similarity using Gemini Embeddings (3072-dim vectors)
	
   ○ Skill keyword matching
	
   ○ Experience alignment scoring
 	
   ○ Weighted scoring formula

2. AI Feedback Generation
	
   ○ Structured JSON output
	
   ○ Skill improvement suggestions
	
   ○	Experience alignment suggestions
	
   ○	Bullet refinement suggestions
	
   ○	Actionable resume recommendations

3. Clean Web Interface
	
   ○	PDF resume upload

   ○ Job description input
	
   ○	Circular ATS visualization
	
   ○	Matched vs missing skills breakdown
	
   ○	Structured AI recommendation display


## Scoring Architecture

The ATS Score is computed using:

ATS Score = 0.5 × Semantic Similarity + 0.3 × Skill Match Score + 0.2 × Experience Alignment
 
1. Semantic Similarity
   
	 •	Generated using gemini-embedding-001
	
   •	Cosine similarity comparison

2. Skill Match

	 •	Extracted keywords from JD
	
   •	Compared against resume content

3. Experience Alignment
	
   •	Years of experience parsed from JD and resume
	
   •	Penalizes mismatch automatically

## Tech Stack

1. Backend
	
   •	FastAPI
	
   •	Gemini API (Embeddings + LLM)
	
   •	Scikit-learn (cosine similarity)
	
   •	PDFPlumber (text extraction)
	
   •	Docker
	
   •	Render (deployment)

2. Frontend
	
   •	Next.js
	
   •	Tailwind CSS
	
   •	React Circular Progressbar
	
   •	Vercel (deployment)


## Use Cases
	
   •	Students optimizing resumes for specific job roles
	 
   •	Recruiters analyzing resume alignment
	 
   •	AI/ML experimentation with semantic scoring
	 
   •	Demonstration of end-to-end AI product deployment


## API Notes
	 
   •	Gemini Free Tier: 20 requests/day
	 
   •	Rate limiting handled at backend level
	 
   •	Embedding dimension: 3072


 ## Author

Ayush Koge
B.Tech IT | AI/ML Engineer
GitHub: https://github.com/Ayush-1916


## Future Improvements
	
  •	Smart resume rewriting (section-wise)
	
  •	Multi-JD comparison
	
  •	Recruiter dashboard mode
	
  •	Persistent resume storage
	
  •	Improved semantic weighting

