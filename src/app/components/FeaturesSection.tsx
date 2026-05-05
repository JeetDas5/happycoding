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
            "linear-gradient(180deg, transparent, currentColor 10%, currentColor 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, currentColor 10%, currentColor 70%, transparent)",
        }}
      >
        <span
          className="font-extrabold text-foreground/[0.03] tracking-tighter whitespace-nowrap"
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.05]">
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
        <div className="spotlight-card md:row-span-2 rounded-2xl p-6 border border-border bg-card animate-on-scroll opacity-100 scroll-anim-2 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Icon name="FireIcon" size={20} variant="solid" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                01
              </span>
              <h3 className="text-lg font-bold text-foreground">
                Daily Streak Tracking
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
            Solve at least one Codeforces problem per day to keep your streak
            alive. Miss a day and you start over — the pressure is real.
          </p>

          <div className="flex-1 bg-muted/30 rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground">
                Current Streak
              </span>
              <span className="text-2xl font-extrabold text-foreground font-mono">
                47 🔥
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 })?.map((_, i) => {
                const intensity =
                  i < 26 ? (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1) : 0;
                const colors = [
                  "bg-primary dark:bg-muted",
                  "bg-primary/70 dark:bg-accent/25",
                  "bg-primary/50 dark:bg-accent/55",
                  "bg-primary dark:bg-accent shadow-[0_0_6px_rgba(59,130,246,0.5)]",
                ];
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md ${colors?.[intensity]}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-body">
                Best streak
              </span>
              <span className="text-sm font-bold text-foreground font-mono">
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
            <span className="text-xs text-muted-foreground font-body">
              Auto-synced from Codeforces submissions
            </span>
          </div>
        </div>

        <div className="spotlight-card rounded-2xl p-6 border border-border bg-card animate-on-scroll opacity-100 scroll-anim-3 flex flex-col justify-between min-h-65">
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
                <h3 className="text-lg font-bold text-foreground">
                  Global Leaderboard
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 px-2 py-1 rounded-full">
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
                color: "text-primary dark:text-accent",
                self: true,
              },
            ]?.map((r) => (
              <div
                key={r?.name}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  r?.self
                    ? "bg-primary/40 dark:bg-accent/10 border border-accent/20"
                    : "bg-primary/10 dark:bg-muted/50"
                }`}
              >
                <span className={`font-mono font-bold w-8 ${r?.color}`}>
                  {r?.rank}
                </span>
                <span
                  className={`flex-1 font-semibold ${
                    r?.self ? "text-accent" : "text-foreground/80"
                  }`}
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

        <div className="spotlight-card rounded-2xl p-6 border border-border bg-card animate-on-scroll opacity-100 scroll-anim-4 flex flex-col justify-between min-h-65">
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
              <h3 className="text-lg font-bold text-foreground">
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
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p?.color} ${p?.w}`} />
                </div>
                <span className="text-xs font-mono text-foreground font-bold w-16 text-right">
                  {p?.pts}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="spotlight-card md:col-span-2 rounded-2xl p-6 border border-border bg-card animate-on-scroll opacity-100 scroll-anim-5 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center border border-orange-400/20">
                <Icon
                  name="RocketLaunchIcon"
                  size={20}
                  variant="solid"
                  className="text-orange-400"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  04
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Personalized Practice
                </h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6 max-w-md">
              Target specific tags like DP, Graphs, or Math. Generate custom
              sets at your ideal difficulty to drill your weaknesses and level
              up your ranking.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Targeted tags",
                "Difficulty filters",
                "Session analytics",
              ]?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {[
              {
                title: "Dynamic Programming",
                level: "1600-1800",
                solved: "4/5",
                color: "text-blue-400",
              },
              {
                title: "Graph Theory",
                level: "1400-1600",
                solved: "2/5",
                color: "text-emerald-400",
              },
              {
                title: "Number Theory",
                level: "1200-1400",
                solved: "5/5",
                color: "text-purple-400",
              },
            ]?.map((p) => (
              <div
                key={p?.title}
                className="flex items-center justify-between p-3 rounded-lg bg-primary/5 dark:bg-muted/30 border border-border"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    {p?.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Rating {p?.level}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[11px] font-bold ${p?.color}`}>
                    {p?.solved}
                  </span>
                  <div className="w-16 h-1 bg-muted rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${p?.color?.replace(
                        "text",
                        "bg"
                      )} w-[${
                        (parseInt(p?.solved[0]) / parseInt(p?.solved[2])) * 100
                      }%]`}
                      style={{
                        width: `${
                          (parseInt(p?.solved[0]) / parseInt(p?.solved[2])) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="spotlight-card md:col-span-2 rounded-2xl p-6 border border-border bg-card animate-on-scroll opacity-100 scroll-anim-6 flex flex-col md:flex-row gap-8">
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
                  05
                </span>
                <h3 className="text-lg font-bold text-foreground">
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
                  className="text-xs font-medium text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-primary/5 dark:bg-muted/30 rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-foreground">
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
                    <span className="text-xs font-semibold text-foreground truncate block">
                      {m?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {m?.streak}d streak
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground">
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
