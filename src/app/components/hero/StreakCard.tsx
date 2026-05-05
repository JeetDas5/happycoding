import React from "react";
import Icon from "@/components/ui/AppIcon";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const filled = [true, true, true, true, true, true, false];

export default function StreakCard() {
  return (
    <div className="glass-card w-64 rounded-2xl p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Daily Streak
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>
      {/* Streak count */}
      <div className="flex items-end gap-2 mb-4">
        <span className="text-4xl font-extrabold text-foreground font-mono leading-none">
          47
        </span>
        <span className="text-base text-muted-foreground font-semibold mb-1">
          days 🔥
        </span>
      </div>
      {/* Week heatmap */}
      <div className="flex gap-1.5 mb-3">
        {days?.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                filled?.[i]
                  ? "bg-accent text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {filled?.[i] && (
                <Icon
                  name="CheckIcon"
                  size={12}
                  variant="solid"
                  className="text-primary dark:text-white"
                />
              )}
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">
              {d}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 pt-2 border-t border-border">
        <Icon
          name="TrophyIcon"
          size={12}
          className="text-yellow-400"
          variant="solid"
        />
        <span className="text-[11px] text-muted-foreground font-body">
          Top 5% this week
        </span>
      </div>
    </div>
  );
}
