import React from "react";

// Pre-computed grid data — no runtime Math functions in render
const activityData: number[] = [
  0, 1, 2, 3, 1, 0, 2, 3, 2, 1, 3, 2, 1, 0, 1, 2, 3, 2, 3, 1, 2, 0, 1, 3, 2, 1,
  3, 2, 3, 2, 1, 0, 2, 3, 1,
];

function getColor(level: number): string {
  switch (level) {
    case 0:
      return "bg-primary/20 dark:bg-muted border border-border";
    case 1:
      return "bg-primary/30 dark:bg-accent/20";
    case 2:
      return "bg-primary/50 dark:bg-accent/50";
    case 3:
      return "bg-primary dark:bg-accent shadow-[0_0_6px_rgba(59,130,246,0.5)]";
    default:
      return "bg-primary dark:bg-muted";
  }
}

export default function ActivityCard() {
  return (
    <div className="glass-card w-66 rounded-2xl p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Problems Solved
        </span>
        <span className="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded-full">
          This Month
        </span>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-4xl font-extrabold text-foreground font-mono leading-none">
          143
        </span>
        <span className="text-sm text-muted-foreground font-body mb-1">
          problems AC
        </span>
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {activityData.map((level, i) => (
          <div
            key={i}
            className={`aspect-square rounded-sm transition-all hover:scale-110 ${getColor(
              level
            )}`}
            title={`${level} problems`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <span className="text-[10px] text-muted-foreground font-mono">
          Less
        </span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((l) => (
            <div key={l} className={`w-3 h-3 rounded-sm ${getColor(l)}`} />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          More
        </span>
      </div>
    </div>
  );
}
