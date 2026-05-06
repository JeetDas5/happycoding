"use server";

import { sendMail } from "@/lib/send-email";
import { generateContactEmail } from "@/templates/contact-email";
import z from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  type: z.enum(["bug", "feature request", "feedback"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function sendContactEmailAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as "bug" | "feature request" | "feedback";
  const message = formData.get("message") as string;

  try {
    contactSchema.parse({ name, email, type, message });

    const emailHtml = generateContactEmail({
      name,
      email,
      type,
      message,
    });

    await sendMail({
      to: "jeet15083011@gmail.com",
      subject: `New ${type} from ${name} - HappyCoding`,
      html: emailHtml,
    });

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    } else if (error instanceof Error) {
      return { error: error.message || "Failed to send message" };
    }
    return { error: "Failed to send message" };
  }
}
