"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { SyncButton } from "@/app/dashboard/client-widgets";
import { useJwtSession } from "@/lib/use-jwt-session";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";

export function DashboardNavbar() {
  const { data: session } = useJwtSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const showSync = pathname === "/dashboard" || pathname === "/profile";

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Practice", href: "/practice" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          Happy<span className="text-primary">Coding</span>
        </Link>

        <div className="flex items-center gap-3">
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

          <div className="h-6 w-px bg-border mx-1" />

          <ModeToggle />

          {showSync && (
            <div className="hidden sm:block">
              <SyncButton />
            </div>
          )}

          <div className="h-6 w-px bg-border mx-1" />

          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || "User"}
              </span>
            </button>

            <div className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-xl border bg-background p-1 shadow-lg opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
