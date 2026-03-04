import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Github, Zap, Star, GitBranch, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";

export default function Compare() {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1 || !user2) return;

    setIsLoading(true);
    setError("");

    try {
      const [res1, res2] = await Promise.all([
        axios.get(`/api/card/${user1}`),
        axios.get(`/api/card/${user2}`)
      ]);
      setData1(res1.data);
      setData2(res2.data);
    } catch (err: any) {
      setError("One or both users not found. Make sure cards are generated first.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen pb-24">
      <section className="pt-24 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[10px] text-lime tracking-[0.3em] uppercase mb-8">BATTLE MODE · 2026</div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]">COMPARE<br /><span className="text-white">DEVELOPERS.</span></h1>
          <p className="text-muted text-xl font-sans font-light max-w-2xl mb-12">See how two developers stack up — verified data only.</p>
          
          <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-12 border-t border-border">
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Github className="w-5 h-5 text-muted" />
              </div>
              <input
                type="text"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                placeholder="Developer 1 username"
                className="input-base w-full pl-12 py-4"
              />
            </div>
            
            <div className="md:col-span-2 text-center">
              <span className="font-display font-black text-4xl text-lime italic">VS</span>
            </div>

            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Github className="w-5 h-5 text-muted" />
              </div>
              <input
                type="text"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                placeholder="Developer 2 username"
                className="input-base w-full pl-12 py-4"
              />
            </div>

            <div className="md:col-span-12">
              <button type="submit" className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Compare Developers →"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red/10 border border-red/20 text-red text-[10px] font-mono uppercase font-bold">
              ERROR: {error}
            </div>
          )}
        </div>
      </section>

      {data1 && data2 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Score Battle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-24">
              <CompareProfile dev={data1} isWinner={data1.brain_score > data2.brain_score} />
              <div className="text-center">
                <div className="font-display font-black text-6xl text-lime italic mb-4">VS</div>
                <div className="font-mono text-muted text-[10px] uppercase font-bold tracking-widest">Score Battle</div>
              </div>
              <CompareProfile dev={data2} isWinner={data2.brain_score > data1.brain_score} />
            </div>

            {/* Stats Table */}
            <div className="card-base overflow-hidden">
              <div className="grid grid-cols-3 p-6 bg-surface border-b border-border font-mono text-[10px] text-muted text-center uppercase font-bold tracking-widest">
                <div>{data1.username}</div>
                <div>METRIC</div>
                <div>{data2.username}</div>
              </div>
              
              <div className="divide-y divide-border">
                <CompareRow
                  label="BrainFetch Score"
                  val1={data1.brain_score}
                  val2={data2.brain_score}
                  better={data1.brain_score > data2.brain_score ? 1 : 2}
                />
                <CompareRow
                  label="Top Language"
                  val1={data1.skill_scores[0]?.name}
                  val2={data2.skill_scores[0]?.name}
                />
                <CompareRow
                  label="Total Repos"
                  val1={data1.stats.repos}
                  val2={data2.stats.repos}
                  better={data1.stats.repos > data2.stats.repos ? 1 : 2}
                />
                <CompareRow
                  label="Total Stars"
                  val1={data1.stats.stars}
                  val2={data2.stats.stars}
                  better={data1.stats.stars > data2.stats.stars ? 1 : 2}
                />
                <CompareRow
                  label="Followers"
                  val1={data1.stats.followers}
                  val2={data2.stats.followers}
                  better={data1.stats.followers > data2.stats.followers ? 1 : 2}
                />
                <CompareRow
                  label="Languages Count"
                  val1={data1.stats.languages}
                  val2={data2.stats.languages}
                  better={data1.stats.languages > data2.stats.languages ? 1 : 2}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CompareProfile({ dev, isWinner }: { dev: any, isWinner: boolean }) {
  return (
    <div className={`card-base p-8 text-center relative ${isWinner ? "border-lime/40 shadow-[0_0_40px_rgba(212,255,0,0.1)] bg-elevated" : ""}`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-black font-mono text-[8px] font-black px-4 py-1 uppercase tracking-widest rounded-[4px]">
          WINNER
        </div>
      )}
      <div className="w-24 h-24 mx-auto mb-6 border border-border p-1 rounded-[4px]">
        <img src={dev.avatar_url} alt={dev.username} className="w-full h-full object-cover grayscale rounded-[2px]" referrerPolicy="no-referrer" />
      </div>
      <h3 className="font-display font-bold text-lg mb-1 uppercase tracking-tight">{dev.name || dev.username}</h3>
      <p className="font-mono text-lime mb-8 text-[10px] uppercase font-bold">@{dev.username}</p>
      
      <div className="font-display font-black text-6xl text-lime leading-none mb-2">
        {dev.brain_score}
      </div>
      <div className="font-mono text-muted text-[10px] uppercase font-bold tracking-widest">Brain Score</div>
    </div>
  );
}

function CompareRow({ label, val1, val2, better }: { label: string, val1: any, val2: any, better?: 1 | 2 }) {
  return (
    <div className="grid grid-cols-3 p-6 items-center text-center">
      <div className={`font-display font-black text-2xl ${better === 1 ? "text-lime" : "text-text"}`}>
        {val1}
      </div>
      <div className="font-mono text-muted text-[10px] uppercase font-bold tracking-widest">{label}</div>
      <div className={`font-display font-black text-2xl ${better === 2 ? "text-lime" : "text-text"}`}>
        {val2}
      </div>
    </div>
  );
}
