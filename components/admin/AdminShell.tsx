"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Video,
  ListMusic,
  CalendarDays,
  Image as ImageIcon,
  Users,
  HelpCircle,
  Inbox,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero & Home", icon: Video },
  { href: "/admin/classes", label: "Classes & Batches", icon: ListMusic },
  { href: "/admin/schedule", label: "Schedule & Plans", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/about", label: "About", icon: Users },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/settings", label: "Settings & SEO", icon: Settings },
];

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/admin": {
    title: "Dashboard",
    description: "Overview of key metrics, leads intake, and quick links.",
  },
  "/admin/hero": {
    title: "Hero & Home",
    description: "Manage hero section messaging, main call-to-actions, and scrolling tags.",
  },
  "/admin/classes": {
    title: "Classes & Batches",
    description: "Configure studio class style rows, levels, descriptions, and age groups.",
  },
  "/admin/schedule": {
    title: "Schedule & Plans",
    description: "Update the weekly timetable, category filters, and pricing options.",
  },
  "/admin/gallery": {
    title: "Gallery",
    description: "Upload studio photography and categorize portfolio media.",
  },
  "/admin/about": {
    title: "About",
    description: "Edit founder bio, counter stats, and company timeline milestones.",
  },
  "/admin/faqs": {
    title: "FAQs",
    description: "Add, edit, or delete customer accordion questions and answers.",
  },
  "/admin/leads": {
    title: "Leads",
    description: "Review and organize customer registrations for free trial classes.",
  },
  "/admin/settings": {
    title: "Settings & SEO",
    description: "Manage global studio metadata, contact lines, address, and social links.",
  },
};

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const meta = PAGE_META[pathname] || {
    title: "Content Management System",
    description: "Manage your site settings, pages, and integrations.",
  };

  return (
    <div className="flex min-h-screen bg-[#070708] text-ink font-body">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0c0c0d] flex flex-col md:flex">
        {/* Branding */}
        <div className="flex h-20 flex-col justify-center border-b border-white/10 px-6 gap-0.5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-accent rounded-sm shrink-0" />
            <span className="font-heading text-base font-bold uppercase tracking-wider text-ink">STUDIO ADMIN</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-ink-muted">Content Management</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded transition-all duration-150 text-xs font-semibold uppercase tracking-wider",
                  active
                    ? "bg-accent/10 text-accent border-l-2 border-accent pl-2.5"
                    : "text-ink-muted hover:bg-white/5 hover:text-ink pl-3"
                )}
              >
                <item.icon size={15} className={clsx("shrink-0", active ? "text-accent" : "text-ink-muted")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#0c0c0d]/40 backdrop-blur px-6 md:px-10">
          <div className="flex flex-col min-w-0 pr-4">
            <h1 className="font-heading text-base font-bold uppercase tracking-wider text-ink truncate md:text-lg">
              {meta.title}
            </h1>
            <p className="text-[11px] text-ink-muted truncate hidden sm:block">
              {meta.description}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {/* User status */}
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-ink-muted uppercase tracking-wider font-semibold">Logged in as</span>
                <span className="text-xs font-mono text-ink font-medium">{userEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Online</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 border border-white/10 hover:border-accent hover:bg-accent/5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-all duration-150"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
