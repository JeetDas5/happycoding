import React from "react";
import "../styles/tailwind.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Plus_Jakarta_Sans, Manrope, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default:
      "HappyCoding - Competitive Programming Tracker & Codeforces Practice",
    template: "%s | HappyCoding",
  },
  description:
    "HappyCoding is a competitive programming platform for Codeforces users to track daily streaks, solve practice problems, compete in contests, and climb leaderboards.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
  openGraph: {
    type: "website",
    url: "https://happycoding.jeetdas.site",
    title:
      "HappyCoding - Competitive Programming Tracker & Codeforces Practice",
    description:
      "Track Codeforces streaks, solve problems, compete in contests, and climb leaderboards.",
    siteName: "HappyCoding",
    images: [
      {
        url: "/assets/images/app_logo.png",
        width: 1200,
        height: 630,
        alt: "HappyCoding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "HappyCoding - Competitive Programming Tracker & Codeforces Practice",
    description:
      "Track Codeforces progress, maintain streaks, and compete with programmers globally.",
    images: ["/assets/images/app_logo.png"],
  },
  keywords: [
    "competitive programming",
    "Codeforces tracker",
    "Codeforces practice",
    "coding streak tracker",
    "competitive coding",
    "cp contests",
    "programming leaderboard",
    "HappyCoding",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://happycoding.jeetdas.site",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={plusJakartaSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "HappyCoding",
              url: "https://happycoding.jeetdas.site",
              description:
                "Competitive programming tracker and Codeforces practice platform.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://happycoding.jeetdas.site/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
        </ThemeProvider>
        <Toaster position="bottom-right" duration={3000} />
        <Analytics />
      </body>
    </html>
  );
}
