"use client";

import { useState, useTransition } from "react";
import {
  Home,
  GraduationCap,
  Calendar,
  User,
  Image as ImageIcon,
  Phone,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import type { PageHeroConfig } from "@/lib/types";
import { CloudinaryUploadField } from "./CloudinaryUploadField";
import { savePageHero } from "@/app/admin/(dashboard)/hero/actions";

const PAGES = [
  { key: "home", label: "Home", icon: Home },
  { key: "classes", label: "Classes", icon: GraduationCap },
  { key: "schedule", label: "Schedule", icon: Calendar },
  { key: "about", label: "About", icon: User },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "contact", label: "Contact", icon: Phone },
];

const inputClass =
  "w-full border border-white/10 bg-[#0f0f11] px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none transition-all placeholder:text-white/20";
const selectClass =
  "w-full border border-white/10 bg-[#0f0f11] px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none transition-all";

export function HeroManagementEditor({ initialHeroes }: { initialHeroes: PageHeroConfig[] }) {
  const [heroes, setHeroes] = useState<Record<string, PageHeroConfig>>(() => {
    const map: Record<string, PageHeroConfig> = {};
    initialHeroes.forEach((h) => {
      map[h.pageKey] = h;
    });
    return map;
  });

  const [activeTab, setActiveTab] = useState<string>("home");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [sections, setSections] = useState<Record<string, boolean>>({
    content: true,
    buttons: false,
    desktopMedia: false,
    mobileMedia: false,
    layout: false,
    visual: false,
    animation: false,
  });

  function toggleSection(sec: string) {
    setSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  }

  const currentHero = heroes[activeTab];

  function handleChange(field: keyof PageHeroConfig, val: string | number | boolean) {
    if (!currentHero) return;
    setHeroes((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab]!,
        [field]: val,
      },
    }));
  }

  function handleSave() {
    if (!currentHero) return;
    startTransition(async () => {
      const res = await savePageHero(activeTab, currentHero);
      if (res.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
        setErrorMsg(res.error ?? "Failed to save.");
        setTimeout(() => setStatus("idle"), 5000);
      }
    });
  }

  if (!currentHero) return null;

  return (
    <div className="flex flex-col gap-8 md:flex-row items-start">
      <div className="w-full shrink-0 border border-white/10 bg-[#0c0c0d] p-4 md:w-64">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-muted px-2">Select Page</h3>
        <nav className="flex flex-col gap-1">
          {PAGES.map((p) => {
            const Icon = p.icon;
            const active = activeTab === p.key;
            return (
              <button
                key={p.key}
                onClick={() => {
                  setActiveTab(p.key);
                  setSections({
                    content: true,
                    buttons: false,
                    desktopMedia: false,
                    mobileMedia: false,
                    layout: false,
                    visual: false,
                    animation: false,
                  });
                }}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-left transition-all",
                  active
                    ? "bg-accent/10 text-accent border-l-2 border-accent pl-2.5"
                    : "text-ink-muted hover:bg-white/5 hover:text-ink pl-3"
                )}
              >
                <Icon size={14} className={clsx(active ? "text-accent" : "text-ink-muted")} />
                {p.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 w-full flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-ink">
              {PAGES.find((p) => p.key === activeTab)?.label} Hero Configuration
            </h2>
            <p className="text-xs text-ink-muted mt-0.5 font-medium uppercase tracking-wider">Configure unique content, backgrounds, layouts and buttons.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={pending}
            className="btn-solid flex items-center gap-2 !px-5 !py-2 text-xs font-semibold disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={14} /> Save Changes
              </>
            )}
          </button>
        </div>

        {status === "saved" && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 text-xs font-mono rounded">
            Success! Changes published successfully.
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 text-xs font-mono rounded">
            Error: {errorMsg}
          </div>
        )}

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("content")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Content</span>
            {sections.content ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.content && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Eyebrow Text</label>
                <input
                  type="text"
                  value={currentHero.eyebrow}
                  onChange={(e) => handleChange("eyebrow", e.target.value)}
                  placeholder="e.g. MORE THAN A STUDIO —"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Title Line 1</label>
                  <input
                    type="text"
                    value={currentHero.titleLine1}
                    onChange={(e) => handleChange("titleLine1", e.target.value)}
                    placeholder="e.g. FIND YOUR"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Title Line 2 (Accent Color)</label>
                  <input
                    type="text"
                    value={currentHero.titleLine2}
                    onChange={(e) => handleChange("titleLine2", e.target.value)}
                    placeholder="e.g. STYLE"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Description Copy</label>
                <textarea
                  rows={3}
                  value={currentHero.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter short description explaining page details..."
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("buttons")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Buttons</span>
            {sections.buttons ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.buttons && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-white/5 pb-4">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Primary Button Text</label>
                  <input
                    type="text"
                    value={currentHero.primaryButtonText}
                    onChange={(e) => handleChange("primaryButtonText", e.target.value)}
                    placeholder="e.g. Book Trial"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Primary Button URL</label>
                  <input
                    type="text"
                    value={currentHero.primaryButtonUrl}
                    onChange={(e) => handleChange("primaryButtonUrl", e.target.value)}
                    placeholder="e.g. /contact"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Secondary Button Text</label>
                  <input
                    type="text"
                    value={currentHero.secondaryButtonText}
                    onChange={(e) => handleChange("secondaryButtonText", e.target.value)}
                    placeholder="e.g. View Timetable"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Secondary Button URL</label>
                  <input
                    type="text"
                    value={currentHero.secondaryButtonUrl}
                    onChange={(e) => handleChange("secondaryButtonUrl", e.target.value)}
                    placeholder="e.g. /schedule"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("desktopMedia")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Desktop Background</span>
            {sections.desktopMedia ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.desktopMedia && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-5">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Desktop Image</label>
                <CloudinaryUploadField
                  value={currentHero.desktopImageUrl}
                  onChange={(url) => handleChange("desktopImageUrl", url)}
                  accept="image/*"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Desktop Video</label>
                  <CloudinaryUploadField
                    value={currentHero.desktopVideoUrl}
                    onChange={(url) => handleChange("desktopVideoUrl", url)}
                    accept="video/*"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Desktop Video Poster</label>
                  <CloudinaryUploadField
                    value={currentHero.desktopVideoPoster}
                    onChange={(url) => handleChange("desktopVideoPoster", url)}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("mobileMedia")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Mobile Background</span>
            {sections.mobileMedia ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.mobileMedia && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-5">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Mobile Image</label>
                <CloudinaryUploadField
                  value={currentHero.mobileImageUrl}
                  onChange={(url) => handleChange("mobileImageUrl", url)}
                  accept="image/*"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Mobile Video</label>
                  <CloudinaryUploadField
                    value={currentHero.mobileVideoUrl}
                    onChange={(url) => handleChange("mobileVideoUrl", url)}
                    accept="video/*"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Mobile Video Poster</label>
                  <CloudinaryUploadField
                    value={currentHero.mobileVideoPoster}
                    onChange={(url) => handleChange("mobileVideoPoster", url)}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("layout")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Layout</span>
            {sections.layout ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.layout && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Hero Height</label>
                <input
                  type="text"
                  value={currentHero.heroHeight}
                  onChange={(e) => handleChange("heroHeight", e.target.value)}
                  placeholder="e.g. min-h-[70vh] or min-h-screen"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Content Width</label>
                <select
                  value={currentHero.contentWidth}
                  onChange={(e) => handleChange("contentWidth", e.target.value)}
                  className={selectClass}
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Full">Full</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Desktop Alignment</label>
                <select
                  value={currentHero.desktopAlignment}
                  onChange={(e) => handleChange("desktopAlignment", e.target.value)}
                  className={selectClass}
                >
                  <option value="Left">Left</option>
                  <option value="Center">Center</option>
                  <option value="Right">Right</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Mobile Alignment</label>
                <select
                  value={currentHero.mobileAlignment}
                  onChange={(e) => handleChange("mobileAlignment", e.target.value)}
                  className={selectClass}
                >
                  <option value="Left">Left</option>
                  <option value="Center">Center</option>
                  <option value="Right">Right</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Vertical Alignment</label>
                <select
                  value={currentHero.verticalAlignment}
                  onChange={(e) => handleChange("verticalAlignment", e.target.value)}
                  className={selectClass}
                >
                  <option value="Top">Top</option>
                  <option value="Center">Center</option>
                  <option value="Bottom">Bottom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("visual")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Visual Effects</span>
            {sections.visual ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.visual && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Overlay Color</label>
                <input
                  type="text"
                  value={currentHero.overlayColor}
                  onChange={(e) => handleChange("overlayColor", e.target.value)}
                  placeholder="e.g. #000000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Overlay Opacity</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={currentHero.overlayOpacity}
                  onChange={(e) => handleChange("overlayOpacity", Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Gradient</label>
                <select
                  value={currentHero.gradientType}
                  onChange={(e) => handleChange("gradientType", e.target.value)}
                  className={selectClass}
                >
                  <option value="None">None</option>
                  <option value="Solid">Solid</option>
                  <option value="Linear">Linear</option>
                  <option value="Radial">Radial</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Background Position</label>
                <input
                  type="text"
                  value={currentHero.backgroundPosition}
                  onChange={(e) => handleChange("backgroundPosition", e.target.value)}
                  placeholder="e.g. center, top"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#0c0c0d]">
          <button
            onClick={() => toggleSection("animation")}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-heading text-xs font-bold uppercase tracking-wider text-ink hover:bg-white/5 transition-all"
          >
            <span>Animation</span>
            {sections.animation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sections.animation && (
            <div className="border-t border-white/10 p-5 grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-faint font-semibold">Reveal Animation</label>
                <select
                  value={currentHero.revealAnimation}
                  onChange={(e) => handleChange("revealAnimation", e.target.value)}
                  className={selectClass}
                >
                  <option value="None">None</option>
                  <option value="Fade">Fade</option>
                  <option value="Slide Up">Slide Up</option>
                  <option value="Slide Left">Slide Left</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Reveal">Reveal</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="show_scroll"
                  checked={currentHero.showScrollIndicator}
                  onChange={(e) => handleChange("showScrollIndicator", e.target.checked)}
                  className="h-4 w-4 rounded accent-accent"
                />
                <label htmlFor="show_scroll" className="text-xs uppercase tracking-wide text-ink-muted select-none cursor-pointer font-semibold">
                  Show Scroll Indicator
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
