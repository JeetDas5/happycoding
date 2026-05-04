import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { resetPasswordAction } from "@/actions/auth.actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      <div className="absolute top-8 left-8 z-20 animate-in fade-in slide-in-from-left-4 duration-700">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <div className="p-2 rounded-full border bg-background group-hover:border-primary/50 transition-colors shadow-sm">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight inline-block mb-2"
          >
            Happy<span className="text-primary">Coding</span>
          </Link>
          <p className="text-muted-foreground">Choose a new password</p>
        </div>
        <Suspense
          fallback={
            <div className="h-80 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
          }
        >
          <ResetPasswordForm action={resetPasswordAction} />
        </Suspense>
      </div>
    </div>
  );
}
