"use client";

import { useState, useEffect } from "react";
import AppLogo from "@/components/ui/AppLogo";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";
import { ModeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Leaderboard", href: "#social-proof" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled ? "top-3" : "top-5"
        }`}
      >
        <div className="glass-card rounded-full px-4 py-3 flex items-center gap-1 hero-anim-0">
          <Link
            href="/"
            className="flex items-center gap-2 pl-1 pr-2"
            aria-label="HappyCoding home"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br from-accent/20 to-primary/10 border border-border/50">
              <AppLogo size={22} />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground hidden sm:block">
              HappyCoding
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 px-2">
            {navLinks?.map((link) => (
              <Link
                key={link?.label}
                href={link?.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-muted/50"
              >
                {link?.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden sm:block mr-1">
              <ModeToggle />
            </div>
            <Link
              href="/signup"
              className="group relative flex items-center gap-2 bg-primary hover:bg-primary/70 transition-all duration-300 rounded-full px-4 py-2 overflow-hidden"
            >
              <span className="text-sm font-semibold text-white relative z-10">
                Join
              </span>
              <Icon
                name="ArrowRightIcon"
                size={14}
                className="text-white relative z-10 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>

          <button
            className="md:hidden ml-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon
              name={menuOpen ? "XMarkIcon" : "Bars3Icon"}
              size={20}
              className="text-foreground"
            />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          onClick={handleLinkClick}
        >
          {navLinks?.map((link) => (
            <Link
              key={link?.label}
              href={link?.href}
              className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              {link?.label}
            </Link>
          ))}
          <div className="flex flex-col items-center gap-4 mt-4 w-full px-8">
            <Link
              href="#cta"
              className="w-full text-center bg-primary text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-accent transition-colors"
              onClick={handleLinkClick}
            >
              Join HappyCoding
            </Link>
            <div className="flex items-center gap-3 pt-4 border-t border-border w-full justify-center">
              <span className="text-sm text-muted-foreground">Appearance:</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
