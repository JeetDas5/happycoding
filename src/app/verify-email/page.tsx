"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailAction } from "@/actions/auth.actions";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleVerification(token: string) {
    const result = await verifyEmailAction(token);
    if (result.success) {
      setStatus("success");
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setStatus("error");
      setMessage(result.error || "Verification failed.");
    }
  }

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleVerification(token);
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl text-center">
        {status === "loading" && (
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-blue-500/20 rounded-full mx-auto mb-4 border-4 border-blue-500/40 border-t-blue-500"></div>
            <h1 className="text-2xl font-bold mb-2">Verifying Email...</h1>
            <p className="text-gray-400">
              Please wait while we confirm your email.
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-green-400">
              Verified!
            </h1>
            <p className="text-gray-400">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-red-400">Oops!</h1>
            <p className="text-gray-400">{message}</p>
            <button
              onClick={() => router.push("/signup")}
              className="mt-6 text-blue-400 hover:underline"
            >
              Try signing up again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
