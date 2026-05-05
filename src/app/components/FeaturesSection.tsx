import Icon from "@/components/ui/AppIcon";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative"
      aria-label="Features"
    >
      {/* Background watermark */}
      <div
        className="absolute -top-28 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center w-full"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent, black 10%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 10%, black 70%, transparent)",
        }}
      >
        <span
          className="font-extrabold text-white/3 tracking-tighter whitespace-nowrap"
          style={{ fontSize: "clamp(4rem, 14vw, 14rem)" }}
        >
          Features
        </span>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16 animate-on-scroll opacity-100 scroll-anim-1 relative z-10">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent mb-4">
            <span className="w-1 h-1 rounded-full bg-accent" />
            Platform Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
            Everything you need to compete
          </h2>
        </div>
        <div className="max-w-md lg:text-right">
          <p className="text-base md:text-lg text-muted-foreground font-body font-light leading-relaxed">
            HappyCoding layers a competitive meta-game on top of Codeforces —
            streaks, points, and rankings that keep you solving daily.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        <div className="spotlight-card md:row-span-2 rounded-2xl p-6 border border-white/6 bg-card animate-on-scroll opacity-100 scroll-anim-2 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Icon
                name="FireIcon"
                size={20}
                variant="solid"
                className="text-accent"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                01
              </span>
              <h3 className="text-lg font-bold text-white">
                Daily Streak Tracking
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
            Solve at least one Codeforces problem per day to keep your streak
            alive. Miss a day and you start over — the pressure is real.
          </p>

          <div className="flex-1 bg-background/60 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground">
                Current Streak
              </span>
              <span className="text-2xl font-extrabold text-white font-mono">
                47 🔥
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 })?.map((_, i) => {
                const intensity =
                  i < 26 ? (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1) : 0;
                const colors = [
                  "bg-white/5",
                  "bg-accent/25",
                  "bg-accent/55",
                  "bg-accent",
                ];
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md ${colors?.[intensity]}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-body">
                Best streak
              </span>
              <span className="text-sm font-bold text-white font-mono">
                63 days
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Icon
              name="CheckCircleIcon"
              size={14}
              variant="solid"
              className="text-emerald-400"
            />
            <span className="text-xs text-white/60 font-body">
              Auto-synced from Codeforces submissions
            </span>
          </div>
        </div>

        <div className="spotlight-card rounded-2xl p-6 border border-white/6 bg-card animate-on-scroll opacity-100 scroll-anim-3 flex flex-col justify-between min-h-65">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                <Icon
                  name="TrophyIcon"
                  size={20}
                  variant="solid"
                  className="text-yellow-400"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  02
                </span>
                <h3 className="text-lg font-bold text-white">
                  Global Leaderboard
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>

          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
            Compete globally or within your university org. Rankings reset
            realtime — everyone gets a fresh shot at the top.
          </p>

          <div className="space-y-2">
            {[
              {
                rank: "#1",
                name: "tourist",
                pts: "4,210 pts",
                color: "text-yellow-400",
              },
              {
                rank: "#2",
                name: "neal_wu",
                pts: "3,980 pts",
                color: "text-slate-300",
              },
              {
                rank: "#47",
                name: "you",
                pts: "1,240 pts",
                color: "text-accent",
                self: true,
              },
            ]?.map((r) => (
              <div
                key={r?.name}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  r?.self
                    ? "bg-accent/10 border border-accent/20"
                    : "bg-white/3"
                }`}
              >
                <span className={`font-mono font-bold w-8 ${r?.color}`}>
                  {r?.rank}
                </span>
                <span
                  className={`flex-1 font-semibold ${r?.self ? "text-accent" : "text-white/80"}`}
                >
                  {r?.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {r?.pts}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="spotlight-card rounded-2xl p-6 border border-white/6 bg-card animate-on-scroll opacity-100 scroll-anim-4 flex flex-col justify-between min-h-65">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
              <Icon
                name="StarIcon"
                size={20}
                variant="solid"
                className="text-emerald-400"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                03
              </span>
              <h3 className="text-lg font-bold text-white">
                Point Scoring System
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
            Harder problems = more points. Solve a Div. 1 D problem and watch
            your score rocket past friends.
          </p>

          <div className="space-y-2">
            {[
              {
                label: "Div. 2 A/B",
                pts: "+10 pts",
                color: "bg-emerald-400/30",
                w: "w-[30%]",
              },
              {
                label: "Div. 2 C/D",
                pts: "+30 pts",
                color: "bg-accent/40",
                w: "w-[55%]",
              },
              {
                label: "Div. 1 D/E",
                pts: "+100 pts",
                color: "bg-primary",
                w: "w-full",
              },
            ]?.map((p) => (
              <div key={p?.label} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-24 shrink-0">
                  {p?.label}
                </span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p?.color} ${p?.w}`} />
                </div>
                <span className="text-xs font-mono text-white font-bold w-16 text-right">
                  {p?.pts}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="spotlight-card md:col-span-2 rounded-2xl p-6 border border-white/6 bg-card animate-on-scroll opacity-100 scroll-anim-5 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center border border-purple-400/20">
                <Icon
                  name="UserGroupIcon"
                  size={20}
                  variant="solid"
                  className="text-purple-400"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  04
                </span>
                <h3 className="text-lg font-bold text-white">
                  Organization & Team Management
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 max-w-md">
              Create a coding club, invite members, and compete. Track your
              team&apos;s collective progress against other universities.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "University clubs",
                "Private leaderboards",
                "Member analytics",
              ]?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-background/60 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-white">
                ICPC Team Alpha
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                4 members
              </span>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Arjun Mehta",
                  role: "Captain",
                  streak: 31,
                  pts: "2,840",
                },
                {
                  name: "Sofia Chen",
                  role: "Member",
                  streak: 22,
                  pts: "2,210",
                },
                {
                  name: "Kevin O'Brien",
                  role: "Member",
                  streak: 18,
                  pts: "1,950",
                },
                {
                  name: "Priya Sharma",
                  role: "Member",
                  streak: 14,
                  pts: "1,620",
                },
              ]?.map((m) => (
                <div key={m?.name} className="flex items-center gap-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-accent">
                    {m?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-white truncate block">
                      {m?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {m?.streak}d streak
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    {m?.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
