import { useState } from "react";
import { Search, Filter, ChevronDown, Star, GitBranch, Bookmark, Plus, Zap } from "lucide-react";
import RecruiterCard from "../components/RecruiterCard";

export default function Recruiter() {
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState("60+");

  const results = [
    { name: "Linus Torvalds", username: "torvalds", avatar_url: "https://github.com/torvalds.png", score: 99, topSkills: [{ name: "C", score: 99 }, { name: "C++", score: 92 }, { name: "Shell", score: 85 }], repos: 7, stars: 185000, streak: 12 },
    { name: "Sarah Drasner", username: "sdras", avatar_url: "https://github.com/sdras.png", score: 92, topSkills: [{ name: "Vue", score: 95 }, { name: "JavaScript", score: 90 }, { name: "CSS", score: 88 }], repos: 180, stars: 45000, streak: 8 },
    { name: "TJ Holowaychuk", username: "tj", avatar_url: "https://github.com/tj.png", score: 94, topSkills: [{ name: "Go", score: 96 }, { name: "JavaScript", score: 92 }, { name: "Node.js", score: 90 }], repos: 300, stars: 120000, streak: 15 },
    { name: "Kent C. Dodds", username: "kentcdodds", avatar_url: "https://github.com/kentcdodds.png", score: 87, topSkills: [{ name: "React", score: 98 }, { name: "JavaScript", score: 94 }, { name: "TypeScript", score: 88 }], repos: 350, stars: 42000, streak: 5 },
    { name: "Lee Robinson", username: "leerob", avatar_url: "https://github.com/leerob.png", score: 89, topSkills: [{ name: "React", score: 96 }, { name: "TypeScript", score: 92 }, { name: "Next.js", score: 95 }], repos: 95, stars: 22000, streak: 10 },
    { name: "Guillermo Rauch", username: "rauchg", avatar_url: "https://github.com/rauchg.png", score: 91, topSkills: [{ name: "TypeScript", score: 98 }, { name: "JavaScript", score: 95 }, { name: "Node.js", score: 92 }], repos: 120, stars: 38000, streak: 7 }
  ];

  return (
    <div className="bg-bg min-h-screen pb-24">
      <section className="pt-24 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div>
              <div className="font-mono text-[10px] text-lime tracking-[0.3em] uppercase mb-8">TALENT SEARCH · 2026</div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]">RECRUITER<br /><span className="text-white">DASHBOARD.</span></h1>
              <p className="text-muted text-xl font-sans font-light max-w-2xl">Search verified developers by real skills — no resume BS.</p>
            </div>
            <button className="btn-primary px-8 py-4 font-mono text-[10px] uppercase font-bold tracking-widest">
              Get Recruiter Access
            </button>
          </div>
          
          <div className="sticky top-16 z-30 bg-bg pt-8 pb-4 border-t border-border">
            <div className="relative mb-8 group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-muted group-focus-within:text-lime transition-colors" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, username, skill..."
                className="input-base w-full pl-16 py-6 text-xl"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-muted uppercase font-bold tracking-widest">Min Score:</span>
                <div className="flex gap-2">
                  {["60+", "70+", "80+", "90+"].map(s => (
                    <button
                      key={s}
                      onClick={() => setMinScore(s)}
                      className={`px-3 py-1 font-mono text-[9px] border transition-all uppercase font-bold ${
                        minScore === s ? "text-lime border-lime" : "text-muted border-border hover:border-border-hover"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-muted uppercase font-bold tracking-widest">Language:</span>
                <div className="flex gap-2">
                  {["JavaScript", "Python", "TypeScript", "Go", "Rust"].map(l => (
                    <button
                      key={l}
                      className="px-3 py-1 font-mono text-[9px] border border-border text-muted hover:border-border-hover transition-all uppercase font-bold"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Results Grid */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((dev) => (
                  <RecruiterCard key={dev.username} {...dev} />
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <button className="btn-secondary px-12 font-mono text-[10px] uppercase font-bold tracking-widest">
                  Load More Developers
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="sticky top-64 space-y-8">
                <div className="card-base p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-mono text-text text-xs uppercase font-bold tracking-widest">My Shortlists</h3>
                    <button className="text-lime hover:opacity-80 transition-opacity">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Frontend Leads", count: 12 },
                      { name: "Rust Engineers", count: 5 },
                      { name: "Open Source Stars", count: 24 }
                    ].map(list => (
                      <div key={list.name} className="flex justify-between items-center p-4 bg-surface border border-border hover:border-border-hover transition-colors cursor-pointer group rounded-[4px]">
                        <span className="text-xs text-muted group-hover:text-text transition-colors">{list.name}</span>
                        <span className="font-mono text-[10px] text-lime font-bold">{list.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-base p-8 bg-lime text-black border-none shadow-[0_0_30px_rgba(212,255,0,0.2)]">
                  <h3 className="font-display font-black text-xl mb-4 uppercase leading-tight tracking-tight">Access 12,400+ verified developers</h3>
                  <ul className="space-y-2 mb-8">
                    {["Full developer search", "Filter by activity", "Unlimited shortlists", "Export to CSV"].map(f => (
                      <li key={f} className="text-[9px] font-mono uppercase flex items-center gap-2 font-black">
                        <div className="w-1 h-1 bg-black" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-black text-lime font-display font-black py-3 text-[10px] uppercase tracking-widest">
                    Upgrade to Recruiter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
