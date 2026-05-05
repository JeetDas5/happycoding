import HeroSection from "@/app/components/HeroSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import CTASection from "@/app/components/CTASection";
import SpotlightInit from "@/app/components/SpotlightInit";
import ScrollAnimInit from "@/app/components/ScrollAnimInit";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "8rem 8rem",
        }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-7xl h-200 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-0 w-120 h-120 bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Falling beam lines */}
      <div className="fixed inset-0 flex justify-between pointer-events-none z-0 px-6 md:px-24">
        <div className="relative w-px h-full bg-border/20 overflow-hidden">
          <div className="animate-beam absolute w-px h-32 bg-linear-to-b from-transparent via-accent/40 to-transparent" />
        </div>
        <div className="hidden md:block w-px h-full bg-border/20 overflow-hidden absolute left-1/2 -translate-x-1/2">
          <div className="animate-beam-delay-1 absolute w-px h-32 bg-linear-to-b from-transparent via-accent/40 to-transparent" />
        </div>
        <div className="relative w-px h-full bg-border/20 overflow-hidden">
          <div className="animate-beam-delay-2 absolute w-px h-32 bg-linear-to-b from-transparent via-accent/40 to-transparent" />
        </div>
      </div>

      <Header />

      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      <Footer />

      <SpotlightInit />
      <ScrollAnimInit />
    </div>
  );
}
