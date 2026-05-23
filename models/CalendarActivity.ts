import { Schema, models, model, type InferSchemaType } from "mongoose";

const CalendarActivitySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, default: "", trim: true },
    time: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    type: { type: String, default: "training", trim: true },
    description: { type: String, default: "" },
    link: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    applicationOpen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type CalendarActivityDocument = InferSchemaType<typeof CalendarActivitySchema>;

export const CalendarActivity =
  models.CalendarActivity || model("CalendarActivity", CalendarActivitySchema);
