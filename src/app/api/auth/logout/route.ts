import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST() {
  (await cookies()).delete("session");
  redirect("/");
}

export async function GET() {
  return Response.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}
