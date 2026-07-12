"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  AGE_GROUP_OPTIONS,
  PREFERRED_DAY_OPTIONS,
  trialFormSchema,
  type TrialFormSchema,
} from "@/lib/validation/trialForm";
import { submitTrialForm } from "@/app/actions/submitTrial";
import { Reveal } from "@/components/ui/Reveal";
import type { ClassStyle } from "@/lib/types";

const inputClass =
  "w-full border border-white/15 bg-bg-raised px-4 py-3 font-body text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none transition-colors";

const labelClass = "mb-2 block font-heading text-xs font-semibold uppercase tracking-wide text-ink-muted";

export function TrialForm({ classStyles }: { classStyles: ClassStyle[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TrialFormSchema>({
    resolver: zodResolver(trialFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      classInterest: "",
      ageGroup: "",
      preferredDays: [],
      message: "",
    },
  });

  async function onSubmit(values: TrialFormSchema) {
    setStatus("submitting");
    setErrorMessage(null);
    const result = await submitTrialForm(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <Reveal className="border border-accent/40 bg-accent/10 px-8 py-12 text-center">
        <h3 className="font-display text-2xl text-ink">Request Received</h3>
        <p className="mt-3 font-body text-sm text-ink-muted">
          Placeholder confirmation copy — we&apos;ll be in touch to schedule your free trial.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-outline-accent mt-6">
          Submit Another
        </button>
      </Reveal>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">Full Name</label>
          <input id="fullName" className={inputClass} placeholder="Enter name" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-accent">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone Number</label>
          <input id="phone" className={inputClass} placeholder="555-0100" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="email">Email Address</label>
        <input id="email" type="email" className={inputClass} placeholder="your@email.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="classInterest">Class Style</label>
          <select id="classInterest" className={inputClass} {...register("classInterest")}>
            <option value="">Select a class</option>
            {classStyles.map((opt) => (
              <option key={opt.id} value={opt.name}>{opt.name}</option>
            ))}
          </select>
          {errors.classInterest && <p className="mt-1 text-xs text-accent">{errors.classInterest.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="ageGroup">Age Group</label>
          <select id="ageGroup" className={inputClass} {...register("ageGroup")}>
            <option value="">Select age group</option>
            {AGE_GROUP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.ageGroup && <p className="mt-1 text-xs text-accent">{errors.ageGroup.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Preferred Day</label>
        <Controller
          control={control}
          name="preferredDays"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {PREFERRED_DAY_OPTIONS.map((day) => {
                const active = field.value.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      field.onChange(
                        active ? field.value.filter((d) => d !== day) : [...field.value, day]
                      )
                    }
                    className={clsx(
                      "border px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide transition-colors",
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-white/15 text-ink-muted hover:border-white/40"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.preferredDays && <p className="mt-1 text-xs text-accent">{errors.preferredDays.message}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="message">Message (Optional)</label>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          placeholder="Any specific goals or questions?"
          {...register("message")}
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-accent">{errorMessage}</p>
      )}

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileTap={{ scale: 0.98 }}
        className="btn-solid w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Book My Free Trial"}
      </motion.button>
    </form>
  );
}
