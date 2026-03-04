import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ScoreCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export default function ScoreCounter({ value, duration = 1, className = "" }: ScoreCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;

      const totalMiliseconds = duration * 1000;
      const incrementTime = totalMiliseconds / end;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  );
}
