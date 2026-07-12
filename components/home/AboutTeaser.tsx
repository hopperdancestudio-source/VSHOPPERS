import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function AboutTeaser({
  eyebrow,
  headlineLine1,
  headlineLine2,
  photoUrl,
  founderName,
}: {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  photoUrl: string;
  founderName: string;
}) {
  return (
    <section className="bg-bg py-section-y-sm md:py-section-y">
      <div className="container-base grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <Reveal className="relative aspect-[4/3] w-full bg-bg-raised overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={founderName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center text-neutral-700 text-xs">No Photo</div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="font-display text-display-lg text-ink">
            {headlineLine1}
            <br />
            <span className="text-accent">{headlineLine2}</span>
          </h2>
          <Link href="/about" className="btn-outline mt-8 inline-flex">
            Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
