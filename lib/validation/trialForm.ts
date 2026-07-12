import { z } from "zod";

export const trialFormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  classInterest: z.string().min(1, "Please select a class style"),
  ageGroup: z.string().min(1, "Please select an age group"),
  preferredDays: z.array(z.string()).min(1, "Select at least one preferred day"),
  message: z.string().max(500).optional(),
});

export type TrialFormSchema = z.infer<typeof trialFormSchema>;

export const AGE_GROUP_OPTIONS = ["KIDS (5–12)", "TEENS (13–18)", "ADULTS (18+)"];

export const PREFERRED_DAY_OPTIONS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
