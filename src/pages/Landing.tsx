import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Globe, ArrowRight, Github, CheckCircle2 } from "lucide-react";
import ScoreCounter from "../components/ScoreCounter";
import TestimonialCard from "../components/TestimonialCard";
import BrainCard from "../components/BrainCard";

export default function Landing() {
  const mockCardData = {
    username: "dev_pro",
    name: "Alex Rivera",
    avatar_url: "https://picsum.photos/seed/alex/200",
    bio: "Senior Full Stack Engineer specializing in distributed systems and high-performance React applications.",
    brain_score: 87,
    skill_scores: [
      { name: "TypeScript", score: 94 },
      { name: "React", score: 91 },
      { name: "Node.js", score: 85 },
      { name: "Rust", score: 78 },
      { name: "PostgreSQL", score: 82 }
    ],
    ai_summary: "Alex is an exceptionally consistent developer with a high-impact contribution history. Their work on high-performance systems is evident in their top repositories, showing a deep understanding of architecture and scalability.\n\nThey excel in TypeScript environments and have a proven track record of maintaining complex codebases. Their commit consistency over the last 90 days is in the top 5% of all analyzed developers.",
    top_projects: [
      { name: "FastStream", description: "High-performance streaming library for Node.js", stars: 1200, language: "TypeScript", quality_score: 96 },
      { name: "React-Grid-Master", description: "The most flexible grid system for React", stars: 850, language: "React", quality_score: 92 },
      { name: "Rust-DB", description: "Experimental database engine written in Rust", stars: 450, language: "Rust", quality_score: 88 }
    ],
    stats: { repos: 42, stars: 2500, followers: 150, languages: 8 },
    created_at: new Date().toISOString()
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <p className="label-mono text-lime mb-6 tracking-[0.3em]">AI-VERIFIED DEVELOPER PROOF · 2026</p>
              <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] mb-8 uppercase tracking-tighter">
                STOP CLAIMING.<br />
                <span className="text-lime">START FETCHING.</span>
              </h1>
              <p className="text-muted text-xl font-sans font-light max-w-xl mb-12 leading-relaxed">
                Connect GitHub. BrainFetch AI analyzes your real work and generates a verified proof card recruiters can't ignore. 60 seconds. No BS.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/generate" className="btn-primary text-center flex items-center justify-center gap-2 px-8">
                  Fetch My Score <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/card/torvalds" className="btn-secondary text-center">
                  See Example Card
                </Link>
              </div>

              <div className="flex flex-wrap gap-8">
                {["✓ No signup needed", "✓ GitHub public API only", "✓ Cannot be faked"].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-[10px] font-mono text-text/60 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-lime" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="scale-75 origin-top-right">
                  <BrainCard data={mockCardData} />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-lime/5 blur-[120px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Cards Generated", value: 12400, suffix: "+" },
              { label: "Recruiter Approval", value: 94, suffix: "%" },
              { label: "Developers Verified", value: 0.1, suffix: "%", isFloat: true },
              { label: "Seconds to Generate", value: 60, suffix: "" }
            ].map((stat, i) => (
              <div key={i} className="text-center lg:border-r last:border-0 border-border">
                <div className="text-4xl font-display font-black text-lime mb-2">
                  <ScoreCounter value={stat.isFloat ? stat.value * 10 : stat.value} />
                  {stat.isFloat ? (stat.value).toFixed(1) : ''}
                  {stat.suffix}
                </div>
                <div className="label-mono text-muted text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display font-black text-4xl mb-24 uppercase tracking-tight">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -z-10" />
            {[
              { step: "01", title: "Enter GitHub Username", desc: "Just point us to your public profile. No passwords required.", icon: Github },
              { step: "02", title: "AI Fetches Real Data", desc: "Gemini 2.5 Pro analyzes your repos, commits, and code quality.", icon: Zap },
              { step: "03", title: "Share Your Proof Card", desc: "Get a verified link to put in your resume or LinkedIn bio.", icon: Globe }
            ].map((item, i) => (
              <div key={i} className="card-base p-8 text-center bg-bg">
                <div className="text-lime font-display font-black text-5xl mb-6">{item.step}</div>
                <h3 className="font-display font-bold text-lg mb-4 uppercase">{item.title}</h3>
                <p className="text-muted text-sm font-sans font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 border-b border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {[
              { title: "AI Brain Score", desc: "A 0-100 verified score based on real contribution data.", icon: Zap },
              { title: "Skill Bars", desc: "Real language proficiency calculated from your commit history.", icon: ShieldCheck },
              { title: "Activity Heatmap", desc: "A 12-month visual representation of your coding consistency.", icon: Globe },
              { title: "AI Summary", desc: "Gemini writes a professional recruiter pitch based on your work.", icon: Zap },
              { title: "Verified Badge", desc: "A timestamped, tamper-proof badge that proves your identity.", icon: ShieldCheck },
              { title: "Shareable Card", desc: "One link that works everywhere—LinkedIn, resumes, emails.", icon: Globe }
            ].map((feature, i) => (
              <div key={i} className="card-base p-12 border-none rounded-none bg-surface hover:bg-elevated transition-colors">
                <feature.icon className="w-8 h-8 text-lime mb-8" />
                <h3 className="font-display font-bold text-xl mb-4 uppercase">{feature.title}</h3>
                <p className="text-muted text-sm font-sans font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-24">
            <div>
              <p className="label-mono text-lime mb-4">WHAT DEVS ARE SAYING</p>
              <h2 className="font-display font-black text-4xl uppercase tracking-tight">Verified by the community</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Got 4 interview requests in 48 hours after sharing my BrainFetch card. Recruiters actually read it."
              name="Arjun S."
              role="Full Stack Dev"
              handle="@arjun_codes"
            />
            <TestimonialCard
              quote="Finally something that proves I can code without writing a 2-page resume nobody reads."
              name="Priya M."
              role="Frontend Engineer"
              handle="@priya_dev"
            />
            <TestimonialCard
              quote="My BrainFetch score opened conversations that my LinkedIn profile never did in 3 years."
              name="Marcus T."
              role="Backend Dev"
              handle="@marcus_t"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-lime text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-black mb-12 uppercase tracking-tighter">
            READY TO FETCH<br />YOUR PROOF?
          </h2>
          <Link to="/generate" className="inline-block bg-black text-lime font-display font-black text-xl px-12 py-6 hover:scale-105 transition-transform">
            GENERATE MY CARD FREE →
          </Link>
        </div>
      </section>
    </div>
  );
}
