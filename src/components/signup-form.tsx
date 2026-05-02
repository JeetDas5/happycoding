"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  action: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>;
}

export function SignupForm({ action }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/verify-email");
    }
    setLoading(false);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Get started with Happy Coding today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 mb-2">
          <div className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                />
                <FieldDescription>
                  We&apos;ll use this to verify your account
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                />
                <FieldDescription>
                  At least 8 characters recommended
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  required
                  disabled={loading}
                />
              </Field>
            </FieldGroup>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
