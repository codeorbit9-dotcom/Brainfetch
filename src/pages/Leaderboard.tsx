import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Star, GitBranch } from "lucide-react";
import LeaderboardRow from "../components/LeaderboardRow";

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("All Time");
  const [language, setLanguage] = useState("All");

  const top3 = [
    { rank: 1, name: "Linus Torvalds", username: "torvalds", avatar_url: "https://github.com/torvalds.png", score: 99, topSkill: "C", repos: 7, stars: 185000 },
    { rank: 2, name: "Dan Abramov", username: "gaearon", avatar_url: "https://github.com/gaearon.png", score: 96, topSkill: "JavaScript", repos: 250, stars: 95000 },
    { rank: 3, name: "TJ Holowaychuk", username: "tj", avatar_url: "https://github.com/tj.png", score: 94, topSkill: "Go", repos: 300, stars: 120000 }
  ];

  const others = [
    { rank: 4, name: "Sarah Drasner", username: "sdras", avatar_url: "https://github.com/sdras.png", score: 92, topSkill: "Vue", repos: 180, stars: 45000, lastActive: "2H AGO" },
    { rank: 5, name: "Guillermo Rauch", username: "rauchg", avatar_url: "https://github.com/rauchg.png", score: 91, topSkill: "TypeScript", repos: 120, stars: 38000, lastActive: "5H AGO" },
    { rank: 6, name: "Lee Robinson", username: "leerob", avatar_url: "https://github.com/leerob.png", score: 89, topSkill: "React", repos: 95, stars: 22000, lastActive: "1D AGO" },
    { rank: 7, name: "Cassidy Williams", username: "cassidoo", avatar_url: "https://github.com/cassidoo.png", score: 88, topSkill: "JavaScript", repos: 210, stars: 15000, lastActive: "3H AGO" },
    { rank: 8, name: "Kent C. Dodds", username: "kentcdodds", avatar_url: "https://github.com/kentcdodds.png", score: 87, topSkill: "React", repos: 350, stars: 42000, lastActive: "12H AGO" }
  ];

  return (
    <div className="bg-bg min-h-screen pb-24">
      <section className="pt-24 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-display font-black mb-6 uppercase tracking-tighter">GLOBAL LEADERBOARD</h1>
          <p className="text-muted text-xl font-sans font-light max-w-2xl mb-12">Top verified developers ranked by real BrainFetch scores.</p>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border">
            <div className="flex gap-2">
              {["All Time", "This Month", "This Week"].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-2 label-mono text-[10px] border transition-all ${
                    timeframe === t ? "bg-lime text-black border-lime" : "bg-surface text-muted border-border hover:border-border-hover"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="label-mono text-[10px] text-muted">Filter by language:</span>
              <div className="flex gap-2 overflow-x-auto max-w-md pb-2 md:pb-0">
                {["All", "JavaScript", "Python", "Rust", "Go", "TypeScript"].map(l => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-3 py-1 label-mono text-[9px] border whitespace-nowrap transition-all ${
                      language === l ? "text-lime border-lime" : "text-muted border-border hover:border-border-hover"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podium */}
      <section className="py-24 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Rank 2 */}
            <div className="order-2 md:order-1">
              <PodiumCard dev={top3[1]} rank={2} />
            </div>
            {/* Rank 1 */}
            <div className="order-1 md:order-2">
              <PodiumCard dev={top3[0]} rank={1} isLarge />
            </div>
            {/* Rank 3 */}
            <div className="order-3 md:order-3">
              <PodiumCard dev={top3[2]} rank={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-base overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-6 bg-surface border-b border-border label-mono text-[10px] text-muted">
              <div className="col-span-1">RANK</div>
              <div className="col-span-3">DEVELOPER</div>
              <div className="col-span-2">BRAINFETCH SCORE</div>
              <div className="col-span-2">TOP SKILL</div>
              <div className="col-span-1">REPOS</div>
              <div className="col-span-1">STARS</div>
              <div className="col-span-2 text-right">LAST ACTIVE</div>
            </div>
            
            <div className="divide-y divide-border">
              {others.map((dev) => (
                <LeaderboardRow 
                  key={dev.username}
                  rank={dev.rank}
                  name={dev.name}
                  username={dev.username}
                  avatar_url={dev.avatar_url}
                  score={dev.score}
                  topSkill={dev.topSkill}
                  repos={dev.repos}
                  stars={dev.stars}
                  lastActive={dev.lastActive}
                />
              ))}
            </div>
            
            <div className="p-8 text-center bg-surface/50">
              <button className="btn-secondary px-12 label-mono text-xs">
                Load More Developers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PodiumCard({ dev, rank, isLarge }: { dev: any, rank: number, isLarge?: boolean }) {
  const medals = ["", "text-[#FFD700]", "text-[#C0C0C0]", "text-[#CD7F32]"];
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`card-base p-8 text-center relative ${
        isLarge ? "border-lime/40 shadow-[0_0_40px_rgba(212,255,0,0.1)] py-16" : "py-12"
      }`}
    >
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 font-display font-black text-6xl ${medals[rank]}`}>
        {rank}
      </div>
      
      <div className="w-24 h-24 mx-auto mb-6 border-2 border-border p-1">
        <img src={dev.avatar_url} alt={dev.name} className="w-full h-full object-cover grayscale" />
      </div>
      
      <h3 className="font-display font-bold text-lg mb-1 uppercase">{dev.name}</h3>
      <p className="label-mono text-lime mb-6">@{dev.username}</p>
      
      <div className="mb-6">
        <div className={`font-display font-black text-lime leading-none ${isLarge ? "text-7xl" : "text-5xl"}`}>
          {dev.score}
        </div>
        <div className="label-mono text-muted text-[10px] mt-2">Brain Score</div>
      </div>
      
      <div className="flex justify-center gap-4 mb-8">
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
          <GitBranch className="w-3 h-3" />
          {dev.repos}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
          <Star className="w-3 h-3" />
          {dev.stars}
        </div>
      </div>
      
      <span className="label-mono text-[9px] text-text bg-surface px-3 py-1 border border-border">
        {dev.topSkill}
      </span>
    </motion.div>
  );
}
