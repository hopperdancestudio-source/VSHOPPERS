import "server-only";
import * as placeholder from "@/data/placeholder";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type {
  AgeBatch,
  ClassStyle,
  CoreValue,
  FaqItem,
  GalleryCategory,
  GalleryItem,
  HeroContent,
  HeroStat,
  JourneyMilestone,
  MarqueeTag,
  MembershipPlan,
  NavLink,
  ScheduleSlot,
  SiteSettings,
  StudioHours,
  Testimonial,
  TrustBadge,
  PageHeroConfig,
} from "@/lib/types";

/**
 * Data-access layer.
 *
 * Every function tries Supabase first (when NEXT_PUBLIC_SUPABASE_URL is set) and
 * falls back to the local placeholder data otherwise — so the app renders
 * identically in local dev without any env vars, and automatically switches to
 * live content once Supabase is connected and seeded. No consuming component
 * ever needs to change.
 */

const supabaseConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

let publicSupabase: ReturnType<typeof createSupabaseClient> | null = null;

function getPublicClient() {
  if (!supabaseConfigured()) return null;
  if (!publicSupabase) {
    publicSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return publicSupabase;
}

async function createClient() {
  const client = getPublicClient();
  if (!client) throw new Error("Supabase client is not initialized.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return client as any;
}

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!supabaseConfigured()) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.error("[cms] Supabase query failed, using placeholder fallback:", err);
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (error || !data) throw error ?? new Error("not found");
    return {
      studioName: data.studio_name,
      tagline: data.tagline,
      city: data.city,
      region: data.region,
      establishedYear: data.established_year,
      phone: data.phone,
      email: data.email,
      instagramUrl: data.instagram_url ?? "",
      youtubeUrl: data.youtube_url ?? "",
      whatsappUrl: data.whatsapp_url ?? "",
      mapsUrl: data.maps_url ?? "",
      facebookUrl: data.facebook_url ?? "",
      websiteUrl: data.website_url ?? "",
      addressLine1: data.address_line1,
      addressLine2: data.address_line2,
      copyrightName: data.copyright_name,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      ogImageUrl: data.og_image_url,
      aboutHeroEyebrow: data.about_hero_eyebrow,
      aboutHeroTitle1: data.about_hero_title1,
      aboutHeroTitle2: data.about_hero_title2,
      classesHeroEyebrow: data.classes_hero_eyebrow,
      classesHeroTitle1: data.classes_hero_title1,
      classesHeroTitle2: data.classes_hero_title2,
      classesHeroDescription: data.classes_hero_description,
      scheduleHeroEyebrow: data.schedule_hero_eyebrow,
      scheduleHeroTitle1: data.schedule_hero_title1,
      scheduleHeroTitle2: data.schedule_hero_title2,
      scheduleHeroDescription: data.schedule_hero_description,
      galleryHeroEyebrow: data.gallery_hero_eyebrow,
      galleryHeroTitle: data.gallery_hero_title,
      galleryHeroWatermark: data.gallery_hero_watermark,
      contactHeroEyebrow: data.contact_hero_eyebrow,
      contactHeroTitle1: data.contact_hero_title1,
      contactHeroTitle2: data.contact_hero_title2,
      ctaHeading: data.cta_heading,
      ctaBtnLabel: data.cta_btn_label,
      ctaWatermark: data.cta_watermark,
      paymentModes: data.payment_modes ?? "Cash, UPI, Card, Bank Transfer",
      batchDays: data.batch_days ?? "3 Days, 5 Days, Weekend",
    };
  }, placeholder.siteSettings);
}

export async function getNavLinks(): Promise<NavLink[]> {
  // Structural navigation — intentionally not CMS-driven (changing it changes routes).
  return placeholder.navLinks;
}

export async function getHeroContent(): Promise<HeroContent> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const [{ data: hero, error: heroError }, { data: stats, error: statsError }] = await Promise.all([
      supabase.from("hero_content").select("*").eq("id", 1).single(),
      supabase.from("hero_stats").select("*").order("sort_order"),
    ]);
    if (heroError || !hero) throw heroError ?? new Error("not found");
    if (statsError) throw statsError;
    return {
      eyebrow: hero.eyebrow,
      headlineLine1: hero.headline_line1,
      headlineLine2Accent: hero.headline_line2_accent,
      primaryCta: { label: hero.primary_cta_label, href: hero.primary_cta_href },
      secondaryCta: { label: hero.secondary_cta_label, href: hero.secondary_cta_href },
      backgroundMediaUrl: hero.background_media_url,
      backgroundMediaType: hero.background_media_type,
      stats: (stats ?? []).map((s: HeroStat) => ({ id: s.id, value: s.value, label: s.label })),
    };
  }, placeholder.heroContent);
}

export async function getPageHero(pageKey: string): Promise<PageHeroConfig> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_heroes")
      .select("*")
      .eq("page_key", pageKey)
      .single();
    if (error || !data) throw error ?? new Error("not found");
    return {
      pageKey: data.page_key,
      eyebrow: data.eyebrow,
      titleLine1: data.title_line1,
      titleLine2: data.title_line2,
      description: data.description,
      primaryButtonText: data.primary_button_text,
      primaryButtonUrl: data.primary_button_url,
      secondaryButtonText: data.secondary_button_text,
      secondaryButtonUrl: data.secondary_button_url,
      desktopImageUrl: data.desktop_image_url,
      desktopVideoUrl: data.desktop_video_url,
      desktopVideoPoster: data.desktop_video_poster,
      mobileImageUrl: data.mobile_image_url,
      mobileVideoUrl: data.mobile_video_url,
      mobileVideoPoster: data.mobile_video_poster,
      heroHeight: data.hero_height,
      contentWidth: data.content_width,
      desktopAlignment: data.desktop_alignment,
      mobileAlignment: data.mobile_alignment,
      verticalAlignment: data.vertical_alignment,
      overlayColor: data.overlay_color,
      overlayOpacity: data.overlay_opacity,
      gradientType: data.gradient_type,
      backgroundPosition: data.background_position,
      revealAnimation: data.reveal_animation,
      showScrollIndicator: data.show_scroll_indicator,
    };
  }, placeholder.pageHeroes[pageKey] || placeholder.defaultPageHero);
}

interface PageHeroRow {
  page_key: string;
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  description: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  desktop_image_url: string;
  desktop_video_url: string;
  desktop_video_poster: string;
  mobile_image_url: string;
  mobile_video_url: string;
  mobile_video_poster: string;
  hero_height: string;
  content_width: "Small" | "Medium" | "Large" | "Full";
  desktop_alignment: "Left" | "Center" | "Right";
  mobile_alignment: "Left" | "Center" | "Right";
  vertical_alignment: "Top" | "Center" | "Bottom";
  overlay_color: string;
  overlay_opacity: number;
  gradient_type: "None" | "Solid" | "Linear" | "Radial";
  background_position: string;
  reveal_animation: "None" | "Fade" | "Slide Up" | "Slide Left" | "Zoom" | "Reveal";
  show_scroll_indicator: boolean;
}

export async function getAllPageHeroes(): Promise<PageHeroConfig[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_heroes")
      .select("*");
    if (error || !data) throw error ?? new Error("not found");
    return (data as PageHeroRow[]).map((d) => ({
      pageKey: d.page_key,
      eyebrow: d.eyebrow,
      titleLine1: d.title_line1,
      titleLine2: d.title_line2,
      description: d.description,
      primaryButtonText: d.primary_button_text,
      primaryButtonUrl: d.primary_button_url,
      secondaryButtonText: d.secondary_button_text,
      secondaryButtonUrl: d.secondary_button_url,
      desktopImageUrl: d.desktop_image_url,
      desktopVideoUrl: d.desktop_video_url,
      desktopVideoPoster: d.desktop_video_poster,
      mobileImageUrl: d.mobile_image_url,
      mobileVideoUrl: d.mobile_video_url,
      mobileVideoPoster: d.mobile_video_poster,
      heroHeight: d.hero_height,
      contentWidth: d.content_width,
      desktopAlignment: d.desktop_alignment,
      mobileAlignment: d.mobile_alignment,
      verticalAlignment: d.vertical_alignment,
      overlayColor: d.overlay_color,
      overlayOpacity: d.overlay_opacity,
      gradientType: d.gradient_type,
      backgroundPosition: d.background_position,
      revealAnimation: d.reveal_animation,
      showScrollIndicator: d.show_scroll_indicator,
    }));
  }, Object.values(placeholder.pageHeroes));
}

export async function getMarqueeTags(): Promise<MarqueeTag[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("marquee_tags").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((t: MarqueeTag) => ({ id: t.id, label: t.label }));
  }, placeholder.marqueeTags);
}

interface GalleryItemRow {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  title: string | null;
  category_id: string;
  sort_order: number;
  hover_image_url: string | null;
  gallery_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

function mapGalleryRow(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    title: row.title,
    categoryId: row.category_id,
    category: row.gallery_categories?.name ?? "",
    order: row.sort_order,
    hoverImageUrl: row.hover_image_url ?? null,
  };
}

export async function getGalleryTeaser(): Promise<GalleryItem[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, gallery_categories(id, name, slug)")
      .order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return (data as unknown as GalleryItemRow[])
      .filter((row) => row.gallery_categories?.slug !== "team")
      .slice(0, 4)
      .map(mapGalleryRow);
  }, placeholder.galleryTeaser);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, gallery_categories(id, name, slug)")
      .order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return (data as unknown as GalleryItemRow[])
      .filter((row) => row.gallery_categories?.slug !== "team")
      .map(mapGalleryRow);
  }, placeholder.galleryItems);
}

export async function getGalleryFilters(): Promise<string[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("name, slug")
      .neq("slug", "team")
      .order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return ["ALL", ...(data as { name: string; slug: string }[]).map((c) => c.name)];
  }, ["ALL", ...placeholder.galleryCategories.filter((c) => c.slug !== "team").map((c) => c.name)]);
}

export async function getAgeBatches(): Promise<AgeBatch[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("age_batches").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((b: { id: string; name: string; age_range: string; description: string; sort_order: number }) => ({
      id: b.id,
      name: b.name,
      ageRange: b.age_range,
      description: b.description,
      order: b.sort_order,
    }));
  }, placeholder.ageBatches);
}

export async function getClassStyles(): Promise<ClassStyle[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("class_styles").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((c: { id: string; sort_order: number; name: string; description: string; levels: string[]; media_url: string; media_type: "image" | "video"; secondary_image_url?: string | null }) => ({
      id: c.id,
      order: c.sort_order,
      name: c.name,
      description: c.description,
      levels: c.levels ?? [],
      mediaUrl: c.media_url,
      mediaType: c.media_type,
      secondaryImageUrl: c.secondary_image_url ?? null,
    }));
  }, placeholder.classStyles);
}

export async function getScheduleSlots(): Promise<ScheduleSlot[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("schedule_slots").select("*");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((s: { id: string; day: ScheduleSlot["day"]; time: string; class_name: string; category: ScheduleSlot["category"]; tag: string | null }) => ({
      id: s.id,
      day: s.day,
      time: s.time,
      className: s.class_name,
      category: s.category,
      tag: s.tag,
    }));
  }, placeholder.scheduleSlots);
}

export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("membership_plans").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((p: { id: string; name: string; price: string; period: string; features: MembershipPlan["features"]; highlighted: boolean; cta_label: string; sort_order: number }) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      period: p.period,
      features: p.features ?? [],
      highlighted: p.highlighted,
      ctaLabel: p.cta_label,
      order: p.sort_order,
    }));
  }, placeholder.membershipPlans);
}

export async function getTrustBadges(): Promise<TrustBadge[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("trust_badges").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((b: { id: string; icon: string; title: string; description: string }) => ({ id: b.id, icon: b.icon, title: b.title, description: b.description }));
  }, placeholder.trustBadges);
}

export async function getCoreValues(): Promise<CoreValue[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("core_values").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((v: { id: string; index_label: string; title: string; description: string }) => ({ id: v.id, index: v.index_label, title: v.title, description: v.description }));
  }, placeholder.coreValues);
}

export async function getJourneyMilestones(): Promise<JourneyMilestone[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("journey_milestones").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((m: { id: string; year: string; title: string; description: string; sort_order: number }) => ({
      id: m.id,
      year: m.year,
      title: m.title,
      description: m.description,
      order: m.sort_order,
    }));
  }, placeholder.journeyMilestones);
}

export async function getFaqItems(): Promise<FaqItem[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((f: { id: string; question: string; answer: string; sort_order: number }) => ({ id: f.id, question: f.question, answer: f.answer, order: f.sort_order }));
  }, placeholder.faqItems);
}

export async function getAboutStats(): Promise<HeroStat[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("about_stats").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((s: HeroStat) => ({ id: s.id, value: s.value, label: s.label }));
  }, placeholder.aboutStats);
}

export async function getFounderProfile(): Promise<{ name: string; bio: string; photoUrl: string; secondaryImageUrl?: string | null }> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("founder_profile").select("*").eq("id", 1).single();
    if (error || !data) throw error ?? new Error("not found");
    return { name: data.name, bio: data.bio, photoUrl: data.photo_url ?? "", secondaryImageUrl: data.secondary_image_url ?? null };
  }, placeholder.founderProfile);
}

export async function getTeamPhotos(): Promise<GalleryItem[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, gallery_categories(id, name, slug)")
      .order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return (data as unknown as GalleryItemRow[])
      .filter((row) => row.gallery_categories?.slug === "team")
      .map(mapGalleryRow);
  }, placeholder.teamPhotos);
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return (data as { id: string; name: string; slug: string; sort_order: number }[]).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sortOrder: c.sort_order,
    }));
  }, placeholder.galleryCategories);
}

export async function getStudioHours(): Promise<StudioHours[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("studio_hours").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((h: { id: string; label: string; hours: string; closed: boolean; sort_order: number }) => ({ id: h.id, label: h.label, hours: h.hours, closed: h.closed, order: h.sort_order }));
  }, placeholder.studioHours);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
    if (error || !data) throw error ?? new Error("not found");
    return data.map((t: { id: string; author_name: string; author_role: string; quote: string; avatar_url: string; sort_order: number }) => ({
      id: t.id,
      authorName: t.author_name,
      authorRole: t.author_role,
      quote: t.quote,
      avatarUrl: t.avatar_url,
      order: t.sort_order,
    }));
  }, placeholder.testimonials);
}
