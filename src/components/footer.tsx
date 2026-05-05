import Link from "next/link";
import AppLogo from "@/components/ui/AppLogo";

export default function Footer() {
  return (
    <footer className="border-t border-white/6 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <AppLogo size={28} />
          <span className="text-sm font-semibold text-white/70">
            HappyCoding
          </span>
        </div>

        <nav className="flex items-center gap-6 flex-wrap justify-center">
          {["Features", "Leaderboard", "How It Works"]?.map((item) => (
            <Link
              key={item}
              href={`#${item?.toLowerCase()?.replace(/\s+/g, "-")}`}
              className="text-[14px] font-medium text-white/50 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <p className="text-[13px] text-white/30 font-medium">
          Developed by{" "}
          <Link
            href="https://github.com/JeetDas5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors underline underline-offset-2"
          >
            Jeet Das
          </Link>
        </p>
      </div>
      <p className="text-[13px] text-white/30 font-medium mx-auto text-center pb-6">
        &copy; {new Date().getFullYear()} HappyCoding. All rights reserved.
      </p>
    </footer>
  );
}
