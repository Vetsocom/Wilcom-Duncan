import { Schema, models, model, type InferSchemaType } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true, trim: true },
    secureUrl: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    folder: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
    originalFilename: { type: String, required: true, trim: true },
    format: { type: String, required: true, trim: true },
    resourceType: { type: String, required: true, trim: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: Number, required: true },
    alt: { type: String, default: "", trim: true },
    usedFor: { type: String, trim: true },
    uploadedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export type MediaAssetDocument = InferSchemaType<typeof MediaAssetSchema>;

export const MediaAsset =
  models.MediaAsset || model("MediaAsset", MediaAssetSchema);
