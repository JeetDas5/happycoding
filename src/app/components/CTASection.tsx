import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

const perks = [
  "Free to join - no credit card",
  "Codeforces integration in 2 min",
  "Instant leaderboard access",
  "Email verification keeps it legit",
];

export default function CTASection() {
  return (
    <section
      id="cta"
      className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative"
      aria-label="Join HappyCoding call to action"
    >
      <div className="relative rounded-3xl border border-border bg-linear-to-br from-primary/20 via-card to-accent/10 overflow-hidden p-10 md:p-16 animate-on-scroll opacity-100 scroll-anim-1">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />

        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          <div className="flex-1 max-w-xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-accent mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-foreground dark:bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground dark:bg-accent" />
              </span>
              1,200+ coders already competing
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.05] mb-4">
              <span className="text-foreground/50">Ready to stop</span>
              <span className="text-foreground block">solving alone?</span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground font-body font-light leading-relaxed mb-8 max-w-md">
              Join HappyCoding and turn your daily Codeforces grind into a
              competitive sport. Your streak starts the moment you register.
            </p>

            <ul className="space-y-3 mb-8">
              {perks?.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Icon
                    name="CheckCircleIcon"
                    size={16}
                    variant="solid"
                    className="text-emerald-400 shrink-0"
                  />
                  <span className="text-sm text-muted-foreground font-body">
                    {p}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group relative flex items-center justify-center gap-3 rounded-full pl-3 py-2 pr-9 overflow-hidden border border-border bg-linear-to-b from-primary/10 via-white to-primary/10 dark:from-muted/20 dark:via-muted/5 dark:to-muted/20 backdrop-blur-xl hover:bg-primary/10 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "1px",
                  }}
                >
                  <div
                    className="absolute animate-spin-slow"
                    style={{
                      inset: "-100%",
                      background:
                        "conic-gradient(from 0deg, transparent 0 300deg, #3B82F6 360deg)",
                    }}
                  />
                </div>
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                  <Icon name="BoltIcon" size={18} variant="solid" />
                </div>
                <span className="relative z-10 text-base font-bold text-foreground tracking-wide">
                  Join
                </span>
              </Link>

              <Link
                href="#features"
                className="flex items-center justify-center gap-2 glass-card rounded-full px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore features
                <Icon
                  name="ArrowRightIcon"
                  size={14}
                  className="text-muted-foreground dark:text-accent group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-auto lg:min-w-75 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Live Activity
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">
                  LIVE
                </span>
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  user: "tourist",
                  action: "solved 1942G",
                  pts: "+100",
                  time: "2s ago",
                  color: "text-yellow-400",
                },
                {
                  user: "neal_wu",
                  action: "extended streak",
                  pts: "🔥 89d",
                  time: "14s ago",
                  color: "text-slate-300",
                },
                {
                  user: "Arjun M.",
                  action: "solved 1900D",
                  pts: "+60",
                  time: "31s ago",
                  color: "text-accent",
                },
                {
                  user: "Sofia C.",
                  action: "joined org ICPC",
                  pts: "🏆",
                  time: "1m ago",
                  color: "text-purple-400",
                },
              ]?.map((a) => (
                <div key={a?.user} className="flex items-center gap-3 text-xs">
                  <span
                    className={`font-bold font-mono ${a?.color} w-16 shrink-0 truncate`}
                  >
                    {a?.user}
                  </span>
                  <span className="flex-1 text-muted-foreground font-body truncate">
                    {a?.action}
                  </span>
                  <span className="font-mono text-emerald-400 shrink-0">
                    {a?.pts}
                  </span>
                  <span className="text-muted-foreground font-mono shrink-0">
                    {a?.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Active now</span>
              <span className="text-foreground font-bold">347 coders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
