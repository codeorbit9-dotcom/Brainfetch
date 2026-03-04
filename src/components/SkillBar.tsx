import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  score: number;
  key?: string | number;
}

export default function SkillBar({ name, score }: SkillBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-[9px] uppercase font-black tracking-[0.2em] text-text">{name}</span>
        <span className="font-mono text-[9px] text-lime font-black tracking-widest">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-dim rounded-[2px] overflow-hidden border border-border p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-lime shadow-[0_0_15px_rgba(212,255,0,0.4)] rounded-[1px]"
        />
      </div>
    </div>
  );
}
