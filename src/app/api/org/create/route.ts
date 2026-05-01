import { createOrganization } from "@/actions/organisations.actions";
import { createOrganizationSchema } from "@/validations";
import { NextResponse } from "next/server";
import z from "zod";
export async function POST(req: Request) {
  try {
    const { userId, name } = await req.json();

    try {
      createOrganizationSchema.parse({ userId, name });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: validationError.issues[0].message },
          { status: 400 },
        );
      }
    }

    const org = await createOrganization(userId, name);
    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json("Failed to create organization", { status: 500 });
  }
}
