import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const ContactInquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    organization: { type: String, trim: true },
    inquiryType: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["contact"],
      default: "contact",
    },
  },
  { timestamps: true }
);

export type ContactInquiryDocument = InferSchemaType<typeof ContactInquirySchema>;

const ContactInquiry =
  models.ContactInquiry || model("ContactInquiry", ContactInquirySchema);

export { ContactInquiry };
export default ContactInquiry;
