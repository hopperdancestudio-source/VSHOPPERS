import Link from "next/link";
import { ListMusic, CalendarDays, Image as ImageIcon, Inbox, Star, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { getClassStyles, getGalleryItems, getScheduleSlots } from "@/lib/cms";
import { getLeads } from "@/app/admin/(dashboard)/leads/data";
import { getRegistrations } from "@/app/admin/(dashboard)/registrations/data";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [classes, gallery, schedule, leads, registrations] = await Promise.all([
    getClassStyles(),
    getGalleryItems(),
    getScheduleSlots(),
    getLeads(),
    getRegistrations(),
  ]);

  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const unreadRegistrations = registrations.filter((r) => !r.viewed).length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRegistrationsCount = registrations.filter((r) => {
    const rDate = new Date(r.createdAt).toISOString().split("T")[0];
    return rDate === todayStr;
  }).length;

  const pendingRegistrationsCount = registrations.filter((r) => r.status === "Pending").length;
  const confirmedRegistrationsCount = registrations.filter((r) => r.status === "Confirmed" || r.status === "Active").length;
  const cancelledRegistrationsCount = registrations.filter((r) => r.status === "Cancelled").length;

  const cards = [
    { label: "Class Styles", value: String(classes.length), href: "/admin/classes", icon: ListMusic },
    { label: "Schedule Slots", value: String(schedule.length), href: "/admin/schedule", icon: CalendarDays },
    { label: "Gallery Items", value: String(gallery.length), href: "/admin/gallery", icon: ImageIcon },
    { label: "New Leads", value: String(newLeadsCount), href: "/admin/leads", icon: Inbox },
    {
      label: "Student Registrations",
      value: unreadRegistrations > 0 ? `${registrations.length} (+${unreadRegistrations} New)` : String(registrations.length),
      href: "/admin/registrations",
      icon: Star,
    },
  ];

  const registrationStats = [
    { label: "Total Registrations", value: registrations.length, icon: Star, color: "text-ink" },
    { label: "Today's Registrations", value: todayRegistrationsCount, icon: CalendarDays, color: "text-accent" },
    { label: "Pending", value: pendingRegistrationsCount, icon: Clock, color: "text-yellow-500" },
    { label: "Confirmed / Active", value: confirmedRegistrationsCount, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Cancelled", value: cancelledRegistrationsCount, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {unreadRegistrations > 0 && (
        <Link href="/admin/registrations" className="flex items-center gap-3 border border-accent/40 bg-accent/10 px-4 py-3 rounded text-xs text-ink font-semibold animate-pulse hover:bg-accent/15 transition-colors">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>🔴 New Registration — {unreadRegistrations} unread student registration(s) received. Click to review.</span>
        </Link>
      )}

      <div className="border border-white/10 bg-[#0c0c0d] p-4 rounded text-xs text-ink-muted leading-relaxed">
        Everything here reads from Supabase once connected — see README for database setup and environment variables configuration.
      </div>

      {/* Main Stats Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-line bg-black/40 p-6 transition-colors hover:border-accent flex flex-col justify-between"
          >
            <div>
              <card.icon size={20} className="text-accent" />
              <p className="mt-4 font-display text-2xl text-ink font-bold">{card.value}</p>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-ink-muted font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Detailed Registrations Statistics Dashboard Section */}
      <div className="mt-8">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">
          Student Registration Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {registrationStats.map((stat) => (
            <div
              key={stat.label}
              className="border border-white/5 bg-bg-raised/20 p-5 rounded flex flex-col gap-1"
            >
              <stat.icon size={16} className={stat.color} />
              <p className="font-display text-2xl text-ink font-bold mt-2">{stat.value}</p>
              <p className="text-[9px] uppercase tracking-wider text-ink-faint font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
