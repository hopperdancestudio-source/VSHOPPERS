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
 * All copy below is placeholder only, sized to match the line-length and content
 * density of the reference so the layout doesn't shift once real content lands
 * via the CMS. Nothing here is a real business identity.
 */

export const siteSettings: SiteSettings = {
  studioName: "Studio Name",
  tagline: "Movement, taught with intention.",
  city: "Your City",
  region: "Your Region",
  establishedYear: 2016,
  phone: "+1 555-0100",
  email: "hello@studiosite.example",
  instagramUrl: "https://instagram.com/vs_hoppers_dance_studio",
  youtubeUrl: "https://youtube.com/@vshoppers",
  whatsappUrl: "https://wa.me/918108480373",
  mapsUrl: "https://maps.google.com/?q=VS+Hoppers+Dance+Studio",
  facebookUrl: "",
  websiteUrl: "",
  addressLine1: "123 Placeholder Ave, Unit 2",
  addressLine2: "Your City, Your Region 00000",
  copyrightName: "Studio Name",
  seoTitle: "Studio Name — Movement & Dance Studio",
  seoDescription: "Movement, taught with intention. Book your free trial class today.",
  ogImageUrl: "",
  aboutHeroEyebrow: "MORE THAN A STUDIO —",
  aboutHeroTitle1: "MORE THAN A",
  aboutHeroTitle2: "STUDIO — A CREW",
  classesHeroEyebrow: "FIND YOUR STYLE",
  classesHeroTitle1: "FIND YOUR",
  classesHeroTitle2: "STYLE",
  classesHeroDescription: "From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.",
  scheduleHeroEyebrow: "PLAN YOUR WEEK",
  scheduleHeroTitle1: "CLASS",
  scheduleHeroTitle2: "SCHEDULE",
  scheduleHeroDescription: "From foundations to mastery. Pick your groove and join the community at our studio.",
  galleryHeroEyebrow: "MOMENTS IN MOTION",
  galleryHeroTitle: "THE GALLERY",
  galleryHeroWatermark: "ENERGY",
  contactHeroEyebrow: "COME DANCE WITH US",
  contactHeroTitle1: "BOOK YOUR",
  contactHeroTitle2: "FREE TRIAL",
  ctaHeading: "Ready to Move?",
  ctaBtnLabel: "Book Your Spot",
  ctaWatermark: "MOVE",
};

export const navLinks: NavLink[] = [
  { label: "Classes", href: "/classes" },
  { label: "Schedule", href: "/schedule" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const heroContent: HeroContent = {
  eyebrow: "YOUR CITY, YOUR REGION · EST. 2016",
  headlineLine1: "MOVEMENT IS BETTER",
  headlineLine2Accent: "WHEN SHARED",
  primaryCta: { label: "Book a Free Trial", href: "/contact" },
  secondaryCta: { label: "Watch Us Move", href: "#" },
  backgroundMediaUrl: "",
  backgroundMediaType: "image",
  stats: [
    { id: "years", value: "9+", label: "Experience" },
    { id: "rating", value: "4.9", label: "Reviews" },
    { id: "community", value: "2K+", label: "Community" },
  ],
};

export const marqueeTags: MarqueeTag[] = [
  { id: "1", label: "HIP-HOP" },
  { id: "2", label: "BOLLYWOOD" },
  { id: "3", label: "CONTEMPORARY" },
  { id: "4", label: "FREESTYLE" },
  { id: "5", label: "BHANGRA" },
];

export const galleryCategories: GalleryCategory[] = [
  { id: "c1", name: "CATEGORY ONE", slug: "category-one", sortOrder: 1 },
  { id: "c2", name: "CATEGORY TWO", slug: "category-two", sortOrder: 2 },
  { id: "c3", name: "CATEGORY THREE", slug: "category-three", sortOrder: 3 },
  { id: "c4", name: "PERFORMANCES", slug: "performances", sortOrder: 4 },
  { id: "c5", name: "BEHIND THE SCENES", slug: "behind-the-scenes", sortOrder: 5 },
  { id: "c6", name: "TEAM", slug: "team", sortOrder: 6 },
];

export const galleryTeaser: GalleryItem[] = [
  { id: "1", mediaUrl: "", mediaType: "image", title: null, categoryId: "c1", category: "CATEGORY ONE", order: 1, hoverImageUrl: null },
  { id: "2", mediaUrl: "", mediaType: "image", title: null, categoryId: "c2", category: "CATEGORY TWO", order: 2, hoverImageUrl: null },
  { id: "3", mediaUrl: "", mediaType: "image", title: "Feature Title Here", categoryId: "c3", category: "CATEGORY THREE", order: 3, hoverImageUrl: null },
  { id: "4", mediaUrl: "", mediaType: "image", title: null, categoryId: "c4", category: "PERFORMANCES", order: 4, hoverImageUrl: null },
];

export const ageBatches: AgeBatch[] = [
  {
    id: "1",
    name: "GROUP A",
    ageRange: "5–12 YEARS",
    description:
      "Foundational movement and rhythm training focused on coordination and creative expression.",
    order: 1,
  },
  {
    id: "2",
    name: "GROUP B",
    ageRange: "13–18 YEARS",
    description:
      "Intensive choreography, freestyle skills, and performance techniques for growing artists.",
    order: 2,
  },
  {
    id: "3",
    name: "GROUP C",
    ageRange: "18+ YEARS",
    description:
      "Open level and advanced sessions for hobbyists and professionals looking to refine their craft.",
    order: 3,
  },
];

export const classStyles: ClassStyle[] = [
  {
    id: "1",
    order: 1,
    name: "Hip-Hop",
    description:
      "Street culture & freestyle fundamentals. Learn the bounce, the rock, and the grooves that define modern urban movement.",
    levels: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    mediaUrl: "",
    mediaType: "image",
    secondaryImageUrl: null,
  },
  {
    id: "2",
    order: 2,
    name: "Bollywood",
    description:
      "Fluid, expressive technique blending strength and storytelling into every combination.",
    levels: ["ALL LEVELS"],
    mediaUrl: "",
    mediaType: "image",
    secondaryImageUrl: null,
  },
  {
    id: "3",
    order: 3,
    name: "Contemporary",
    description:
      "High-energy, narrative-driven choreography built around rhythm and showmanship.",
    levels: ["BEGINNER", "INTERMEDIATE"],
    mediaUrl: "",
    mediaType: "image",
    secondaryImageUrl: null,
  },
  {
    id: "4",
    order: 4,
    name: "Freestyle",
    description:
      "Traditional roots & power. Connect with the earthy energy and high-impact rhythm of folk dance.",
    levels: ["OPEN LEVEL"],
    mediaUrl: "",
    mediaType: "image",
    secondaryImageUrl: null,
  },
  {
    id: "5",
    order: 5,
    name: "Kids Dance",
    description:
      "Building the foundation for the next generation. Fun, engaging, and disciplined learning for young dancers.",
    levels: ["AGES 5–12"],
    mediaUrl: "",
    mediaType: "image",
    secondaryImageUrl: null,
  },
];

export const scheduleSlots: ScheduleSlot[] = [
  { id: "1", day: "MON", time: "07:00 AM", className: "MORNING FLOW", category: "core", tag: "ALL LEVELS" },
  { id: "2", day: "MON", time: "05:00 PM", className: "Hip-Hop", category: "core", tag: "BEGINNER" },
  { id: "3", day: "MON", time: "07:00 PM", className: "ADV. CHOREO", category: "specialty", tag: "INT/ADV" },
  { id: "4", day: "TUE", time: "05:00 PM", className: "Bollywood", category: "core", tag: null },
  { id: "5", day: "TUE", time: "07:00 PM", className: "Bhangra", category: "core", tag: null },
  { id: "6", day: "WED", time: "07:00 AM", className: "MORNING FLOW", category: "core", tag: null },
  { id: "7", day: "WED", time: "05:00 PM", className: "Hip-Hop", category: "core", tag: null },
  { id: "8", day: "WED", time: "07:00 PM", className: "ADV. CHOREO", category: "specialty", tag: null },
  { id: "9", day: "THU", time: "05:00 PM", className: "Bollywood", category: "core", tag: null },
  { id: "10", day: "THU", time: "07:00 PM", className: "Kids Dance", category: "core", tag: null },
  { id: "11", day: "FRI", time: "07:00 AM", className: "MORNING FLOW", category: "core", tag: null },
  { id: "12", day: "FRI", time: "05:00 PM", className: "Hip-Hop", category: "core", tag: null },
  { id: "13", day: "FRI", time: "07:00 PM", className: "OPEN SESSION", category: "core", tag: "FREE" },
  { id: "14", day: "SAT", time: "09:00 AM", className: "Freestyle", category: "specialty", tag: "OPEN JAM" },
  { id: "15", day: "SAT", time: "04:30 PM", className: "KIDS UNIT", category: "kids", tag: "AGES 6–12" },
  { id: "16", day: "SUN", time: "10:00 AM", className: "Contemporary", category: "specialty", tag: null },
  { id: "17", day: "SUN", time: "04:30 PM", className: "KIDS UNIT", category: "kids", tag: null },
];

export const membershipPlans: MembershipPlan[] = [
  {
    id: "1",
    name: "DROP-IN",
    price: "$20",
    period: "/ CLASS",
    features: [
      { label: "Any single session", included: true },
      { label: "Studio access for class duration", included: true },
      { label: "Guest passes", included: false },
    ],
    highlighted: false,
    ctaLabel: "Book Session",
    order: 1,
  },
  {
    id: "2",
    name: "MONTHLY",
    price: "$140",
    period: "/ MO",
    features: [
      { label: "Unlimited classes", included: true },
      { label: "2 guest passes / month", included: true },
      { label: "10% shop discount", included: true },
      { label: "Community events access", included: true },
    ],
    highlighted: true,
    ctaLabel: "Join the Crew",
    order: 2,
  },
  {
    id: "3",
    name: "QUARTERLY",
    price: "$360",
    period: "/ 3 MO",
    features: [
      { label: "All monthly benefits", included: true },
      { label: "Private assessment", included: true },
      { label: "Exclusive merch pack", included: true },
    ],
    highlighted: false,
    ctaLabel: "Lock in 3 Months",
    order: 3,
  },
];

export const trustBadges: TrustBadge[] = [
  {
    id: "1",
    icon: "party-popper",
    title: "FIRST CLASS FREE",
    description: "No strings attached. Just show up and move with us.",
  },
  {
    id: "2",
    icon: "lock-open",
    title: "NO LONG-TERM LOCK-IN",
    description: "Flexibility for your lifestyle. Cancel or pause anytime.",
  },
  {
    id: "3",
    icon: "users",
    title: "ALL LEVELS WELCOME",
    description: "From zero experience to competitive pros.",
  },
];

export const coreValues: CoreValue[] = [
  {
    id: "1",
    index: "01.",
    title: "ENERGY",
    description:
      "High-octane atmosphere that pushes every student to break their physical limits and find their inner power.",
  },
  {
    id: "2",
    index: "02.",
    title: "DISCIPLINE",
    description:
      "Mastery comes through repetition. We value the sweat, the practice, and the unwavering commitment to the craft.",
  },
  {
    id: "3",
    index: "03.",
    title: "COMMUNITY",
    description:
      "We are a family. Here, every member finds support, mentorship, and a crew that becomes home.",
  },
  {
    id: "4",
    index: "04.",
    title: "EXPRESSION",
    description:
      "No judgments. Only movement. We provide the stage for you to tell your story in your own unique language.",
  },
];

export const journeyMilestones: JourneyMilestone[] = [
  { id: "1", year: "2016", title: "THE SPARK", description: "First studio opens with a core group of 15 members.", order: 1 },
  { id: "2", year: "2018", title: "EXPANSION", description: "Launched the first annual showcase at a state-level theater.", order: 2 },
  { id: "3", year: "2020", title: "RESILIENCE", description: "Transitioned to global digital workshops, training 500+ students.", order: 3 },
  { id: "4", year: "2022", title: "NEW HEIGHTS", description: "Collaborated with major labels for choreography workshops.", order: 4 },
  { id: "5", year: "TODAY", title: "THE LEGACY", description: "A premier studio with a 2,000+ strong community.", order: 5 },
];

export const faqItems: FaqItem[] = [
  { id: "1", question: "WHAT SHOULD I WEAR?", answer: "Comfortable athletic wear and clean indoor shoes.", order: 1 },
  { id: "2", question: "ARE THERE CLASSES FOR KIDS?", answer: "Yes — see the Kids/Beginners track on the Classes page.", order: 2 },
  { id: "3", question: "HOW DO PAYMENTS WORK?", answer: "Monthly and quarterly plans auto-renew; drop-ins are pay-per-class.", order: 3 },
];

export const aboutStats: HeroStat[] = [
  { id: "years", value: "9+", label: "Years" },
  { id: "trained", value: "2000+", label: "Members Trained" },
  { id: "rating", value: "4.9", label: "Rating" },
  { id: "performances", value: "50+", label: "Stage Performances" },
];

export const founderProfile = {
  name: "Founder Name",
  bio: "Placeholder founder bio. Replace via CMS with the real founding story — background, motivation, and what led to opening the studio.",
  photoUrl: "",
  secondaryImageUrl: null,
};

// galleryCategories was moved above.

export const teamPhotos: GalleryItem[] = [
  { id: "t1", mediaUrl: "", mediaType: "image", title: null, categoryId: "c6", category: "TEAM", order: 1 },
  { id: "t2", mediaUrl: "", mediaType: "image", title: null, categoryId: "c6", category: "TEAM", order: 2 },
  { id: "t3", mediaUrl: "", mediaType: "image", title: null, categoryId: "c6", category: "TEAM", order: 3 },
];

export const studioHours: StudioHours[] = [
  { id: "sh1", label: "MON – FRI", hours: "04:00 PM – 10:00 PM", closed: false, order: 1 },
  { id: "sh2", label: "SATURDAY", hours: "10:00 AM – 08:00 PM", closed: false, order: 2 },
  { id: "sh3", label: "SUNDAY", hours: "CLOSED", closed: true, order: 3 },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    authorName: "Member Name",
    authorRole: "Monthly Member",
    quote:
      "Placeholder testimonial copy. Replace via CMS with a real member quote about their experience.",
    avatarUrl: "",
    order: 1,
  },
  {
    id: "2",
    authorName: "Member Name",
    authorRole: "Drop-in Member",
    quote:
      "Placeholder testimonial copy. Replace via CMS with a real member quote about their experience.",
    avatarUrl: "",
    order: 2,
  },
];

export const galleryItems: GalleryItem[] = Array.from({ length: 9 }).map((_, i) => {
  const catIndex = i % 5; // 0 to 4 (excluding TEAM)
  const category = galleryCategories[catIndex]!;
  return {
    id: String(i + 1),
    mediaUrl: "",
    mediaType: i % 4 === 0 ? "video" : "image",
    title: i % 4 === 0 ? "Placeholder Clip Title" : null,
    categoryId: category.id,
    category: category.name,
    order: i + 1,
    hoverImageUrl: null,
  };
});

export const galleryFilters = [
  "ALL",
  ...galleryCategories.filter((c) => c.slug !== "team").map((c) => c.name),
];

export const defaultPageHero: PageHeroConfig = {
  pageKey: "default",
  eyebrow: "EYEBROW",
  titleLine1: "TITLE 1",
  titleLine2: "TITLE 2",
  description: "",
  primaryButtonText: "",
  primaryButtonUrl: "",
  secondaryButtonText: "",
  secondaryButtonUrl: "",
  desktopImageUrl: "",
  desktopVideoUrl: "",
  desktopVideoPoster: "",
  mobileImageUrl: "",
  mobileVideoUrl: "",
  mobileVideoPoster: "",
  heroHeight: "min-h-[70vh]",
  contentWidth: "Large",
  desktopAlignment: "Left",
  mobileAlignment: "Left",
  verticalAlignment: "Center",
  overlayColor: "#000000",
  overlayOpacity: 0.4,
  gradientType: "Linear",
  backgroundPosition: "center",
  revealAnimation: "Reveal",
  showScrollIndicator: false,
};

export const pageHeroes: Record<string, PageHeroConfig> = {
  home: {
    pageKey: "home",
    eyebrow: "YOUR CITY, YOUR REGION · EST. 2016",
    titleLine1: "MOVEMENT IS BETTER",
    titleLine2: "WHEN SHARED",
    description: "",
    primaryButtonText: "Book a Free Trial",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Watch Us Move",
    secondaryButtonUrl: "#gallery",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[100vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: true,
  },
  about: {
    pageKey: "about",
    eyebrow: "MORE THAN A STUDIO —",
    titleLine1: "MORE THAN A",
    titleLine2: "STUDIO — A CREW",
    description: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[70vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: false,
  },
  classes: {
    pageKey: "classes",
    eyebrow: "FIND YOUR STYLE",
    titleLine1: "FIND YOUR",
    titleLine2: "STYLE",
    description: "From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[70vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: true,
  },
  schedule: {
    pageKey: "schedule",
    eyebrow: "PLAN YOUR WEEK",
    titleLine1: "CLASS",
    titleLine2: "SCHEDULE",
    description: "From foundations to mastery. Pick your groove and join the community at our studio.",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[70vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: false,
  },
  gallery: {
    pageKey: "gallery",
    eyebrow: "MOMENTS IN MOTION",
    titleLine1: "THE GALLERY",
    titleLine2: "ENERGY",
    description: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[70vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: false,
  },
  contact: {
    pageKey: "contact",
    eyebrow: "COME DANCE WITH US",
    titleLine1: "BOOK YOUR",
    titleLine2: "FREE TRIAL",
    description: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    desktopImageUrl: "",
    desktopVideoUrl: "",
    desktopVideoPoster: "",
    mobileImageUrl: "",
    mobileVideoUrl: "",
    mobileVideoPoster: "",
    heroHeight: "min-h-[70vh]",
    contentWidth: "Large",
    desktopAlignment: "Left",
    mobileAlignment: "Left",
    verticalAlignment: "Center",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
    gradientType: "Linear",
    backgroundPosition: "center",
    revealAnimation: "Reveal",
    showScrollIndicator: false,
  },
};
