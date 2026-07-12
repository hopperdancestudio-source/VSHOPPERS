import type { MarqueeTag } from "@/lib/types";

export function MarqueeStrip({ tags }: { tags: MarqueeTag[] }) {
  if (!tags || tags.length === 0) return null;

  // Ensure we have enough items to span screen width on large viewports (min 20 items)
  const minItems = 20;
  const repeatFactor = Math.ceil(minItems / tags.length);
  
  const singleTrack: MarqueeTag[] = [];
  for (let i = 0; i < repeatFactor; i++) {
    singleTrack.push(...tags);
  }

  // Duplicate the entire track so translation by -50% is seamless.
  const loop = [...singleTrack, ...singleTrack];

  return (
    <div className="overflow-hidden bg-accent py-4 select-none">
      <div className="flex w-max animate-marquee">
        {loop.map((tag, i) => (
          <span
            key={`${tag.id}-${i}`}
            className="mx-4 font-display text-2xl text-black whitespace-nowrap uppercase"
          >
            {tag.label}
            <span className="ml-8 inline-block select-none">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
