interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  handle: string;
}

export default function TestimonialCard({ quote, name, role, handle }: TestimonialCardProps) {
  return (
    <div className="card-base p-8 flex flex-col h-full rounded-[4px]">
      <div className="font-mono text-lime text-[24px] leading-none mb-4">“</div>
      <p className="italic text-text/80 font-sans font-light text-xl mb-8 leading-relaxed tracking-tight">
        {quote}
      </p>
      <div className="mt-auto pt-8 border-t border-border">
        <h4 className="font-display font-black text-sm mb-1 uppercase tracking-tight">{name}</h4>
        <p className="font-mono text-muted text-[10px] uppercase font-bold tracking-widest mb-2">{role}</p>
        <p className="font-mono text-lime text-[10px] uppercase font-bold">{handle}</p>
      </div>
    </div>
  );
}
