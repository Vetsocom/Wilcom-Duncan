import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

export async function POST() {
  try {
    await connectDB();
    const result = await Notification.updateMany({ status: "unread" }, { status: "read" });
    return NextResponse.json({ success: true, data: { modifiedCount: result.modifiedCount } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to mark notifications as read." }, { status: 500 });
  }
}
