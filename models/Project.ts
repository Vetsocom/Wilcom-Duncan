import { Schema, models, model, type InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    year: { type: Number, default: new Date().getFullYear() },
    date: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    category: { type: String, default: "", trim: true },
    status: { type: String, enum: ["past", "upcoming"], default: "upcoming" },
    excerpt: { type: String, default: "" },
    description: { type: String, default: "" },
    role: { type: String, default: "" },
    topics: { type: [String], default: [] },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    collaborators: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>;

export const Project =
  models.Project || model("Project", ProjectSchema);
