import { Schema, models, model, type InferSchemaType } from "mongoose";

const ProfileImagesSchema = new Schema(
  {
    hero: { type: String, default: "", trim: true },
    about: { type: String, default: "", trim: true },
    speakerProfile: { type: String, default: "", trim: true },
    contact: { type: String, default: "", trim: true },
    author: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ProfileSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    name: { type: String, default: "Wilcom Duncan", trim: true },
    titles: { type: [String], default: [] },
    bio: { type: String, default: "" },
    location: { type: String, default: "", trim: true },
    socialLinks: { type: Schema.Types.Mixed, default: {} },
    expertiseAreas: { type: [Schema.Types.Mixed], default: [] },
    platforms: { type: [String], default: [] },
    speakingTopics: { type: [String], default: [] },
    images: { type: ProfileImagesSchema, default: {} },
  },
  { timestamps: true }
);

export type ProfileDocument = InferSchemaType<typeof ProfileSchema>;

export const Profile =
  models.Profile || model("Profile", ProfileSchema);
