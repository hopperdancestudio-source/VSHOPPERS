import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "Thank You — Registration Submitted",
  description: "Your registration has been successfully submitted.",
};

export default function ThankYouPage() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-bg py-20">
      <div className="container-base max-w-xl text-center flex flex-col items-center">
        <Reveal>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-8 mx-auto">
            <CheckCircle size={40} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="font-display text-4xl text-ink uppercase tracking-wide md:text-5xl leading-tight">
            Registration Submitted <span className="text-accent">Successfully</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-base md:text-lg text-ink-muted leading-relaxed font-body">
            Thank you for enrolling at VS Hoppers Dance Studio. Our team will contact you shortly to confirm your admission details, batch timings, and next steps.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/" className="btn-solid px-8 py-3 text-sm font-heading font-bold uppercase tracking-wider text-center">
            Return Home
          </Link>
          <Link href="/classes" className="btn border border-white/20 hover:border-accent text-ink hover:text-accent px-8 py-3 text-sm font-heading font-bold uppercase tracking-wider text-center transition-all rounded">
            View Classes
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
