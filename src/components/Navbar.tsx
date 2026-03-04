import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center gap-2 group">
            <Zap className="w-8 h-8 text-lime fill-lime" />
            <span className="font-display font-bold text-2xl tracking-tighter uppercase">
              Brain<span className="text-lime">Fetch</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link to="/leaderboard" className="font-mono text-[10px] text-muted hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">Leaderboard</Link>
            <Link to="/compare" className="font-mono text-[10px] text-muted hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">Compare</Link>
            <Link to="/pricing" className="font-mono text-[10px] text-muted hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">Pricing</Link>
            <Link to="/generate" className="btn-primary py-3 px-6 text-[10px] uppercase tracking-widest font-black">
              Fetch My Score
            </Link>
          </div>

          <div className="md:hidden">
            <Link to="/generate" className="btn-primary py-2 px-4 text-[10px] uppercase font-black">
              Fetch
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
