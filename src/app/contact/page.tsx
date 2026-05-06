"use server";

import Header from "@/components/header";
import Footer from "@/components/footer";
import SpotlightInit from "@/app/components/SpotlightInit";
import ScrollAnimInit from "@/app/components/ScrollAnimInit";
import ContactForm from "@/components/contact-form";

export default async function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Background Gradients */}
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 hero-anim-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a bug to report, a feature in mind, or just want to say hi?
              We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-start hero-anim-2">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <p className="text-muted-foreground mb-6">
                  Fill out the form and our team will get back to you within 24
                  hours.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email Us
                      </p>
                      <p className="font-medium">hello@jeetdas.site</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </p>
                      <p className="font-medium text-emerald-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        All systems operational
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border-primary/10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SpotlightInit />
      <ScrollAnimInit />
    </div>
  );
}
