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
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export function ResetPasswordForm({ action }: Props) {
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (e.currentTarget.password.value !== e.currentTarget.confirmPassword.value) {
      setLoading(false);
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);

    const result = await action(formData);

    if (result?.error) {
      toast.error(result.error || "Reset failed");
    } else {
      toast.success("Password updated. You can now sign in.");
      router.push("/login");
    }

    setLoading(false);
  }

  return (
    <Card className="w-full border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Set a new password</CardTitle>
        <CardDescription>Choose a secure password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-2">
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="password" name="password" type="password" placeholder="Password" className="pl-10 h-11" required disabled={loading} />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm</FieldLabel>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="confirm-password" name="confirmPassword" type="password" placeholder="Confirm" className="pl-10 h-11" required disabled={loading} />
              </div>
            </Field>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-base font-semibold shadow-lg shadow-primary/20">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
