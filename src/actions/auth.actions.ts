"use server";

import {
  initiateSignup,
  verifyEmail as verifyEmailService,
  login,
} from "@/lib/auth-service";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const result = await initiateSignup({ name, email, password });
    return { success: true, message: result.message };
  } catch (error) {
    if (error instanceof Error) {
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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing required fields" };
  }

  try {
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
    if (error instanceof Error) {
      return { error: error.message || "Login failed" };
    }
    return { error: "Login failed" };
  }
}
