import Header from "@/components/header";
import SpotlightInit from "@/app/components/SpotlightInit";
import ScrollAnimInit from "@/app/components/ScrollAnimInit";

export const metadata = {
  title: "Terms of Service - HappyCoding",
  description: "Read our terms of service for using HappyCoding.",
};

export default function TermsPage() {
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

      <Header />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 hero-anim-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: May 6, 2026</p>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border-primary/10 space-y-10 hero-anim-2">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using HappyCoding, you agree to be bound by
                these Terms of Service. If you do not agree to these terms,
                please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                HappyCoding is a platform designed for Codeforces users to track
                their daily streaks, earn points based on problem-solving
                activity, and compete on leaderboards. We are not affiliated
                with Codeforces.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                To use certain features, you must create an account. You are
                responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your
                account. You must provide accurate and complete information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Codeforces Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                HappyCoding fetches public data from the Codeforces API to track
                your progress. By using our service, you acknowledge that we
                rely on the availability and accuracy of Codeforces data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-2 ml-4">
                <li>
                  Attempt to manipulate points or streaks through unfair means.
                </li>
                <li>Use the service for any illegal purpose.</li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  service.
                </li>
                <li>Impersonate other users or Codeforces handles.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                HappyCoding is provided &quot;as is&quot; without any
                warranties. We shall not be liable for any indirect, incidental,
                or consequential damages arising out of your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Your
                continued use of the service after changes are posted
                constitutes your acceptance of the new terms.
              </p>
            </section>

            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                If you have any questions about these Terms, please{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact us
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <SpotlightInit />
      <ScrollAnimInit />
    </div>
  );
}
