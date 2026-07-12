import { Camera } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function InstagramCTA({ url }: { url: string }) {
  if (!url) return null;

  return (
    <section className="border-y border-line bg-bg">
      <Reveal className="container-base flex flex-col items-start justify-between gap-4 py-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center border border-accent text-accent">
            <Camera size={20} />
          </span>
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Follow the Crew
            </p>
            <p className="text-xs text-accent">INSTAGRAM</p>
          </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-outline-accent">
          Follow on Insta
        </a>
      </Reveal>
    </section>
  );
}
