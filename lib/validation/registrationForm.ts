import { z } from "zod";

export const registrationFormSchema = z.object({
  studentName: z.string().min(2, "Student Name must be at least 2 characters"),
  parentName: z.string().min(2, "Father / Mother Name must be at least 2 characters"),
  mobile: z
    .string()
    .min(7, "Please enter a valid mobile number")
    .max(20, "Please enter a valid mobile number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  dob: z.string().min(1, "Date of Birth is required"),
  age: z.coerce.number().min(0, "Age must be a valid number"),
  joiningDate: z.string().min(1, "Joining Date is required"),
  danceStyle: z.string().min(1, "Please select a dance style"),
  batchTime: z.string().min(1, "Please select a batch time"),
  package: z.string().min(1, "Please select a package"),
  paymentMode: z.string().min(1, "Please select a payment mode"),
  batchDays: z.string().min(1, "Please select batch days"),
  emergencyContact: z.string().optional().or(z.literal("")),
  medicalCondition: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms to submit.",
  }),
});

export type RegistrationFormSchema = z.infer<typeof registrationFormSchema>;
