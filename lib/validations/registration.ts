import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: optionalText,
  whatsapp: optionalText,
  organization: optionalText,
  role: optionalText,
  bootcampTitle: optionalText,
  bootcampSlug: optionalText,
  activityTitle: optionalText,
  activityId: optionalText,
  source: z.enum(["bootcamp", "calendar", "project-event", "general"]).default("general"),
  reason: optionalText,
  website: optionalText,
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
