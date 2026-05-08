"use server";

import z from "zod";
import { cookies } from "next/headers";

import {
  initiateSignup,
  verifyEmail as verifyEmailService,
  login,
  initiatePasswordReset,
  resetPassword,
} from "@/lib/auth-service";
import { signToken } from "@/lib/jwt";
import { loginSchema, registerSchema } from "@/validations/auth.validations";
import { rateLimit, signupLimiter, loginLimiter, passwordResetLimiter } from "@/lib/rate-limiter";
import { getClientIp } from "@/lib/get-client-ip";

export async function signUpAction(formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit(`signup:${ip}`, signupLimiter);
  if (!rl.success) {
    return {
      error: `Too many signup attempts. Please try again in ${rl.retryAfter} second${rl.retryAfter === 1 ? "" : "s"}.`,
    };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    registerSchema.parse({ name, email, password });
    const result = await initiateSignup({ name, email, password });
    return { success: true, message: result.message };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    } else if (error instanceof Error) {
      return { error: error.message || "Signup failed" };
    }
    return { error: "Signup failed" };
  }
}

export async function verifyEmailAction(token: string) {
  try {
    const result = await verifyEmailService(token);
    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message || "Verification failed" };
    }
    return { error: "Verification failed" };
  }
}

export async function loginAction(formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit(`login:${ip}`, loginLimiter);
  if (!rl.success) {
    return {
      error: `Too many login attempts. Please try again in ${rl.retryAfter} second${rl.retryAfter === 1 ? "" : "s"}.`,
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    loginSchema.parse({ email, password });
    const result = await login({ email, password });

    // Set cookie
    const token = signToken({ userId: result.user.id });
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    } else if (error instanceof Error) {
      return { error: error.message || "Login failed" };
    }
    return { error: "Login failed" };
  }
}

export async function requestPasswordResetAction(formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit(`password-reset:${ip}`, passwordResetLimiter);
  if (!rl.success) {
    return {
      error: `Too many reset attempts. Please try again in ${rl.retryAfter} second${rl.retryAfter === 1 ? "" : "s"}.`,
    };
  }

  const email = formData.get("email") as string;

  try {
    const result = await initiatePasswordReset(email);
    return { success: true, message: result.message };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message || "Request failed" };
    }
    return { error: "Request failed" };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  try {
    if (!token || !password) throw new Error("Missing token or password");
    await resetPassword(token, password);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message || "Reset failed" };
    }
    return { error: "Reset failed" };
  }
}
export async function logout() {
  (await cookies()).delete("session");
}
