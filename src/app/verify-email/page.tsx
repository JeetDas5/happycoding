import { Suspense } from "react";
import { VerifyEmailPage } from "./verify-email";

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl text-center animate-pulse">
        <div className="h-12 w-12 bg-blue-500/20 rounded-full mx-auto mb-4 border-4 border-blue-500/40 border-t-blue-500" />
        <h1 className="text-2xl font-bold mb-2">Verifying Email...</h1>
        <p className="text-gray-400">Please wait while we confirm your email.</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailPage />
    </Suspense>
  );
}