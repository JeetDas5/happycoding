import { Resend } from "resend";
import nodemailer from "nodemailer";

interface Props {
  to: string;
  subject: string;
  html: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html }: Props) => {
  try {
    // Nodemailer logic
    const info = await transporter.sendMail({
      from: `"HappyCoding" <${process.env.NODE_MAILER_EMAIL}>`,
      to,
      subject,
      html,
    });
    return info;

    /*
    // Existing Resend logic (kept as requested)
    const { data, error } = await resend.emails.send({
      from: "HappyCoding <hello@jeetdas.site>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message || "Failed to send email");
    }

    return data;
    */
  } catch (error) {
    console.error("Email error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to send email");
  }
};

