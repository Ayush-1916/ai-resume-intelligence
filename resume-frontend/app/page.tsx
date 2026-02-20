"use client";

import { useState } from "react";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeFile || !jdText) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd_text", jdText);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("FULL RESPONSE:", data);
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Resume Intelligence
          </h1>
          <p className="text-gray-600">
            Upload your resume and compare it against any Job Description.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Resume Upload */}
          <div className="space-y-3">
            <label className="font-semibold text-gray-800">
              Upload Resume (PDF)
            </label>

            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:border-indigo-500 transition bg-white">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="resumeUpload"
                onChange={(e) =>
                  setResumeFile(e.target.files ? e.target.files[0] : null)
                }
              />
              <label htmlFor="resumeUpload" className="cursor-pointer">
                {resumeFile ? (
                  <p className="text-green-600 font-medium">
                    {resumeFile.name}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Click to upload your PDF resume
                  </p>
                )}
              </label>
            </div>
          </div>

          {/* JD Text */}
          <div className="space-y-3">
            <label className="font-semibold text-gray-800">
              Job Description
            </label>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* Results Section */}
        {result?.ats_analysis && (
          <div className="space-y-10">

            {/* ATS Score */}
            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                ATS Score
              </h2>
              <p className="text-5xl font-extrabold text-indigo-600 mt-4">
                {result?.ats_analysis?.ats_score}%
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCard
                title="Semantic"
                value={result.ats_analysis.breakdown.semantic_score}
                color="text-indigo-600"
              />
              <ScoreCard
                title="Skills"
                value={result.ats_analysis.breakdown.skill_score}
                color="text-green-600"
              />
              <ScoreCard
                title="Experience"
                value={result.ats_analysis.breakdown.experience_score}
                color="text-yellow-600"
              />
            </div>

            {/* Matched / Missing Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              <SkillSection
                title="Matched Skills"
                skills={result.ats_analysis.matched_skills}
                badgeColor="bg-green-100 text-green-700"
              />
              <SkillSection
                title="Missing Skills"
                skills={result.ats_analysis.missing_skills}
                badgeColor="bg-red-100 text-red-700"
              />
            </div>

            {/* AI Recommendations */}
            <div className="space-y-6">
              <SectionCard
                title="Overall Assessment"
                content={result.llm_feedback.overall_assessment}
              />

              <ListSection
                title="Skill Improvements"
                items={result.llm_feedback.skill_improvements}
              />

              <ListSection
                title="Experience Improvements"
                items={result.llm_feedback.experience_improvements}
              />
              <ListSection
                title="Bullet Improvements"
                items={result.llm_feedback.bullet_improvements}
              />

              <ListSection
                title="Actionable Suggestions"
                items={result.llm_feedback.actionable_suggestions}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function ScoreCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="font-medium text-gray-700">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}%</p>
    </div>
  );
}

function SkillSection({
  title,
  skills,
  badgeColor,
}: {
  title: string;
  skills: string[];
  badgeColor: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-500 text-sm">None</p>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-indigo-600 mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}

function ListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {items && items.length > 0 ? (
          items.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No suggestions available</li>
        )}
      </ul>
    </div>
  );
}