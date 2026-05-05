const chartPoints =
  "0,90 60,75 120,80 180,55 240,60 300,35 360,40 420,20 480,25";
const fillPath = `M0,90 ${chartPoints?.split(" ")?.slice(1)?.join(" ")} L480,120 L0,120 Z`;

export default function RatingCard() {
  return (
    <div className="glass-card w-66 rounded-2xl p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Rating Progress
        </span>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
          +234
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-extrabold text-foreground font-mono">
          1,847
        </span>
        <span className="text-sm text-muted-foreground font-body">Expert</span>
      </div>

      <div className="relative overflow-hidden rounded-lg h-20">
        <svg
          viewBox="0 0 480 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d={fillPath}
            fill="url(#ratingGradient)"
            className="animate-fade-fill"
          />
          <polyline
            points={chartPoints}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
          />
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="480" cy="25" r="4" fill="currentColor" className="text-foreground" />
          <circle
            cx="480"
            cy="25"
            r="8"
            fill="#3B82F6"
            fillOpacity="0.3"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
      </div>
    </div>
  );
}
