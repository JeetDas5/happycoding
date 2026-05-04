import db from "@/db";
import { syncUser } from "@/helper/sync";
import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();
  try {
    const allUsers = await db.query.users.findMany();

    for (const user of allUsers) {
      await syncUser(user);
    }
    console.log(`[CRON] sync completed in ${Date.now() - start}ms`);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error syncing users: ", error.message);
    }
    return NextResponse.json(
      { success: false, message: "Error syncing users" },
      { status: 500 },
    );
  }
}
