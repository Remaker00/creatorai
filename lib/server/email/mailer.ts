/**
 * Outgoing email seam. With RESEND_API_KEY + EMAIL_FROM set, mail goes through Resend's HTTP API
 * (plain fetch, no SDK). Without them, development logs the message so links can be clicked;
 * production logs only that delivery is unconfigured — never the message (it may contain tokens).
 */
export interface Email {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(email: Email): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (apiKey && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [email.to], subject: email.subject, text: email.text, html: email.html }),
    });
    if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
    return { delivered: true };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[email:dev] To: ${email.to}\nSubject: ${email.subject}\n\n${email.text}`);
  } else {
    console.warn("[email] RESEND_API_KEY / EMAIL_FROM not set; email not sent:", email.subject);
  }
  return { delivered: false };
}
