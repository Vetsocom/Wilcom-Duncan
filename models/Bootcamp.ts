import { Schema, models, model, type InferSchemaType } from "mongoose";

const BootcampSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    theme: { type: String, default: "", trim: true },
    status: { type: String, enum: ["past", "upcoming"], default: "upcoming" },
    overview: { type: String, default: "" },
    objectives: { type: [String], default: [] },
    topics: { type: [String], default: [] },
    speakers: { type: [String], default: [] },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    testimonials: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    registrationOpen: { type: Boolean, default: false },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export type BootcampDocument = InferSchemaType<typeof BootcampSchema>;

export const Bootcamp =
  models.Bootcamp || model("Bootcamp", BootcampSchema);
