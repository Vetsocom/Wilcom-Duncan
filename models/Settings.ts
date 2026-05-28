import { Schema, models, model, type InferSchemaType } from "mongoose";

const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    siteTitle: { type: String, default: "", trim: true },
    siteDescription: { type: String, default: "", trim: true },
    siteUrl: { type: String, default: "https://wilcomduncan.com", trim: true },
    seoKeywords: { type: String, default: "", trim: true },
    contactEmail: { type: String, default: "", trim: true },
    schedulingLink: { type: String, default: "https://calendly.com/replace-with-client-link", trim: true },
    phone: { type: String, default: "", trim: true },
    whatsapp: { type: String, default: "", trim: true },
    facebook: { type: String, default: "", trim: true },
    instagram: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    youtube: { type: String, default: "", trim: true },
    defaultMetaImage: { type: String, default: "", trim: true },
    footerText: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export type SettingsDocument = InferSchemaType<typeof SettingsSchema>;

export const Settings =
  models.Settings || model("Settings", SettingsSchema);
