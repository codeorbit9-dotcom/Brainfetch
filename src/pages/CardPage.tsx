import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, Zap, Download, Lock, X } from "lucide-react";
import axios from "axios";
import BrainCard from "../components/BrainCard";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import html2canvas from "html2canvas";

export default function CardPage() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`/api/card/${username}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch card");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchCard();
  }, [username]);

  const handleDownload = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#050505",
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement("a");
      link.download = `brainfetch-${username}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-16 h-16 text-lime fill-lime" />
        </motion.div>
        <p className="label-mono text-muted">Fetching card data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4 text-center">
        <div className="w-20 h-20 bg-red/10 border border-red/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-black mb-4 uppercase tracking-tight">Card Not Found</h2>
          <p className="text-muted max-w-sm mx-auto font-sans font-light">{error}</p>
        </div>
        <Link
          to="/generate"
          className="btn-secondary flex items-center gap-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Generate
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen pb-24">
      {/* Top Bar */}
      <div className="bg-bg border-b border-border py-4 sticky top-16 z-40 backdrop-blur-md bg-bg/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/generate" className="label-mono text-muted hover:text-lime transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" />
            Generate Another
          </Link>
          <div className="flex items-center gap-4">
            <span className="label-mono text-muted text-[9px] hidden sm:block">
              Verified by BrainFetch AI · {new Date(data?.created_at).toLocaleDateString()}
            </span>
            {!data?.is_pro && (
              <Link to="/pricing" className="btn-secondary py-1.5 px-4 text-[10px] label-mono">
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div ref={cardRef}>
          {data && <BrainCard data={data} />}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary px-8 py-4 flex items-center gap-3 text-sm"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {user ? "Download Card (PNG)" : "Login to Download"}
          </button>
          
          {!user && (
            <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
              Authentication required for high-res download
            </p>
          )}
        </div>

        <div className="mt-32 text-center max-w-2xl mx-auto">
          <h3 className="text-4xl font-display font-black mb-8 uppercase tracking-tighter">Want a verified card like this?</h3>
          <p className="text-muted font-sans font-light mb-12 leading-relaxed">
            Stop claiming your skills on a resume. Start fetching real proof from your GitHub data. It takes 60 seconds and it's free.
          </p>
          <Link
            to="/generate"
            className="btn-primary inline-block px-12 py-6 text-lg"
          >
            Fetch My Score Now →
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface border border-border p-8 max-w-sm w-full text-center"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-muted hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 bg-lime/10 border border-lime/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-lime" />
              </div>
              
              <h3 className="text-2xl font-display font-black mb-2 uppercase tracking-tight">Login Required</h3>
              <p className="text-muted text-sm mb-8 font-sans font-light">
                Please login with your Google account to download your verified BrainFetch card.
              </p>
              
              <button
                onClick={async () => {
                  setShowAuthModal(false);
                  const provider = new GoogleAuthProvider();
                  try {
                    await signInWithPopup(auth, provider);
                  } catch (error) {
                    console.error("Login failed:", error);
                  }
                }}
                className="btn-primary w-full py-4 flex items-center justify-center gap-3"
              >
                Continue to Login
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
