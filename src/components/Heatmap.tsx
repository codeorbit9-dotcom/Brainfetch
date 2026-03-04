interface HeatmapProps {
  events: any[];
}

export default function Heatmap({ events }: HeatmapProps) {
  // Generate a mock grid for 12 weeks x 7 days
  // In a real app, we'd map events to dates
  const grid = Array.from({ length: 12 }, () => 
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
  );

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {grid.map((week, i) => (
        <div key={i} className="flex flex-col gap-1">
          {week.map((day, j) => (
            <div
              key={j}
              className={`w-3 h-3 rounded-sm transition-colors ${
                day === 0 ? 'bg-white/5' :
                day === 1 ? 'bg-electric-purple/20' :
                day === 2 ? 'bg-electric-purple/40' :
                day === 3 ? 'bg-electric-purple/60' :
                'bg-electric-purple'
              }`}
              title={`${day} contributions`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
