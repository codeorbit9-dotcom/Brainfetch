interface ActivityGridProps {
  events: any[];
}

export default function ActivityGrid({ events }: ActivityGridProps) {
  // Generate a mock grid for 12 weeks x 7 days
  // In a real app, we'd map events to dates
  const grid = Array.from({ length: 12 }, () => 
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
  );

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return (
    <div className="w-full">
      <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide">
        {grid.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day, j) => (
              <div
                key={j}
                className={`w-3 h-3 rounded-[1px] transition-colors border border-border/50 ${
                  day === 0 ? 'bg-white/5' :
                  day === 1 ? 'bg-lime/10' :
                  day === 2 ? 'bg-lime/30' :
                  day === 3 ? 'bg-lime/60' :
                  'bg-lime shadow-[0_0_8px_rgba(212,255,0,0.3)]'
                }`}
                title={`${day} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {months.map((month) => (
          <span key={month} className="font-mono text-[8px] text-muted uppercase font-bold">{month}</span>
        ))}
      </div>
    </div>
  );
}
