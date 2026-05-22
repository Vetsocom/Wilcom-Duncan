import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: optionalText,
  organization: optionalText,
  inquiryType: z.string().trim().min(1, "Select an inquiry type."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
  website: optionalText,
});

export type ContactInput = z.infer<typeof contactSchema>;
