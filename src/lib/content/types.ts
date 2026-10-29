// Shape of every editable section of the site. Each top-level key is stored
// as one row in the Supabase `site_content` table (key -> jsonb data).

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  detail: string;
};

export type GeneralContent = {
  name: string;
  logoText: string;
  role: string;
  location: string;
  footerTagline: string;
  footerCredit: string;
  availableForWork: boolean;
  availabilityText: string;
};

export type SeoContent = {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  googleVerification: string;
};

export type HeroContent = {
  showVisual: boolean;
  showContent: boolean;
  roles: string[];
  tagline: string;
  keySkills: string[];
  portraitImage: string;
  revealImage: string;
};

export type Skill = { name: string; tag: string; level: number };

export type AboutContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  image: string;
  cardSubtitle: string;
  cardBadge: string;
  bio: string[];
  highlights: string[];
  stats: Stat[];
  skillsHeading: string;
  skills: Skill[];
};

export type ServiceItem = {
  icon: string;
  title: string;
  description: string;
  tags: string[];
};

export type ServicesContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: ServiceItem[];
};

export type PortfolioCategory = { id: string; label: string };

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  featured: boolean;
  spotlight: boolean;
};

export type PortfolioContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  marquee: string[];
  categories: PortfolioCategory[];
  items: PortfolioItem[];
};

export type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
};

export type EducationItem = {
  title: string;
  institution: string;
  period: string;
  description: string;
  grade: string;
};

export type ResumeContent = {
  eyebrow: string;
  heading: string;
  cvUrl: string;
  experience: ExperienceItem[];
  education: EducationItem[];
};

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
};

export type TestimonialsContent = {
  eyebrow: string;
  heading: string;
  items: Testimonial[];
};

export type SocialPlatform = "instagram" | "linkedin" | "facebook" | "whatsapp" | "website";

export type SocialProfile = {
  platform: SocialPlatform;
  name: string;
  handle: string;
  url: string;
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappGreeting: string;
  availabilityNote: string;
  socials: SocialProfile[];
};

export type SiteContent = {
  general: GeneralContent;
  seo: SeoContent;
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  resume: ResumeContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
};

export type SectionKey = keyof SiteContent;

export const SECTION_KEYS: SectionKey[] = [
  "general",
  "seo",
  "hero",
  "about",
  "services",
  "portfolio",
  "resume",
  "testimonials",
  "contact",
];
