"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean; message?: string }>;
}

export function ForgotPasswordForm({ action }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result?.error) {
      toast.error(result.error || "Request failed");
    } else {
      toast.success(result?.message || "If that email exists, we've sent a reset link.");
    }

    setLoading(false);
  }

  return (
    <Card className="w-full border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
        <CardDescription>Enter your account email to receive reset instructions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-2">
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10 h-11" required disabled={loading} />
              </div>
              <FieldDescription>We&apos;ll send a link to reset your password</FieldDescription>
            </Field>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-base font-semibold shadow-lg shadow-primary/20">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
