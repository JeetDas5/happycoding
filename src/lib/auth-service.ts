import db from "@/db";
import { verificationTokens, users } from "@/db/schema";
import { sendMail } from "@/lib/send-email";
import { generateTokenEmail } from "@/templates/token-email";
import argon2 from "argon2";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

export async function initiateSignup(data: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await argon2.hash(password);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await db.insert(verificationTokens).values({
    name,
    email,
    password: hashedPassword,
    token,
    expiresAt,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const emailHtml = generateTokenEmail({
    name,
    token,
    verificationUrl,
    expiresIn: "1 hour",
  });

  await sendMail({
    to: email,
    subject: "Verify your email - HappyCoding",
    html: emailHtml,
  });

  return { success: true, message: "Verification email sent" };
}

export async function verifyEmail(token: string) {
  const pending = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.token, token),
      gt(verificationTokens.expiresAt, new Date()),
    ),
  });

  if (!pending) {
    throw new Error("Invalid or expired token");
  }

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      name: pending.name,
      email: pending.email,
      password: pending.password,
    })
    .returning();

  // Delete token
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, pending.id));

  return { success: true, user: newUser };
}

export async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await argon2.verify(user.password, password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return { success: true, user };
}

export async function initiatePasswordReset(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // For security, do not reveal whether the email exists
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Store a reset token; reuse verificationTokens table
  await db.insert(verificationTokens).values({
    name: user.name,
    email: user.email,
    password: user.password, // store current hashed password as placeholder
    token,
    expiresAt,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const emailHtml = generateTokenEmail({
    name: user.name,
    token,
    verificationUrl: resetUrl,
    expiresIn: "1 hour",
  });

  const response = await sendMail({
    to: user.email,
    subject: "Reset your password - HappyCoding",
    html: emailHtml,
  });

  if (response.error) {
    return { success: false, error: "Failed to send reset email" };
  }

  return {
    success: true,
    message: "If that email exists, a reset link was sent",
  };
}

export async function resetPassword(token: string, newPassword: string) {
  const pending = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.token, token),
      gt(verificationTokens.expiresAt, new Date()),
    ),
  });

  if (!pending) {
    throw new Error("Invalid or expired token");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, pending.email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const hashed = await argon2.hash(newPassword);

  await db.update(users).set({ password: hashed }).where(eq(users.id, user.id));

  // delete token
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, pending.id));

  return { success: true };
}
