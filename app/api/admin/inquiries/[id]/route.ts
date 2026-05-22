import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ContactInquiry } from "@/models/ContactInquiry";

const statusSchema = z.object({
  status: z.enum(["new", "read", "replied", "archived"]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

function invalidId() {
  return NextResponse.json({ success: false, error: "Invalid inquiry id." }, { status: 400 });
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const inquiry = await ContactInquiry.findById(id).lean();
    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch inquiry." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    const parsed = statusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid inquiry status." }, { status: 400 });
    }

    await connectDB();
    const inquiry = await ContactInquiry.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    ).lean();

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const inquiry = await ContactInquiry.findByIdAndDelete(id).lean();
    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete inquiry." }, { status: 500 });
  }
}
