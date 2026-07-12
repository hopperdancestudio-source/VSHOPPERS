import { GalleryItem } from "@/components/gallery/GalleryItem";
import { Reveal } from "@/components/ui/Reveal";

export function FounderIntro({
  founderName,
  bio,
  photoUrl,
  secondaryImageUrl,
}: {
  founderName: string;
  bio: string;
  photoUrl: string;
  secondaryImageUrl?: string | null;
}) {
  return (
    <section className="bg-bg py-section-y-sm md:py-section-y">
      <div className="container-base grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <Reveal className="group relative aspect-[4/3] w-full bg-bg-raised overflow-hidden">
          <GalleryItem
            mediaUrl={photoUrl}
            mediaType="image"
            hoverImageUrl={secondaryImageUrl}
            title={founderName}
            grayscale={false}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3">The Founder</p>
          <h2 className="font-display text-display-md text-ink">Meet {founderName}</h2>
          <p className="mt-4 max-w-md font-body text-base leading-relaxed text-ink-muted">
            {bio}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
