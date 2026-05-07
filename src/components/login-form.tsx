"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Props {
  action: (
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>;
}

export function LoginForm({ action }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (e.currentTarget.password.value.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result.error) {
      toast.error(result.error || "Login failed");
    } else {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <Card className="w-full border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-2">
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
              </div>
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-3 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </Field>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </>
            )}
          </Button>

          <div className="text-center text-sm pt-2">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
