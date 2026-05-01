import { joinOrganization } from "@/actions/organisations.actions";
import { joinOrganizationSchema } from "@/validations";
import { NextResponse } from "next/server";
import z from "zod";
export async function POST(req: Request) {
  try {
    const { userId, inviteCode } = await req.json();

    try {
      joinOrganizationSchema.parse({ userId, inviteCode });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: validationError.issues[0].message },
          { status: 400 },
        );
      }
    }

    const org = await joinOrganization(userId, inviteCode);
    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json("Failed to join organization", { status: 500 });
  }
}
