import db from "@/db";
import { verificationTokens, users } from "@/db/schema";
import { sendMail } from "@/lib/send-email";
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

  await sendMail({
    to: email,
    subject: "Verify your email",
    html: `
            <h1>Welcome to HappyCoding!</h1>
            <p>Hi ${name},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link expires in 1 hour.</p>
        `,
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

