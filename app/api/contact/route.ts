import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { contactSchema } from "@/lib/validations/contact";
import { ContactInquiry } from "@/models/ContactInquiry";

const successMessage = "Thank you for reaching out. Your message has been received.";
const errorMessage = "Something went wrong. Please try again.";

function escapeHtml(value?: string) {
  return (value || "Not provided")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true, message: successMessage }, { status: 200 });
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Please check the form and try again.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { website, ...data } = parsed.data;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!receiverEmail) {
      throw new Error("CONTACT_RECEIVER_EMAIL is missing. Add it to your server environment.");
    }

    // TODO: Add production rate limiting for this public endpoint.
    await connectDB();
    const inquiry = await ContactInquiry.create(data);
    const submittedDate = new Date(inquiry.createdAt).toLocaleString();

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
      `,
    });

    await sendMail({
      to: data.email,
      subject: "Thank you for contacting Wilcom Duncan",
      html: `
        <p>Hello ${escapeHtml(data.fullName)},</p>
        <p>Thank you for reaching out. Your message has been received, and our team will contact you shortly.</p>
        <p>Regards,<br />Wilcom Duncan Team</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: successMessage, data: { id: inquiry._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
