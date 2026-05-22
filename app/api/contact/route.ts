import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { createNotification } from "@/lib/notifications";
import { contactSchema } from "@/lib/validations/contact";
import { ContactInquiry } from "@/models/ContactInquiry";

const successMessage = "Thank you for reaching out. Your message has been received.";
const fallbackErrorMessage = "Unable to send message right now. Please try again.";
const contactRateLimitWindowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const contactRateLimitMaxRequests = Number(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS || 5);
const contactRateLimitMaxKeys = 10000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var contactRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const contactRateLimitStore = global.contactRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!global.contactRateLimitStore) {
  global.contactRateLimitStore = contactRateLimitStore;
}

function escapeHtml(value?: string) {
  return (value || "Not provided")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  ).toLowerCase();
}

function cleanupRateLimitStore(now: number) {
  if (contactRateLimitStore.size <= contactRateLimitMaxKeys) {
    return;
  }

  for (const [key, entry] of contactRateLimitStore) {
    if (entry.resetAt <= now) {
      contactRateLimitStore.delete(key);
    }
  }

  while (contactRateLimitStore.size > contactRateLimitMaxKeys) {
    const oldestKey = contactRateLimitStore.keys().next().value;

    if (!oldestKey) {
      return;
    }

    contactRateLimitStore.delete(oldestKey);
  }
}

function checkContactRateLimit(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const now = Date.now();
  const key = getClientIdentifier(request);
  const current = contactRateLimitStore.get(key);

  cleanupRateLimitStore(now);

  if (!current || current.resetAt <= now) {
    contactRateLimitStore.set(key, { count: 1, resetAt: now + contactRateLimitWindowMs });
    return null;
  }

  if (current.count >= contactRateLimitMaxRequests) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil((current.resetAt - now) / 1000).toString() },
      }
    );
  }

  current.count += 1;
  return null;
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch (error) {
      console.error("CONTACT_API_ERROR:", error);

      return NextResponse.json(
        { success: false, error: "Invalid request body. Please submit the form again." },
        { status: 400 }
      );
    }

    if (
      body &&
      typeof body === "object" &&
      "website" in body &&
      typeof body.website === "string" &&
      body.website.trim() !== ""
    ) {
      return NextResponse.json({ success: true, message: successMessage }, { status: 200 });
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Please check the form and try again.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { website, ...data } = parsed.data;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!receiverEmail) {
      throw new Error("Missing environment variable: CONTACT_RECEIVER_EMAIL");
    }

    if (!siteUrl) {
      throw new Error("Missing environment variable: NEXT_PUBLIC_SITE_URL");
    }

    const rateLimitResponse = checkContactRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    await connectDB();
    const inquiry = await ContactInquiry.create(data);
    const inquiryId = inquiry._id.toString();
    const submittedDate = new Date(inquiry.createdAt).toLocaleString();

    await createNotification({
      title: "New contact inquiry",
      message: `${data.fullName} sent a message about ${data.inquiryType}.`,
      type: "contact",
      priority: "high",
      link: `/admin/inquiries?id=${inquiryId}`,
      relatedId: inquiryId,
    });

    let adminEmailSent = false;

    try {
      await sendMail({
        to: receiverEmail,
        subject: `New Website Inquiry from ${data.fullName}`,
        replyTo: data.email,
        html: `
          <h2>New Website Inquiry</h2>
          <p><strong>Full name:</strong> ${escapeHtml(data.fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
          <p><strong>Organization:</strong> ${escapeHtml(data.organization)}</p>
          <p><strong>Inquiry type:</strong> ${escapeHtml(data.inquiryType)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(data.message).replaceAll("\n", "<br />")}</p>
          <p><strong>Submitted date:</strong> ${escapeHtml(submittedDate)}</p>
          <p><strong>Website:</strong> ${escapeHtml(siteUrl)}</p>
        `,
      });
      adminEmailSent = true;
    } catch (error) {
      console.error("CONTACT_EMAIL_ERROR:", error);
    }

    if (adminEmailSent) {
      try {
        await sendMail({
          to: data.email,
          subject: "Thank you for contacting Wilcom Duncan",
          html: `
            <p>Hello ${escapeHtml(data.fullName)},</p>
            <p>Thank you for reaching out. Your message has been received, and our team will contact you shortly.</p>
            <p>You can visit us at ${escapeHtml(siteUrl)}.</p>
            <p>Regards,<br />Wilcom Duncan Team</p>
          `,
        });
      } catch (error) {
        console.error("CONTACT_CONFIRMATION_EMAIL_ERROR:", error);
      }
    }

    if (!adminEmailSent) {
      return NextResponse.json(
        {
          success: true,
          message: "Your message was saved, but email notification could not be sent.",
          data: { id: inquiryId },
        },
        { status: 202 }
      );
    }

    return NextResponse.json(
      { success: true, message: successMessage, data: { id: inquiryId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONTACT_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown contact API error"
            : fallbackErrorMessage,
      },
      { status: 500 }
    );
  }
}
