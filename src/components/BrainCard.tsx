import { motion } from "framer-motion";
import { BadgeCheck, Star, Share2, Download, Zap, Github } from "lucide-react";
import SkillBar from "./SkillBar";
import ActivityGrid from "./ActivityGrid";
import ScoreCounter from "./ScoreCounter";

interface BrainCardProps {
  data: {
    username: string;
    name: string;
    avatar_url: string;
    bio: string;
    brain_score: number;
    skill_scores: { name: string; score: number }[];
    ai_summary: string;
    top_projects: { name: string; description: string; stars: number; language: string }[];
    stats: { repos: number; stars: number; followers: number; languages: number };
    created_at: string;
    is_pro?: boolean;
  };
}

export default function BrainCard({ data }: BrainCardProps) {
  const {
    username,
    name,
    avatar_url,
    bio,
    brain_score,
    skill_scores,
    ai_summary,
    top_projects,
    stats,
    created_at,
    is_pro
  } = data;

  const handleShare = () => {
    const url = `${window.location.origin}/card/${username}`;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-4xl mx-auto bg-surface border border-border rounded-[6px] overflow-hidden shadow-2xl"
    >
      {/* Lime Top Border */}
      <div className="h-[2px] w-full bg-lime shadow-[0_0_12px_rgba(212,255,0,0.5)]" />

      {/* Profile Hero */}
      <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-start bg-elevated/30">
        <div className="relative shrink-0">
          <div className="w-32 h-32 border border-lime/30 p-1 rounded-[4px]">
            <img
              src={avatar_url}
              alt={username}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-[2px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-bg border border-lime/50 px-3 py-1 flex items-center gap-2 rounded-[4px]">
            <BadgeCheck className="w-4 h-4 text-lime" />
            <span className="font-mono text-lime text-[8px] uppercase font-bold">Verified</span>
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-display font-black mb-2 uppercase tracking-tight">{name}</h2>
              <p className="font-mono text-lime mb-4 text-xs font-bold">@{username}</p>
              <div className="flex flex-wrap gap-2">
                {skill_scores.slice(0, 3).map(s => (
                  <span key={s.name} className="font-mono text-[8px] bg-surface border border-border px-2 py-0.5 text-muted uppercase font-bold">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-7xl font-display font-black text-lime leading-none">
                  <ScoreCounter value={brain_score} />
                </span>
                <span className="text-xl font-display font-bold text-muted">/100</span>
              </div>
              <p className="text-green font-mono text-[10px] uppercase mt-2 tracking-widest font-bold">
                Top {Math.max(1, 100 - brain_score)}% Globally
              </p>
            </div>
          </div>
          <p className="text-text/70 font-sans font-light leading-relaxed max-w-2xl italic text-sm">
            "{bio || "No bio provided."}"
          </p>
        </div>
      </div>

      {/* Verified Strip */}
      <div className="bg-green/5 border-y border-green/10 px-8 py-3 flex items-center gap-3">
        <BadgeCheck className="w-4 h-4 text-green" />
        <p className="font-mono text-green text-[9px] uppercase font-bold">
          Verified by BrainFetch AI · Data pulled live from GitHub API · Generated {new Date(created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        {[
          { label: "Total Repos", value: stats.repos },
          { label: "Stars Earned", value: stats.stars },
          { label: "Followers", value: stats.followers },
          { label: "Languages", value: stats.languages }
        ].map((stat, i) => (
          <div key={i} className={`p-8 text-center ${i < 3 ? 'border-r border-border' : ''}`}>
            <div className="text-2xl font-display font-black text-lime mb-2">{stat.value}</div>
            <div className="font-mono text-muted text-[9px] uppercase font-bold">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="p-8 md:p-12 grid md:grid-cols-2 gap-16">
        {/* Left Column: AI Summary & Heatmap */}
        <div className="space-y-12">
          <div className="border-l-2 border-lime pl-8">
            <h3 className="font-mono text-lime mb-8 text-xs uppercase font-bold tracking-widest">BrainFetch AI Analysis</h3>
            <div className="text-text/80 font-sans font-light leading-relaxed space-y-6 text-sm">
              {ai_summary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-text mb-8 text-xs uppercase font-bold tracking-widest">Commit Activity</h3>
            <ActivityGrid events={[]} />
            <p className="font-mono text-muted text-[8px] mt-4 uppercase font-bold">Last 90 days of public activity</p>
          </div>
        </div>

        {/* Right Column: Skills & Top Repos */}
        <div className="space-y-12">
          <div>
            <h3 className="font-mono text-text mb-8 text-xs uppercase font-bold tracking-widest">Skill Proficiency</h3>
            <div className="space-y-6">
              {skill_scores.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} score={skill.score} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-text mb-8 text-xs uppercase font-bold tracking-widest">Featured Repositories</h3>
            <div className="space-y-4">
              {top_projects.map((repo) => (
                <div key={repo.name} className="p-5 bg-elevated/50 border border-border hover:border-border-hover transition-all group rounded-[4px]">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-display font-bold text-xs uppercase group-hover:text-lime transition-colors">{repo.name}</h4>
                    <Github className="w-4 h-4 text-muted group-hover:text-lime transition-colors" />
                  </div>
                  <p className="text-xs text-muted font-sans font-light line-clamp-2 mb-4 leading-relaxed">{repo.description || "No description."}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[8px] text-text/60 uppercase font-bold">{repo.language}</span>
                      <div className="flex items-center gap-1 text-[8px] font-mono text-muted uppercase font-bold">
                        <Star className="w-2 h-2" />
                        {repo.stars}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-8 border-t border-border bg-elevated/20 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-lime fill-lime" />
          <span className="font-mono text-muted text-[9px] uppercase font-bold">
            Verified by <span className="text-text">BrainFetch AI</span> · Tamper-proof Card
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleShare}
            className="btn-secondary py-2 px-6 text-[10px] font-mono uppercase font-bold flex items-center gap-2"
          >
            <Share2 className="w-3 h-3" />
            Share Link
          </button>
          <button className="btn-primary py-2 px-6 text-[10px] font-mono uppercase font-bold flex items-center gap-2">
            <Download className="w-3 h-3" />
            Export PNG
          </button>
        </div>
      </div>
    </motion.div>
  );
}
