import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { createNotification } from "@/lib/notifications";
import { registrationSchema } from "@/lib/validations/registration";
import { Registration } from "@/models/Registration";

const successMessage = "Registration received. Our team will contact you with next steps.";
const errorMessage = "Unable to submit registration right now. Please try again.";

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

    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Please check the form and try again.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { website, ...data } = parsed.data;

    await connectDB();
    const registration = await Registration.create(data);
    const registrationId = registration._id.toString();
    const submittedDate = new Date(registration.createdAt).toLocaleString();
    const activity = data.bootcampTitle || data.activityTitle || "General registration";

    await createNotification({
      title: "New bootcamp registration",
      message: `${data.fullName} registered for ${activity}.`,
      type: "registration",
      priority: "high",
      link: `/admin/registrations?id=${registrationId}`,
      relatedId: registrationId,
    });

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (receiverEmail) {
      try {
        await sendMail({
          to: receiverEmail,
          subject: `New Registration: ${activity}`,
          replyTo: data.email,
          html: `
            <h2>New Registration</h2>
            <p><strong>Full name:</strong> ${escapeHtml(data.fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
            <p><strong>WhatsApp:</strong> ${escapeHtml(data.whatsapp)}</p>
            <p><strong>Organization:</strong> ${escapeHtml(data.organization)}</p>
            <p><strong>Role/title:</strong> ${escapeHtml(data.role)}</p>
            <p><strong>Bootcamp:</strong> ${escapeHtml(data.bootcampTitle)}</p>
            <p><strong>Activity:</strong> ${escapeHtml(data.activityTitle)}</p>
            <p><strong>Source:</strong> ${escapeHtml(data.source)}</p>
            <p><strong>Reason for interest:</strong></p>
            <p>${escapeHtml(data.reason).replaceAll("\n", "<br />")}</p>
            <p><strong>Submitted date:</strong> ${escapeHtml(submittedDate)}</p>
          `,
        });

        await sendMail({
          to: data.email,
          subject: "Registration Received",
          html: `
            <p>Hello ${escapeHtml(data.fullName)},</p>
            <p>Your registration has been received. Our team will contact you with next steps.</p>
            <p>Regards,<br />Wilcom Duncan Team</p>
          `,
        });
      } catch (error) {
        console.error("REGISTRATION_EMAIL_ERROR:", error);
      }
    }

    return NextResponse.json(
      { success: true, message: successMessage, data: { id: registrationId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTRATION_API_ERROR:", error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
