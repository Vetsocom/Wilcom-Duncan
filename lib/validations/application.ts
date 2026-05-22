import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: optionalText,
  organization: optionalText,
  role: optionalText,
  activityTitle: optionalText,
  activityId: optionalText,
  activityType: optionalText,
  reason: z.string().trim().min(10, "Reason for interest must be at least 10 characters."),
  source: z.enum(["calendar", "bootcamp", "event", "general"]).default("general"),
  website: optionalText,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
