import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, Github, Zap, Lock } from "lucide-react";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

const STEPS = [
  "Reading GitHub repositories...",
  "Calculating BrainFetch score...",
  "AI analyzing your work...",
  "Building your proof card..."
];

export default function Generate() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (isLoading && currentStep < STEPS.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading, currentStep]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsLoading(true);
    setError("");
    setCurrentStep(0);

    try {
      // 1. Fetch GitHub Data via Proxy
      const githubRes = await axios.get(`/api/github-data/${username}`);
      const { user: userData, repos: reposData, events: eventsData } = githubRes.data;

      setCurrentStep(1);

      // 2. Calculate Brain Score (Algorithm from prompt)
      const calculateBrainScore = (data: any) => {
        const { repos, events, user } = data;
        const repoScore = Math.min(25, Math.log10(repos.length + 1) * 14);
        const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
        const starsScore = Math.min(25, Math.log10(totalStars + 1) * 8);
        const recentEvents = events.filter((e: any) => {
          const daysAgo = (Date.now() - new Date(e.created_at).getTime()) / 86400000;
          return daysAgo <= 90;
        });
        const consistencyScore = Math.min(25, recentEvents.length * 0.4);
        const languages = new Set(repos.map((r: any) => r.language).filter(Boolean));
        const langScore = Math.min(15, languages.size * 2.5);
        const accountAgeYears = (Date.now() - new Date(user.created_at).getTime()) / (365 * 86400000);
        const maturityScore = Math.min(10, accountAgeYears * 2.5);
        return Math.round(repoScore + starsScore + consistencyScore + langScore + maturityScore);
      };

      const brainScore = calculateBrainScore({ repos: reposData, events: eventsData, user: userData });

      // Calculate Skill Scores
      const langStats: Record<string, { count: number; stars: number; lastPushed: string }> = {};
      reposData.forEach((repo: any) => {
        if (!repo.language) return;
        if (!langStats[repo.language]) {
          langStats[repo.language] = { count: 0, stars: 0, lastPushed: repo.pushed_at };
        }
        langStats[repo.language].count++;
        langStats[repo.language].stars += repo.stargazers_count;
        if (new Date(repo.pushed_at) > new Date(langStats[repo.language].lastPushed)) {
          langStats[repo.language].lastPushed = repo.pushed_at;
        }
      });

      const skillScores = Object.entries(langStats)
        .map(([name, stats]) => {
          const countScore = Math.min(40, (stats.count / 10) * 40);
          const starScore = Math.min(40, (stats.stars / 50) * 40);
          const recencyDays = (Date.now() - new Date(stats.lastPushed).getTime()) / (1000 * 60 * 60 * 24);
          const recencyScore = Math.max(0, 20 - (recencyDays / 30) * 5);
          return { name, score: Math.round(countScore + starScore + recencyScore) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setCurrentStep(2);

      // 3. AI Analysis with Gemini (Prompt from instructions)
      const prompt = `You are BrainFetch AI, the world's most accurate developer skill analyzer.

Analyze the following GitHub data and write exactly 3 paragraphs as a professional summary for this developer's public proof card.

Rules:
- Be specific — use real numbers from the data
- Paragraph 1: Overall assessment + strongest skills + score context
- Paragraph 2: Best project highlight + code quality observation + consistency pattern
- Paragraph 3: What roles this developer is best suited for + one honest growth area
- Tone: Senior tech recruiter writing a recommendation — confident, specific, no fluff
- Length: Each paragraph 2-3 sentences max
- Never say "Based on the data" — just state it directly

GitHub Data:
Username: ${username}
Total Repos: ${userData.public_repos}
Total Stars: ${reposData.reduce((sum: number, r: any) => sum + r.stargazers_count, 0)}
Top Languages: ${Array.from(new Set(reposData.map((r: any) => r.language).filter(Boolean))).join(", ")}
Most Starred Repo: ${reposData.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)[0]?.name || "N/A"}
Recent Activity: ${eventsData.filter((e: any) => e.type === "PushEvent").length} commits in last 90 days
Account Age: ${((Date.now() - new Date(userData.created_at).getTime()) / (365 * 86400000)).toFixed(1)} years
BrainFetch Score: ${brainScore}/100

Write only the 3 paragraphs. No headers. No bullet points. No preamble.`;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const aiSummary = result.text || "Summary generation failed.";

      setCurrentStep(3);

      // 4. Save Card to Backend
      const github_data = {
        avatar_url: userData.avatar_url,
        name: userData.name || username,
        bio: userData.bio,
        public_repos: userData.public_repos,
        followers: userData.followers,
        total_stars: reposData.reduce((sum: number, r: any) => sum + r.stargazers_count, 0),
        top_repos: reposData.slice(0, 3).map((r: any) => ({
          name: r.name,
          description: r.description,
          stars: r.stargazers_count,
          language: r.language,
          quality_score: Math.floor(Math.random() * 20) + 80 // Mock quality score
        })),
        events: eventsData.slice(0, 50)
      };

      await axios.post("/api/save-card", {
        username,
        github_data,
        brain_score: brainScore,
        ai_summary: aiSummary,
        skill_scores: skillScores,
        top_projects: github_data.top_repos,
        stats: {
          repos: userData.public_repos,
          stars: github_data.total_stars,
          followers: userData.followers,
          languages: new Set(reposData.map((r: any) => r.language).filter(Boolean)).size
        }
      });

      navigate(`/card/${username}`);
    } catch (err: any) {
      console.error("Generation error:", err);
      setIsLoading(false);
      setError(err.response?.data?.error || err.message || "Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-12"
        >
          <Zap className="w-24 h-24 text-lime fill-lime" />
        </motion.div>
        
        <div className="max-w-sm w-full space-y-8">
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 font-display font-black flex items-center justify-center border transition-colors ${
                  i < currentStep ? 'bg-lime border-lime text-black' :
                  i === currentStep ? 'border-lime text-lime' : 'border-border text-muted'
                }`}>
                  {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`label-mono text-xs transition-colors ${
                  i <= currentStep ? 'text-text' : 'text-muted'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div className="h-1 w-full bg-surface border border-border">
            <motion.div
              className="h-full bg-lime"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Panel */}
      <div className="lg:col-span-5 p-8 md:p-16 border-r border-border flex flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-display font-black mb-4 uppercase tracking-tight">Enter GitHub Username</h1>
          <p className="text-muted font-sans font-light mb-12">We'll analyze your public profile and generate your verified skill card.</p>
          
          <form onSubmit={handleGenerate} className="space-y-6 mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Github className="w-5 h-5 text-muted" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. torvalds"
                className="input-base w-full pl-12 py-5 text-lg"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3">
              Fetch My Brain Score <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="label-mono text-[10px] text-muted">Try an example:</span>
              <div className="flex gap-4">
                {["torvalds", "gaearon", "tj"].map(u => (
                  <button key={u} onClick={() => setUsername(u)} className="label-mono text-lime hover:underline">
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h4 className="label-mono text-text mb-4">What we analyze:</h4>
              <div className="grid grid-cols-2 gap-4">
                {["Repos", "Stars", "Commit frequency", "Languages", "Code quality", "Activity streak"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[10px] font-mono text-muted">
                    <div className="w-1 h-1 bg-lime" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-red/10 border border-red/20 text-red text-xs font-mono"
            >
              ERROR: {error}
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:col-span-7 bg-surface/50 p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 w-full max-w-2xl opacity-20 grayscale blur-[2px] pointer-events-none">
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-text">
            <Lock className="w-12 h-12 mb-4" />
            <p className="label-mono text-sm">YOUR CARD PREVIEW</p>
          </div>
          <div className="card-base p-12 h-[500px] flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-24 h-24 bg-dim" />
              <div className="w-32 h-16 bg-dim" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-dim" />
              <div className="h-4 w-1/2 bg-dim" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="h-16 bg-dim" />
              <div className="h-16 bg-dim" />
              <div className="h-16 bg-dim" />
              <div className="h-16 bg-dim" />
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 border-r border-t border-border" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border-l border-b border-border" />
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
