import { Schema, models, model, type InferSchemaType } from "mongoose";

const RegistrationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    organization: { type: String, trim: true },
    role: { type: String, trim: true },
    bootcampTitle: { type: String, trim: true },
    bootcampSlug: { type: String, trim: true },
    activityTitle: { type: String, trim: true },
    activityId: { type: String, trim: true },
    source: {
      type: String,
      enum: ["bootcamp", "calendar", "project-event", "general"],
      default: "general",
    },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "accepted", "rejected", "waitlisted"],
      default: "new",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export type RegistrationDocument = InferSchemaType<typeof RegistrationSchema>;

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);
