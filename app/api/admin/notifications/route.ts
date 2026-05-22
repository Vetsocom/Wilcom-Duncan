import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

function serialize(notification: any) {
  return {
    ...notification,
    _id: notification._id?.toString(),
    id: notification._id?.toString(),
    createdAt: notification.createdAt?.toISOString?.() || notification.createdAt,
    updatedAt: notification.updatedAt?.toISOString?.() || notification.updatedAt,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
    const query: Record<string, string> = {};

    if (status === "unread" || status === "read") {
      query.status = status;
    }

    await connectDB();
    const [notifications, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ status: "unread" }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications.map(serialize),
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load notifications." }, { status: 500 });
  }
}
