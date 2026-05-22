import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { Registration } from "@/models/Registration";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateSchema = z.object({
  status: z.enum(["new", "reviewed", "accepted", "rejected", "waitlisted"]).optional(),
  notes: z.string().trim().optional(),
});

function invalidId() {
  return NextResponse.json({ success: false, error: "Invalid registration id." }, { status: 400 });
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const registration = await Registration.findById(id).lean();
    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch registration." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Please check the registration update." }, { status: 400 });
    }

    await connectDB();
    const registration = await Registration.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    if (parsed.data.status) {
      await createNotification({
        title: "Registration status updated",
        message: `${registration.fullName} was marked as ${parsed.data.status}.`,
        type: "registration",
        priority: "normal",
        link: `/admin/registrations?id=${id}`,
        relatedId: id,
      });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update registration." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const registration = await Registration.findByIdAndDelete(id).lean();
    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete registration." }, { status: 500 });
  }
}
