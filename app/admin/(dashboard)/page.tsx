import Link from "next/link";
import { ListMusic, CalendarDays, Image as ImageIcon, Inbox } from "lucide-react";
import { getClassStyles, getGalleryItems, getScheduleSlots } from "@/lib/cms";
import { getLeads } from "@/app/admin/(dashboard)/leads/data";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [classes, gallery, schedule, leads] = await Promise.all([
    getClassStyles(),
    getGalleryItems(),
    getScheduleSlots(),
    getLeads(),
  ]);

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  const cards = [
    { label: "Class Styles", value: classes.length, href: "/admin/classes", icon: ListMusic },
    { label: "Schedule Slots", value: schedule.length, href: "/admin/schedule", icon: CalendarDays },
    { label: "Gallery Items", value: gallery.length, href: "/admin/gallery", icon: ImageIcon },
    { label: "New Leads", value: newLeadsCount, href: "/admin/leads", icon: Inbox },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-white/10 bg-[#0c0c0d] p-4 rounded text-xs text-ink-muted leading-relaxed">
        Everything here reads from Supabase once connected — see README for database setup and environment variables configuration.
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-line bg-black/40 p-6 transition-colors hover:border-accent"
          >
            <card.icon size={20} className="text-accent" />
            <p className="mt-4 font-display text-3xl text-ink">{card.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
