import { Schema, models, model, type InferSchemaType } from "mongoose";

const applicationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    organization: { type: String, trim: true },
    role: { type: String, trim: true },
    activityTitle: { type: String, trim: true },
    activityId: { type: String, trim: true },
    activityType: { type: String, trim: true },
    reason: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ["calendar", "bootcamp", "event", "general"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "accepted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export type ApplicationDocument = InferSchemaType<typeof applicationSchema>;

export const Application =
  models.Application || model("Application", applicationSchema);
