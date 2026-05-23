import { Schema, models, model, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    date: { type: String, default: "", trim: true },
    author: { type: String, default: "Wilcom Duncan", trim: true },
    excerpt: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema>;

export const BlogPost =
  models.BlogPost || model("BlogPost", BlogPostSchema);
