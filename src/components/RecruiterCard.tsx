import { BadgeCheck, Star, GitBranch, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import SkillBar from "./SkillBar";

interface RecruiterCardProps {
  name: string;
  username: string;
  avatar_url: string;
  score: number;
  topSkills: { name: string; score: number }[];
  repos: number;
  stars: number;
  streak: number;
  key?: string | number;
}

export default function RecruiterCard({
  name,
  username,
  avatar_url,
  score,
  topSkills,
  repos,
  stars,
  streak
}: RecruiterCardProps) {
  return (
    <div className="card-base p-6 group rounded-[4px]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 border border-border overflow-hidden rounded-[2px]">
            <img src={avatar_url} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-text group-hover:text-lime transition-colors uppercase tracking-tight">{name}</h4>
            <p className="font-mono text-lime text-[10px] uppercase font-bold">@{username}</p>
          </div>
        </div>
        <button className="text-muted hover:text-lime transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display font-black text-4xl text-lime">{score}</span>
          <span className="font-mono text-muted text-[10px] uppercase font-bold tracking-widest">Brain Score</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {topSkills.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} score={skill.score} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="text-center p-2 bg-surface border border-border rounded-[2px]">
          <div className="font-mono text-xs text-text font-bold">{repos}</div>
          <div className="font-mono text-[8px] text-muted uppercase font-bold">Repos</div>
        </div>
        <div className="text-center p-2 bg-surface border border-border rounded-[2px]">
          <div className="font-mono text-xs text-text font-bold">{stars}</div>
          <div className="font-mono text-[8px] text-muted uppercase font-bold">Stars</div>
        </div>
        <div className="text-center p-2 bg-surface border border-border rounded-[2px]">
          <div className="font-mono text-xs text-text font-bold">{streak}d</div>
          <div className="font-mono text-[8px] text-muted uppercase font-bold">Streak</div>
        </div>
      </div>

      <Link
        to={`/card/${username}`}
        className="btn-secondary w-full py-3 text-[10px] text-center block font-mono uppercase font-bold tracking-widest"
      >
        View Full Card →
      </Link>
    </div>
  );
}
