import { Schema, models, model, type InferSchemaType } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["registration", "contact", "media", "content", "system"],
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    link: { type: String, trim: true },
    relatedId: { type: String, trim: true },
  },
  { timestamps: true }
);

export type NotificationDocument = InferSchemaType<typeof NotificationSchema>;

export const Notification =
  models.Notification || model("Notification", NotificationSchema);
