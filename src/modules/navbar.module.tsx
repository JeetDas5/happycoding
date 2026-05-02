import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  isUserLoggedIn: boolean;
}

export function NavbarModule({ isUserLoggedIn }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <nav className="glass flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-2xl">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Happy<span className="text-primary">Coding</span>
        </Link>

        <div className="flex items-center gap-4">
          {isUserLoggedIn ? (
            <Button variant="default">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button variant="default">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
