import db from "@/db";
import { syncUser } from "@/helper/sync";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allUsers = await db.query.users.findMany();

    for (const user of allUsers) {
      await syncUser(user);
    }
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
