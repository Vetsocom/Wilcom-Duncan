import "server-only";

import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function getSmtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_SECURE || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is incomplete. Check SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, and SMTP_PASS.");
  }

  const port = Number(SMTP_PORT);

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  return {
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  };
}

export async function sendMail({ to, subject, html, replyTo }: SendMailInput) {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport(config);

  return transporter.sendMail({
    from: `"Wilcom Duncan" <${config.auth.user}>`,
    to,
    subject,
    html,
    replyTo,
  });
}
