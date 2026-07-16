"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import type { SiteSettings } from "@/lib/types";
import { navLinks } from "@/data/placeholder";

export function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 h-nav-h transition-colors duration-300 ease-reveal",
        scrolled || mobileOpen ? "bg-black" : "bg-black/0 backdrop-blur-0"
      )}
    >
      <div className="container-base flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="VS Logo"
            width={28}
            height={28}
            className="h-7 w-auto object-contain shrink-0"
            priority
          />
          <span className="font-display text-xl tracking-wide text-ink">
            {settings.studioName.toUpperCase()}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "font-heading text-sm font-semibold uppercase tracking-wider transition-colors duration-200",
                  active ? "text-accent" : "text-ink hover:text-accent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/register" className="hidden md:inline-flex">
          <span className="btn-nav">REGISTER NOW</span>
        </Link>

        <button
          className="text-ink md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.nav
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden bg-black md:hidden"
      >
        <div className="container-base flex flex-col gap-6 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-lg font-semibold uppercase tracking-wider text-ink hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/register" className="btn-nav w-full">
            REGISTER NOW
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}
