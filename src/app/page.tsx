import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Code2, Rocket, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-3">
                <Rocket className="w-4 h-4" />
                <span>Next generation coding platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                Code faster, <span className="text-primary">happier</span>, and
                smarter than ever
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                The ultimate platform for modern developers. Build, deploy, and
                scale your applications with confidence using our
                state-of-the-art tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <Button size="lg" className="h-12 px-8 text-lg rounded-xl">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-lg rounded-xl"
                >
                  <Link href="#features">View Features</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px]" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Master the Art of Competitive Programming
              </h2>
              <p className="text-muted-foreground text-lg">
                The comprehensive platform designed to elevate your coding
                journey with real-time tracking and community-driven growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Code2 className="w-8 h-8 text-primary" />}
                title="Codeforces Verification"
                description="Seamlessly link your Codeforces handle. Verify your skills with automated submission checks and track your rating progress."
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-primary" />}
                title="Coding Streaks"
                description="Build consistency with our advanced streak tracking system. Stay motivated and never miss a day of improvement."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8 text-primary" />}
                title="Organizations"
                description="Create or join coding communities. Compete in private leaderboards and grow alongside your peers and colleagues."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <div className="bg-primary rounded-3xl p-8 md:p-16 text-primary-foreground relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to transform your workflow?
                </h2>
                <p className="text-primary-foreground/80 text-xl mb-10">
                  Join thousands of developers who are already using happycoding
                  to build the future.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-lg rounded-xl"
                >
                  <Link href="/signup">Start Your Journey Now</Link>
                </Button>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-bold tracking-tight">
            happy<span className="text-primary">coding</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 happycoding. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card p-8 rounded-2xl border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
      <div className="mb-6 p-3 rounded-xl bg-primary/5 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
