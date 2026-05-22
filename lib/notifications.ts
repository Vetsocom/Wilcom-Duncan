import "server-only";

import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

type NotificationInput = {
  title: string;
  message: string;
  type: "registration" | "contact" | "media" | "content" | "system";
  priority?: "low" | "normal" | "high";
  link?: string;
  relatedId?: string;
};

export async function createNotification(input: NotificationInput) {
  await connectDB();
  return Notification.create({
    ...input,
    priority: input.priority || "normal",
    status: "unread",
  });
}

export async function markNotificationRead(id: string) {
  await connectDB();
  return Notification.findByIdAndUpdate(id, { status: "read" }, { new: true }).lean();
}

export async function getUnreadNotificationCount() {
  await connectDB();
  return Notification.countDocuments({ status: "unread" });
}
