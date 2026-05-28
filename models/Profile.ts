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

const ImpactStatSchema = new Schema(
  {
    value: { type: String, default: "", trim: true },
    label: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const TestimonialSchema = new Schema(
  {
    quote: { type: String, default: "" },
    name: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ProfileSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    name: { type: String, default: "Wilcom Duncan", trim: true },
    titles: { type: [String], default: [] },
    bio: { type: String, default: "" },
    heroParagraph: { type: String, default: "" },
    aboutPreviewText: { type: String, default: "" },
    impactStats: { type: [ImpactStatSchema], default: [] },
    impactStatsNote: { type: String, default: "", trim: true },
    testimonials: { type: [TestimonialSchema], default: [] },
    testimonialsNote: { type: String, default: "", trim: true },
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
