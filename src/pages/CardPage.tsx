import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, Zap } from "lucide-react";
import axios from "axios";
import BrainCard from "../components/BrainCard";

export default function CardPage() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        {data && <BrainCard data={data} />}

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
    </div>
  );
}
