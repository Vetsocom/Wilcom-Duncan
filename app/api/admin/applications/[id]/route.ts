import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/Application";

const statusSchema = z.object({
  status: z.enum(["new", "reviewed", "accepted", "rejected"]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

function invalidId() {
  return NextResponse.json({ success: false, error: "Invalid application id." }, { status: 400 });
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const application = await Application.findById(id).lean();
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch application." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    const parsed = statusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid application status." }, { status: 400 });
    }

    await connectDB();
    const application = await Application.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    ).lean();

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update application." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const application = await Application.findByIdAndDelete(id).lean();
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete application." }, { status: 500 });
  }
}
