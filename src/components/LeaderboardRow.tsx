import { BadgeCheck, Star, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  username: string;
  avatar_url: string;
  score: number;
  topSkill: string;
  repos: number;
  stars: number;
  lastActive: string;
  key?: string | number;
}

export default function LeaderboardRow({
  rank,
  name,
  username,
  avatar_url,
  score,
  topSkill,
  repos,
  stars,
  lastActive
}: LeaderboardRowProps) {
  return (
    <Link
      to={`/card/${username}`}
      className="grid grid-cols-12 gap-4 p-6 items-center border-b border-border hover:bg-elevated transition-all duration-200 group"
    >
      <div className="col-span-1 font-display font-black text-xl text-lime italic">
        {rank.toString().padStart(2, '0')}
      </div>
      
      <div className="col-span-3 flex items-center gap-4">
        <div className="w-10 h-10 border border-border overflow-hidden rounded-[2px]">
          <img src={avatar_url} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h4 className="font-display font-bold text-sm text-text group-hover:text-lime transition-colors uppercase tracking-tight">{name || username}</h4>
          <p className="font-mono text-muted text-[10px] uppercase font-bold">@{username}</p>
        </div>
      </div>

      <div className="col-span-2 font-display font-black text-2xl text-lime">
        {score}
      </div>

      <div className="col-span-2">
        <span className="font-mono text-[10px] text-text bg-surface px-3 py-1 border border-border uppercase font-bold tracking-widest rounded-[2px]">
          {topSkill}
        </span>
      </div>

      <div className="col-span-1 flex items-center gap-2 text-muted font-mono text-[10px] font-bold">
        <GitBranch className="w-3 h-3" />
        {repos}
      </div>

      <div className="col-span-1 flex items-center gap-2 text-muted font-mono text-[10px] font-bold">
        <Star className="w-3 h-3" />
        {stars}
      </div>

      <div className="col-span-2 text-right font-mono text-muted text-[10px] uppercase font-bold tracking-widest">
        {lastActive}
      </div>
    </Link>
  );
}
