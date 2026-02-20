"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ai-resume-intelligence-1.onrender.com";

  // Apply dark mode class to root
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode, mounted]);

  const handleAnalyze = async () => {
    if (!jdText || !resumeFile) {
      setError("Please upload resume and paste job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("jd_text", jdText);
    formData.append("resume", resumeFile);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Dark Mode Toggle
        <div className="flex justify-end">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-md text-sm transition"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div> */}

        {/* Gradient Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Resume Intelligence
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Optimize your resume against any Job Description using AI.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Resume Upload */}
          <div className="space-y-3 backdrop-blur-xl bg-white/30 dark:bg-gray-800/60 border border-white/20 p-6 rounded-2xl shadow-lg">
            <label className="font-semibold">
              Upload Resume (PDF)
            </label>

            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:border-indigo-500 transition bg-white/70 dark:bg-black/40">
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
                  <p className="text-gray-600 dark:text-gray-300">
                    Click to upload PDF resume
                  </p>
                )}
              </label>
            </div>
          </div>

          {/* JD Input */}
          <div className="space-y-3 backdrop-blur-xl bg-white/30 dark:bg-gray-800/60 border border-white/20 p-6 rounded-2xl shadow-lg">
            <label className="font-semibold">
              Job Description
            </label>
            <textarea
              className="w-full h-64 p-4 rounded-xl bg-white/70 dark:bg-black/40 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-200 dark:bg-red-900 text-center p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* Results Section */}
        {result?.ats_analysis && (
          <div className="space-y-12">

            {/* Overall Score */}
            <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/60 border border-white/20 p-10 rounded-3xl shadow-xl flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-6">
                Overall ATS Score
              </h2>

              <div className="w-40 h-40">
                <CircularProgressbar
                  value={result.ats_analysis.ats_score}
                  text={`${result.ats_analysis.ats_score}%`}
                  styles={buildStyles({
                    textSize: "18px",
                    pathColor:
                      result.ats_analysis.ats_score > 70
                        ? "#16a34a"
                        : result.ats_analysis.ats_score > 40
                        ? "#f59e0b"
                        : "#dc2626",
                    textColor: darkMode ? "#ffffff" : "#111827",
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: "Semantic Match",
                  value: result.ats_analysis.breakdown.semantic_score,
                },
                {
                  label: "Skill Match",
                  value: result.ats_analysis.breakdown.skill_score,
                },
                {
                  label: "Experience Alignment",
                  value: result.ats_analysis.breakdown.experience_score,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/60 border border-white/20 p-6 rounded-2xl shadow-lg"
                >
                  <p>{item.label}</p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {item.value}%
                  </p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-100/60 dark:bg-green-900/40 p-6 rounded-2xl backdrop-blur-xl">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  Matched Skills
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.ats_analysis.matched_skills?.length > 0 ? (
                    result.ats_analysis.matched_skills.map(
                      (skill: string, i: number) => (
                        <li key={i}className="text-gray-800 dark:text-gray-200">{skill}</li>
                      )
                    )
                  ) : (
                    <li>No matched skills found</li>
                  )}
                </ul>
              </div>

              <div className="bg-red-100/60 dark:bg-red-900/40 p-6 rounded-2xl backdrop-blur-xl">
                <h3 className="font-semibold mb-3">
                  Missing Skills
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.ats_analysis.missing_skills?.length > 0 ? (
                    result.ats_analysis.missing_skills.map(
                      (skill: string, i: number) => (
                        <li key={i}>{skill}</li>
                      )
                    )
                  ) : (
                    <li>No missing skills</li>
                  )}
                </ul>
              </div>
            </div>

            {/* LLM Feedback */}
            {result.llm_feedback && !result.llm_feedback.error && (
              <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/60 border border-white/20 p-8 rounded-3xl shadow-lg space-y-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Recommendations
                </h3>

                {[
                  { title: "Skill Improvements", key: "skill_improvements" },
                  { title: "Experience Improvements", key: "experience_improvements" },
                  { title: "Bullet Improvements", key: "bullet_improvements" },
                  { title: "Actionable Suggestions", key: "actionable_suggestions" },
                ].map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      {section.title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.llm_feedback[section.key]?.length > 0 ? (
                        result.llm_feedback[section.key].map(
                          (item: string, i: number) => (
                            <li key={i}>{item}</li>
                          )
                        )
                      ) : (
                        <li>No suggestions available</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}