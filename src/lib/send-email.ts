import { Resend } from "resend";

interface Props{
    to: string;
    subject: string;
    html: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, html }: Props) => {
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
};
