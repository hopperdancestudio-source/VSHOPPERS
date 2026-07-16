"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Star,
  Menu,
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
  { href: "/admin/registrations", label: "Registrations", icon: Star },
  { href: "/admin/settings", label: "Settings & SEO", icon: Settings },
];

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/admin": {
    title: "Dashboard",
    description: "Welcome to VS Hoppers Admin Portal.",
  },
  "/admin/hero": {
    title: "Hero & Home Page Config",
    description: "Edit hero video background, banners, and home sections.",
  },
  "/admin/classes": {
    title: "Classes & Batches",
    description: "Create and update dance style descriptions and batch details.",
  },
  "/admin/schedule": {
    title: "Schedules & Pricing Plans",
    description: "Manage weekly class schedule timings and pricing memberships.",
  },
  "/admin/gallery": {
    title: "Gallery Assets",
    description: "Manage performance and class images displayed on the website.",
  },
  "/admin/about": {
    title: "About Studio Details",
    description: "Update founder profile biography, journey milestones, values, and staff.",
  },
  "/admin/faqs": {
    title: "Frequently Asked Questions",
    description: "Manage list of FAQs shown on public page queries.",
  },
  "/admin/leads": {
    title: "Leads",
    description: "Review and organize customer registrations for free trial classes.",
  },
  "/admin/registrations": {
    title: "Registrations",
    description: "Review and manage paid student admissions, payment status, plans, and history.",
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

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

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      const supabase = createClient();
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("viewed", false)
        .is("deleted_at", null);
      if (!error && count !== null) {
        setUnreadCount(count);
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const sidebarContent = (
    <>
      {/* Branding */}
      <div className="flex h-20 flex-col justify-center border-b border-white/10 px-6 gap-0.5 shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="VS Logo"
            width={20}
            height={20}
            className="h-5 w-auto object-contain shrink-0"
          />
          <span className="font-heading text-base font-bold uppercase tracking-wider text-ink">STUDIO ADMIN</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-ink-muted">Content Management</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href === "/admin/registrations" && pathname.startsWith("/admin/registrations/"));
          const hasBadge = item.href === "/admin/registrations" && unreadCount > 0;
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
              <span className="flex-1">{item.label}</span>
              {hasBadge && (
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" title={`${unreadCount} unread`} />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#070708] text-ink font-body">
      {/* 1. Permanent Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-[#0c0c0d] flex-col">
        {sidebarContent}
      </aside>

      {/* 2. Responsive Mobile Drawer Sidebar */}
      {/* Backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#0c0c0d] flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#0c0c0d]/40 backdrop-blur px-6 lg:px-10">
          <div className="flex items-center gap-4 min-w-0 pr-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-ink-muted hover:text-accent p-1.5 border border-white/10 hover:border-accent/40 rounded transition-all shrink-0 bg-white/5"
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="lg:hidden font-heading text-[10px] font-bold uppercase tracking-wider text-accent/80 shrink-0 bg-accent/10 px-1.5 py-0.5 rounded border border-accent/25">STUDIO ADMIN</span>
                <h1 className="font-heading text-base font-bold uppercase tracking-wider text-ink truncate md:text-lg">
                  {meta.title}
                </h1>
              </div>
              <p className="text-[11px] text-ink-muted truncate hidden sm:block">
                {meta.description}
              </p>
            </div>
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
