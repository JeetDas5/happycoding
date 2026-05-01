interface Props{
    to: string;
    subject: string;
    html: string;
}


export const sendMail = async ({ to, subject, html }: Props) => {
  console.log("Inside send email fn");
  const res = await fetch("https://api.unosend.co/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UNOSEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Jeet <hello@jeetdas.site>",
      to: [to],
      subject: subject,
      html: html,
    }),
  });
  const data = await res.json();
  console.log("Unosend response:", data);
  console.log("Status:", res.status);
  return data;
};
