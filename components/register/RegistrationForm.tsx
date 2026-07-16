"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import clsx from "clsx";
import { registrationFormSchema, type RegistrationFormSchema } from "@/lib/validation/registrationForm";
import { submitRegistrationForm } from "@/app/actions/submitRegistration";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-4 py-3 font-body text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none transition-colors rounded";

const labelClass = "mb-2 block font-heading text-xs font-semibold uppercase tracking-wide text-ink-muted";

interface RegistrationFormProps {
  danceStyles: string[];
  batchTimes: string[];
  packages: string[];
  paymentModes: string[];
  batchDays: string[];
}

export function RegistrationForm({
  danceStyles,
  batchTimes,
  packages,
  paymentModes,
  batchDays,
}: RegistrationFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormSchema>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      studentName: "",
      parentName: "",
      mobile: "",
      email: "",
      dob: "",
      age: 0,
      joiningDate: "",
      danceStyle: "",
      batchTime: "",
      package: "",
      paymentMode: "",
      batchDays: "",
      emergencyContact: "",
      medicalCondition: "",
      notes: "",
      agreement: false,
    },
  });

  const dobValue = watch("dob");

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (dobValue) {
      const birthDate = new Date(dobValue);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setValue("age", Math.max(0, calculatedAge), { shouldValidate: true });
      }
    }
  }, [dobValue, setValue]);

  async function onSubmit(values: RegistrationFormSchema) {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const result = await submitRegistrationForm(values);
      if (result.success) {
        // Redirect to thank you page
        router.push("/thank-you");
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("[registration-form] submission error:", err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8 bg-bg-raised/10 p-6 md:p-10 border border-white/5 rounded-lg backdrop-blur-md">
      {/* Student Information Section */}
      <div>
        <h3 className="font-display text-lg text-ink border-b border-white/10 pb-3 mb-6 uppercase tracking-wider">
          Student Information
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="studentName">Student Name *</label>
            <input
              id="studentName"
              className={inputClass}
              placeholder="Enter student name"
              {...register("studentName")}
            />
            {errors.studentName && <p className="mt-1.5 text-xs text-accent">{errors.studentName.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="parentName">Father / Mother Name *</label>
            <input
              id="parentName"
              className={inputClass}
              placeholder="Enter parent or guardian name"
              {...register("parentName")}
            />
            {errors.parentName && <p className="mt-1.5 text-xs text-accent">{errors.parentName.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="mobile">Mobile Number *</label>
            <input
              id="mobile"
              className={inputClass}
              placeholder="e.g. 9876543210"
              {...register("mobile")}
            />
            {errors.mobile && <p className="mt-1.5 text-xs text-accent">{errors.mobile.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="email">Email Address (Optional)</label>
            <input
              id="email"
              type="email"
              className={inputClass}
              placeholder="your@email.com"
              {...register("email")}
            />
            {errors.email && <p className="mt-1.5 text-xs text-accent">{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="dob">Date of Birth *</label>
            <input
              id="dob"
              type="date"
              className={inputClass}
              {...register("dob")}
            />
            {errors.dob && <p className="mt-1.5 text-xs text-accent">{errors.dob.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="age">Age (Auto Calculated)</label>
            <input
              id="age"
              type="number"
              readOnly
              className={clsx(inputClass, "bg-white/5 text-ink-muted cursor-not-allowed")}
              {...register("age")}
            />
            {errors.age && <p className="mt-1.5 text-xs text-accent">{errors.age.message}</p>}
          </div>
        </div>
      </div>

      {/* Joining Information Section */}
      <div>
        <h3 className="font-display text-lg text-ink border-b border-white/10 pb-3 mb-6 uppercase tracking-wider">
          Joining & Class Selection
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="joiningDate">Joining Date *</label>
            <input
              id="joiningDate"
              type="date"
              className={inputClass}
              {...register("joiningDate")}
            />
            {errors.joiningDate && <p className="mt-1.5 text-xs text-accent">{errors.joiningDate.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="danceStyle">Dance Style *</label>
            <select id="danceStyle" className={inputClass} {...register("danceStyle")}>
              <option value="">Select dance style</option>
              {danceStyles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
            {errors.danceStyle && <p className="mt-1.5 text-xs text-accent">{errors.danceStyle.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="batchTime">Batch Time *</label>
            <select id="batchTime" className={inputClass} {...register("batchTime")}>
              <option value="">Select batch time</option>
              {batchTimes.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.batchTime && <p className="mt-1.5 text-xs text-accent">{errors.batchTime.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="package">Package Plan *</label>
            <select id="package" className={inputClass} {...register("package")}>
              <option value="">Select plan package</option>
              {packages.map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
            {errors.package && <p className="mt-1.5 text-xs text-accent">{errors.package.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="batchDays">Batch Days *</label>
            <select id="batchDays" className={inputClass} {...register("batchDays")}>
              <option value="">Select batch days</option>
              {batchDays.map((dayOption) => (
                <option key={dayOption} value={dayOption}>{dayOption}</option>
              ))}
            </select>
            {errors.batchDays && <p className="mt-1.5 text-xs text-accent">{errors.batchDays.message}</p>}
          </div>
        </div>
      </div>

      {/* Payment Mode Section */}
      <div>
        <h3 className="font-display text-lg text-ink border-b border-white/10 pb-3 mb-6 uppercase tracking-wider">
          Payment Mode *
        </h3>
        <div className="flex flex-wrap gap-6 items-center">
          {paymentModes.map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer text-sm font-semibold tracking-wide text-ink hover:text-accent select-none">
              <input
                type="radio"
                value={mode}
                className="h-4 w-4 accent-accent cursor-pointer"
                {...register("paymentMode")}
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
        {errors.paymentMode && <p className="mt-2.5 text-xs text-accent">{errors.paymentMode.message}</p>}
      </div>

      {/* Optional Information Section */}
      <div>
        <h3 className="font-display text-lg text-ink border-b border-white/10 pb-3 mb-6 uppercase tracking-wider">
          Optional Details
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className={labelClass} htmlFor="emergencyContact">Emergency Contact (Name & Number)</label>
            <input
              id="emergencyContact"
              className={inputClass}
              placeholder="e.g. Jane Doe - 9876543211"
              {...register("emergencyContact")}
            />
            {errors.emergencyContact && <p className="mt-1.5 text-xs text-accent">{errors.emergencyContact.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="medicalCondition">Medical Conditions (if any)</label>
            <input
              id="medicalCondition"
              className={inputClass}
              placeholder="Allergies, injuries, heart conditions, etc."
              {...register("medicalCondition")}
            />
            {errors.medicalCondition && <p className="mt-1.5 text-xs text-accent">{errors.medicalCondition.message}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="notes">Notes / Special Instructions</label>
            <textarea
              id="notes"
              rows={4}
              className={inputClass}
              placeholder="Any other comments or instructions for our staff..."
              {...register("notes")}
            />
            {errors.notes && <p className="mt-1.5 text-xs text-accent">{errors.notes.message}</p>}
          </div>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="pt-4 border-t border-white/10">
        <label className="flex items-start gap-3 cursor-pointer text-sm leading-relaxed text-ink-muted hover:text-ink select-none">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-accent cursor-pointer rounded shrink-0"
            {...register("agreement")}
          />
          <span>
            I understand that fees once paid are non-refundable. *
          </span>
        </label>
        {errors.agreement && <p className="mt-2 text-xs text-accent">{errors.agreement.message}</p>}
      </div>

      {/* Error Output */}
      {status === "error" && errorMessage && (
        <div className="p-4 border border-accent/30 bg-accent/5 text-sm text-accent rounded">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          "w-full py-4 text-sm font-heading font-bold uppercase tracking-wider transition-all rounded shadow-md flex items-center justify-center gap-3",
          status === "submitting"
            ? "bg-accent/50 text-white/70 cursor-not-allowed"
            : "bg-accent hover:bg-accent-raised text-white"
        )}
      >
        {status === "submitting" && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span>{status === "submitting" ? "Registering..." : "REGISTER NOW"}</span>
      </motion.button>
    </form>
  );
}
