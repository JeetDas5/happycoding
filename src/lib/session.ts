import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSession() {
  const sessionToken = (await cookies()).get("session")?.value;

  if (!sessionToken) return null;

  const decoded = verifyToken(sessionToken) as { userId: string } | null;
  if (!decoded) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.userId),
  });

  if (!user) return null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}