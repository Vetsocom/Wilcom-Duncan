import "server-only";

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function getSmtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  const requiredEnv = { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS };

  for (const [name, value] of Object.entries(requiredEnv)) {
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
  }

  const port = Number(SMTP_PORT || 465);
  const secure = SMTP_SECURE === "true";

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  return {
    host: SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  } satisfies SMTPTransport.Options;
}

export async function sendMail({ to, subject, html, replyTo }: SendMailInput) {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport(config);

  try {
    if (process.env.NODE_ENV === "development") {
      await transporter.verify();
    }

    return await transporter.sendMail({
      from: `"Wilcom Duncan" <${config.auth?.user}>`,
      to,
      subject,
      html,
      replyTo,
    });
  } catch (error) {
    console.error("CONTACT_EMAIL_ERROR:", error);
    throw error;
  }
}
