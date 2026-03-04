import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-8 group">
              <Zap className="w-8 h-8 text-lime fill-lime" />
              <span className="font-display font-bold text-2xl tracking-tighter uppercase">
                Brain<span className="text-lime">Fetch</span>
              </span>
            </Link>
            <p className="text-muted text-lg max-w-sm leading-relaxed font-light">
              Stop claiming. Start fetching. AI-verified developer proof cards generated from real GitHub data.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-text text-[10px] uppercase font-bold tracking-widest mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/generate" className="font-mono text-[10px] text-muted hover:text-lime transition-colors uppercase font-bold tracking-widest">Generate</Link></li>
              <li><Link to="/leaderboard" className="font-mono text-[10px] text-muted hover:text-lime transition-colors uppercase font-bold tracking-widest">Leaderboard</Link></li>
              <li><Link to="/compare" className="font-mono text-[10px] text-muted hover:text-lime transition-colors uppercase font-bold tracking-widest">Compare</Link></li>
              <li><Link to="/pricing" className="font-mono text-[10px] text-muted hover:text-lime transition-colors uppercase font-bold tracking-widest">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-text text-[10px] uppercase font-bold tracking-widest mb-8">Contact</h4>
            <p className="font-mono text-lime text-xs mb-4 font-bold">BRAINFETCH.IO</p>
            <p className="font-mono text-[10px] text-muted uppercase font-bold tracking-widest leading-relaxed">Built for real developers by real developers.</p>
          </div>
        </div>
        
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-mono text-[9px] text-muted uppercase font-bold tracking-[0.2em]">
            © 2026 BRAINFETCH · VERIFIED BY REAL DATA · BUILT FOR REAL DEVELOPERS
          </p>
          <div className="flex gap-8">
            <a href="#" className="font-mono text-[9px] text-muted hover:text-text uppercase font-bold tracking-widest transition-colors">Twitter</a>
            <a href="#" className="font-mono text-[9px] text-muted hover:text-text uppercase font-bold tracking-widest transition-colors">Github</a>
            <a href="#" className="font-mono text-[9px] text-muted hover:text-text uppercase font-bold tracking-widest transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
