import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Crown, Star, Plus, Minus } from "lucide-react";
import PricingCard from "../components/PricingCard";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="bg-bg min-h-screen pb-24">
      <section className="pt-24 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-display font-black mb-6 uppercase tracking-tighter">SIMPLE PRICING</h1>
          <p className="label-mono text-muted text-sm mb-12">No hidden fees. No fake features. Pay for what you use.</p>
          
          <div className="flex items-center justify-center gap-6 pt-12 border-t border-border">
            <span className={`label-mono text-xs transition-colors ${!isAnnual ? "text-text" : "text-muted"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-surface border border-border p-1 relative transition-colors hover:border-border-hover"
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 0 }}
                className="w-5 h-5 bg-lime"
              />
            </button>
            <div className="flex items-center gap-3">
              <span className={`label-mono text-xs transition-colors ${isAnnual ? "text-text" : "text-muted"}`}>Annual</span>
              <span className="bg-lime/10 text-lime label-mono text-[8px] px-2 py-1 border border-lime/20">SAVE 20%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              type="FREE"
              price="$0"
              period="/ forever"
              cta="Start Free →"
              features={[
                { text: "1 BrainFetch card", included: true },
                { text: "GitHub integration", included: true },
                { text: "AI brain score", included: true },
                { text: "Shareable link", included: true },
                { text: "BrainFetch watermark", included: false },
                { text: "Analytics", included: false },
                { text: "Monthly refresh", included: false },
                { text: "Custom card design", included: false }
              ]}
            />
            <PricingCard
              type="PRO"
              price={isAnnual ? "$8" : "$10"}
              period="/ month"
              cta="Get Pro →"
              isPopular
              features={[
                { text: "Everything in Free", included: true },
                { text: "Remove watermark", included: true },
                { text: "Monthly auto-refresh", included: true },
                { text: "Card view analytics", included: true },
                { text: "Custom card accent color", included: true },
                { text: "LinkedIn/Figma integration", included: true },
                { text: "Priority AI generation", included: true },
                { text: "Download card as PNG", included: true }
              ]}
            />
            <PricingCard
              type="RECRUITER"
              price="$49"
              period="/ month"
              cta="Start Recruiting →"
              features={[
                { text: "Full developer search", included: true },
                { text: "Filter by score/skill/activity", included: true },
                { text: "Unlimited saved shortlists", included: true },
                { text: "Export to CSV", included: true },
                { text: "Team seats (3 included)", included: true },
                { text: "API access", included: true },
                { text: "Priority support", included: true },
                { text: "Advanced analytics", included: true }
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display font-black text-4xl mb-24 uppercase tracking-tight">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How is the score calculated?", a: "Our algorithm analyzes repository count, star count, commit consistency over the last 90 days, language diversity, and account maturity. It's a weighted score designed to reflect real-world impact and consistency." },
              { q: "Can scores be faked?", a: "No. We pull data directly from the GitHub Public API. While someone could theoretically inflate their stars, our AI analysis and consistency checks identify patterns that separate real work from fake activity." },
              { q: "What data do you access?", a: "We only access public GitHub data. We do not require access to your private repositories or your GitHub password." },
              { q: "How often does my card refresh?", a: "Free cards are static. Pro cards auto-refresh every 30 days to reflect your latest activity. You can also manually trigger a refresh once per week with Pro." },
              { q: "Can I delete my card?", a: "Yes. You can request to have your card removed from our database at any time through your dashboard." },
              { q: "Do you store my GitHub data?", a: "We store a snapshot of the data used to generate your card (repos, stars, events) to ensure your card remains accessible. We do not store your full code or any private information." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-base overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center text-left hover:bg-elevated transition-colors"
      >
        <span className="font-display font-bold text-sm uppercase">{question}</span>
        {isOpen ? <Minus className="w-4 h-4 text-lime" /> : <Plus className="w-4 h-4 text-lime" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-muted text-sm font-sans font-light leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
