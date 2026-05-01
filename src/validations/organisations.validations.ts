import * as z from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name must be at least 3 characters long"),
  userId: z.uuid("Invalid user ID"),
});

export const joinOrganizationSchema = z.object({
  inviteCode: z.string().length(8, "Invite code must be 8 characters long"),
  userId: z.uuid("Invalid user ID"),
});
