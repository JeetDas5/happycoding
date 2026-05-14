"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { SyncButton } from "@/app/dashboard/client-widgets";
import { useJwtSession } from "@/lib/use-jwt-session";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

export function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useJwtSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const showSync = pathname === "/dashboard" || pathname === "/profile";

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Practice", href: "/practice" },
    { name: "Organisation", href: "/organisation" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <>
      <header className="sticky top-0 z-90 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Image
                src="/assets/images/app_logo.png"
                alt="Logo"
                width={25}
                height={25}
              />
              <span className="text-xl font-bold tracking-tight">
                Happy<span className="text-primary">Coding</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium px-3 py-2 rounded-md transition-all relative group/link",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                  {pathname === link.href && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden sm:block h-6 w-px bg-border mx-1" />

            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {showSync && (
              <div className="hidden sm:block">
                <SyncButton />
              </div>
            )}

            <div className="hidden sm:block h-6 w-px bg-border mx-1" />

            <div className="relative group hidden sm:block">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
              </button>

              <div className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-xl border bg-background p-1 shadow-lg opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Toggle Button */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-80 sm:hidden bg-black/70 animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed inset-0 top-16 z-[85] bg-background flex flex-col p-4 sm:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl text-lg font-semibold transition-all",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  {link.name}
                  {pathname === link.href && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t pt-6 pb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-bold">{user?.name || "User"}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <ModeToggle />
              </div>

              {showSync && (
                <div className="px-2">
                  <SyncButton />
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl p-4 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
