import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { applicationSchema } from "@/lib/validations/application";
import { Application } from "@/models/Application";

const successMessage = "Application received. Our team will contact you with next steps.";
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

    const parsed = applicationSchema.safeParse(body);

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
    const application = await Application.create(data);
    const submittedDate = new Date(application.createdAt).toLocaleString();
    const subjectTitle = data.activityTitle || "General Application";

    await sendMail({
      to: receiverEmail,
      subject: `New Application Received: ${subjectTitle}`,
      replyTo: data.email,
      html: `
        <h2>New Application Received</h2>
        <p><strong>Full name:</strong> ${escapeHtml(data.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Organization:</strong> ${escapeHtml(data.organization)}</p>
        <p><strong>Role/title:</strong> ${escapeHtml(data.role)}</p>
        <p><strong>Activity applying for:</strong> ${escapeHtml(data.activityTitle)}</p>
        <p><strong>Activity type:</strong> ${escapeHtml(data.activityType)}</p>
        <p><strong>Source:</strong> ${escapeHtml(data.source)}</p>
        <p><strong>Reason for interest:</strong></p>
        <p>${escapeHtml(data.reason).replaceAll("\n", "<br />")}</p>
        <p><strong>Submitted date:</strong> ${escapeHtml(submittedDate)}</p>
      `,
    });

    await sendMail({
      to: data.email,
      subject: "Application Received",
      html: `
        <p>Hello ${escapeHtml(data.fullName)},</p>
        <p>Your application has been received. Our team will review it and contact you with the next steps.</p>
        <p>Regards,<br />Wilcom Duncan Team</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: successMessage, data: { id: application._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
