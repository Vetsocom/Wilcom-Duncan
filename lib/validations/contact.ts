import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const requiredText = (message: string, min = 1) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(min, message)
  );

export const contactSchema = z.object({
  fullName: requiredText("Full name must be at least 2 characters.", 2),
  email: requiredText("Enter a valid email address.").pipe(
    z.string().email("Enter a valid email address.")
  ),
  phone: optionalText,
  organization: optionalText,
  inquiryType: requiredText("Select an inquiry type."),
  message: requiredText("Message must be at least 10 characters.", 10),
  website: optionalText,
});

export type ContactInput = z.infer<typeof contactSchema>;
