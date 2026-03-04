import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Zap } from "lucide-react";

const Landing = lazy(() => import("./pages/Landing"));
const Generate = lazy(() => import("./pages/Generate"));
const CardPage = lazy(() => import("./pages/CardPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Compare = lazy(() => import("./pages/Compare"));
const Recruiter = lazy(() => import("./pages/Recruiter"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <Zap className="w-12 h-12 text-lime fill-lime animate-pulse" />
    <div className="font-mono text-[10px] text-lime tracking-[0.3em] uppercase">LOADING BRAIN...</div>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-lime selection:text-black">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/card/:username" element={<CardPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/recruiter" element={<Recruiter />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
