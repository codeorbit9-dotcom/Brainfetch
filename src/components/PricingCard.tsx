import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface PricingCardProps {
  type: "FREE" | "PRO" | "RECRUITER";
  price: string;
  period?: string;
  features: { text: string; included: boolean }[];
  cta: string;
  isPopular?: boolean;
}

export default function PricingCard({ type, price, period, features, cta, isPopular }: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card-base p-10 flex flex-col relative rounded-[4px] ${
        isPopular ? "border-lime/40 shadow-[0_0_40px_rgba(212,255,0,0.1)] bg-elevated" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 right-6 bg-lime text-black font-mono text-[8px] px-3 py-1 font-black uppercase tracking-widest rounded-[4px]">
          MOST POPULAR
        </div>
      )}
      
      <h3 className={`font-display font-black text-3xl mb-2 uppercase tracking-tight ${isPopular ? "text-lime" : "text-text"}`}>
        {type}
      </h3>
      <div className="flex items-baseline gap-1 mb-10">
        <span className="text-4xl font-display font-black text-lime tracking-tighter">{price}</span>
        {period && <span className="text-muted text-[10px] font-mono uppercase font-bold tracking-widest">{period}</span>}
      </div>

      <ul className="space-y-4 mb-12 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-4 h-4 text-lime shrink-0 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-muted shrink-0 mt-0.5" />
            )}
            <span className={`text-[11px] font-mono uppercase font-bold tracking-wide ${feature.included ? "text-text/80" : "text-muted"}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button className={isPopular ? "btn-primary w-full py-4 text-[10px] uppercase tracking-widest font-black" : "btn-secondary w-full py-4 text-[10px] uppercase tracking-widest font-black"}>
        {cta}
      </button>
    </motion.div>
  );
}
