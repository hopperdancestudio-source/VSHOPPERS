export interface SiteSettings {
  studioName: string;
  tagline: string;
  city: string;
  region: string;
  establishedYear: number;
  phone: string;
  email: string;
  instagramUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
  mapsUrl: string;
  facebookUrl: string;
  websiteUrl: string;
  addressLine1: string;
  addressLine2: string;
  copyrightName: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  aboutHeroEyebrow: string;
  aboutHeroTitle1: string;
  aboutHeroTitle2: string;
  classesHeroEyebrow: string;
  classesHeroTitle1: string;
  classesHeroTitle2: string;
  classesHeroDescription: string;
  scheduleHeroEyebrow: string;
  scheduleHeroTitle1: string;
  scheduleHeroTitle2: string;
  scheduleHeroDescription: string;
  galleryHeroEyebrow: string;
  galleryHeroTitle: string;
  galleryHeroWatermark: string;
  contactHeroEyebrow: string;
  contactHeroTitle1: string;
  contactHeroTitle2: string;
  ctaHeading: string;
  ctaBtnLabel: string;
  ctaWatermark: string;
  paymentModes: string;
  batchDays: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroStat {
  id: string;
  value: string;
  label: string;
}

export interface HeroContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2Accent: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundMediaUrl: string;
  backgroundMediaType: "image" | "video";
  stats: HeroStat[];
}

export interface MarqueeTag {
  id: string;
  label: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  title: string | null;
  categoryId: string;
  category: string; // resolved category name for simple UI rendering
  order: number;
  hoverImageUrl?: string | null;
}

export interface AgeBatch {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  order: number;
}

export interface ClassStyle {
  id: string;
  order: number;
  name: string;
  description: string;
  levels: string[];
  mediaUrl: string;
  mediaType: "image" | "video";
  secondaryImageUrl?: string | null;
}

export interface ScheduleSlot {
  id: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  time: string;
  className: string;
  category: "core" | "specialty" | "kids";
  tag: string | null;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: { label: string; included: boolean }[];
  highlighted: boolean;
  ctaLabel: string;
  order: number;
}

export interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface CoreValue {
  id: string;
  index: string;
  title: string;
  description: string;
}

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface TrialFormValues {
  fullName: string;
  phone: string;
  email: string;
  classInterest: string;
  ageGroup: string;
  preferredDays: string[];
  message?: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  avatarUrl: string;
  order: number;
}

export interface StudioHours {
  id: string;
  label: string; // "MON – FRI"
  hours: string; // "04:00 PM – 10:00 PM" or "CLOSED"
  closed: boolean;
  order: number;
}

export interface TrialLead extends TrialFormValues {
  id: string;
  createdAt: string;
  status: "new" | "contacted" | "trial_booked" | "joined" | "rejected" | "archived";
}

export interface ClassStyleDb {
  id: string;
  sortOrder: number;
  name: string;
  description: string;
  levels: string[];
  mediaUrl: string;
  mediaType: "image" | "video";
  secondaryImageUrl?: string | null;
}

export interface GalleryItemDb {
  id: string;
  sortOrder: number;
  mediaUrl: string;
  mediaType: "image" | "video";
  title: string | null;
  categoryId: string;
  hoverImageUrl?: string | null;
}

export interface MembershipPlanDb {
  id: string;
  sortOrder: number;
  name: string;
  price: string;
  period: string;
  features: { label: string; included: boolean }[];
  highlighted: boolean;
  ctaLabel: string;
}

export interface PageHeroConfig {
  pageKey: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  desktopImageUrl: string;
  desktopVideoUrl: string;
  desktopVideoPoster: string;
  mobileImageUrl: string;
  mobileVideoUrl: string;
  mobileVideoPoster: string;
  heroHeight: string;
  contentWidth: "Small" | "Medium" | "Large" | "Full";
  desktopAlignment: "Left" | "Center" | "Right";
  mobileAlignment: "Left" | "Center" | "Right";
  verticalAlignment: "Top" | "Center" | "Bottom";
  overlayColor: string;
  overlayOpacity: number;
  gradientType: "None" | "Solid" | "Linear" | "Radial";
  backgroundPosition: string;
  revealAnimation: "None" | "Fade" | "Slide Up" | "Slide Left" | "Zoom" | "Reveal";
  showScrollIndicator: boolean;
}

export interface RegistrationFormValues {
  studentName: string;
  parentName: string;
  mobile: string;
  email?: string;
  dob: string;
  age: number;
  joiningDate: string;
  danceStyle: string;
  batchTime: string;
  package: string;
  paymentMode: string;
  batchDays: string;
  emergencyContact?: string;
  medicalCondition?: string;
  notes?: string;
  agreement: boolean;
}

export interface StudentRegistration extends RegistrationFormValues {
  id: string;
  registrationNo: string;
  paymentStatus: "Pending" | "Partial" | "Paid";
  status: "Pending" | "Contacted" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  internalNotes?: string;
  viewed: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationStatusHistory {
  id: string;
  registrationId: string;
  changedBy: string;
  oldStatus?: string | null;
  newStatus?: string | null;
  oldPaymentStatus?: string | null;
  newPaymentStatus?: string | null;
  internalNotes?: string | null;
  createdAt: string;
}


