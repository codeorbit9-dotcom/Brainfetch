import { Link } from "react-router-dom";
import { Zap, LogIn, LogOut, User } from "lucide-react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/leaderboard" className="font-mono text-[10px] text-muted hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">Leaderboard</Link>
            <Link to="/compare" className="font-mono text-[10px] text-muted hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">Compare</Link>
            <Link to="/pricing" className="font-mono text-[10px] text-muted hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">Pricing</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full">
                  <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-5 h-5 rounded-full" />
                  <span className="label-mono text-[9px] text-text">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="text-muted hover:text-red transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 font-mono text-[10px] text-lime hover:text-text transition-colors uppercase font-bold tracking-[0.2em]">
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}

            <Link to="/generate" className="btn-primary py-3 px-6 text-[10px] uppercase tracking-widest font-black">
              Fetch My Score
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {user ? (
              <button onClick={handleLogout} className="text-muted">
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleLogin} className="text-lime">
                <LogIn className="w-4 h-4" />
              </button>
            )}
            <Link to="/generate" className="btn-primary py-2 px-4 text-[10px] uppercase font-black">
              Fetch
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
