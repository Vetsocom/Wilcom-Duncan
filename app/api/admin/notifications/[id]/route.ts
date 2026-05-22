import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function invalidId() {
  return NextResponse.json({ success: false, error: "Invalid notification id." }, { status: 400 });
}

export async function PUT(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    const notification = await Notification.findByIdAndUpdate(id, { status: "read" }, { new: true }).lean();
    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to mark notification as read." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return invalidId();

    await connectDB();
    await Notification.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete notification." }, { status: 500 });
  }
}
