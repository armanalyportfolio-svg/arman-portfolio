import type { SiteContent } from "./types";

// Fallback content: used until a section has been saved from the admin panel,
// or when Supabase is not configured.
export const defaultContent: SiteContent = {
  general: {
    name: "Arman Ali",
    logoText: "Arman",
    role: "Graphic Designer & Brand Specialist",
    location: "Karachi, PK",
    footerTagline: "Graphic Designer & Brand Identity Specialist · Karachi, Pakistan",
    footerCredit: "Designed & Developed for Arman Ali · 2026",
    availableForWork: true,
    availabilityText: "Available for Projects",
  },

  seo: {
    title: "Arman Ali | Graphic Designer Portfolio",
    description:
      "Premium graphic design portfolio of Arman Ali — specializing in brand identity, business cards, large-format banners, social media creatives, and AI-assisted design. Based in Pakistan.",
    keywords: [
      "Arman Ali",
      "Graphic Designer",
      "Brand Identity",
      "Business Card Design",
      "Banner Design",
      "Flyer Design",
      "Logo Design",
      "Social Media Design",
      "Print Design",
      "Pakistan Graphic Designer",
      "Photoshop",
      "Illustrator",
      "Canva",
      "AI Design",
    ],
    ogImage: "/og-image.jpg",
  },

  hero: {
    showVisual: true,
    showContent: true,
    roles: [
      "Graphic Designer",
      "Brand Identity Specialist",
      "Print & Signage Expert",
      "AI Composite Visual Artist",
    ],
    tagline:
      "Turning bold concepts into commercially impactful visual identities — brand systems, print pre-press, large-format signage & AI composite art.",
    keySkills: ["Illustrator", "Photoshop", "Canva Pro", "Large-Format", "AI Art"],
    portraitImage: "/assets/hero-img-latest.png",
    revealImage: "/assets/hero-venom-img-latest.png",
  },

  about: {
    eyebrow: "Get to Know Me",
    heading: "About Me",
    subheading: "Bridging real-world print production, brand identity, and modern AI-assisted visuals.",
    image: "/images/creative-designer.png",
    cardSubtitle: "Graphic Designer & Brand Specialist",
    cardBadge: "PK",
    bio: [
      "A versatile Graphic Designer with **7+ months of hands-on professional industry experience**. I specialize in translating concepts into sharp, high-impact visuals that communicate brand value and captivate audiences.",
      "Having worked directly in fast-paced print shop environments like **Sign Banner Printing** and **South West Printing**, I bring rare pre-press proficiency: managing color accuracy, bleed, high-resolution vector scalability, and large-format mechanical specifications across signage, menus, and marketing collateral.",
      "Great design goes far beyond aesthetics — it requires deep understanding of brand intent, customer psychology, and purposeful composition. Whether building identities from scratch or generating AI-assisted visual assets, my focus is delivering clean, commercially effective design.",
    ],
    highlights: [
      "DAE Computer Science (Ongoing)",
      "Graphic Design Certified (Arba Tech · Grade A+1)",
      "English & Urdu / Hindi",
      "Large-Format & Pre-Press Ready",
    ],
    stats: [
      { value: 7, suffix: "+", label: "Months Experience", detail: "Hands-on Print & Brand" },
      { value: 50, suffix: "+", label: "Projects Completed", detail: "Digital & Print Collateral" },
      { value: 100, suffix: "%", label: "Client Satisfaction", detail: "On-time Delivery" },
      { value: 3, suffix: "", label: "Companies & Roles", detail: "Print Shops & Freelance" },
    ],
    skillsHeading: "Core Technical Proficiency",
    skills: [
      { name: "Adobe Illustrator", tag: "Vector & Print", level: 90 },
      { name: "Adobe Photoshop", tag: "Composites & Edit", level: 88 },
      { name: "Canva Pro", tag: "Rapid Layouts", level: 95 },
      { name: "Large-Format Design & Signage", tag: "Pre-Press & Production", level: 92 },
      { name: "Brand Identity & Logos", tag: "Visual Systems", level: 86 },
      { name: "AI Tools (Gemini & ChatGPT)", tag: "Concept & Workflow", level: 85 },
    ],
  },

  services: {
    eyebrow: "What I offer",
    heading: "My Services",
    subheading:
      "From brand identity to large-format print — a full suite of design services tailored to elevate your brand.",
    items: [
      {
        icon: "palette",
        title: "Logo & Brand Identity",
        description:
          "Custom logos and complete brand identity systems — color palettes, typography, brand guidelines, and visual language.",
        tags: ["Logo Design", "Brand Guide", "Identity System"],
      },
      {
        icon: "credit-card",
        title: "Business Card Design",
        description:
          "Memorable, print-ready business cards that make a lasting first impression — from minimal to bold creative styles.",
        tags: ["Print-Ready", "Both Sides", "Multiple Formats"],
      },
      {
        icon: "megaphone",
        title: "Banner & Signage Design",
        description:
          "Large-format print designs — roll-up banners, A-frame sidewalk signs, vehicle wraps, and trade show displays.",
        tags: ["Roll-up Banners", "A-Frame Signs", "Vehicle Wraps"],
      },
      {
        icon: "file-text",
        title: "Flyer & Brochure Design",
        description:
          "Eye-catching marketing collateral — event flyers, promotional brochures, and informational leaflets.",
        tags: ["Flyers", "Brochures", "Leaflets"],
      },
      {
        icon: "share",
        title: "Social Media Design",
        description:
          "Consistent, platform-optimized social media creatives for Instagram, Facebook, and other channels.",
        tags: ["Posts", "Stories", "Reels Covers"],
      },
      {
        icon: "cpu",
        title: "AI-Assisted Design",
        description:
          "Leveraging Gemini and ChatGPT to accelerate creative workflows — AI concept generation, image compositing, and prompting.",
        tags: ["Gemini", "ChatGPT", "AI Compositing"],
      },
      {
        icon: "package",
        title: "Packaging Design",
        description:
          "Product packaging that stands out on shelves — boxes, labels, pouches, and retail packaging with dielines.",
        tags: ["Product Labels", "Box Design", "Retail Packaging"],
      },
      {
        icon: "layers",
        title: "Menu & Food Design",
        description:
          "Restaurant menus, food truck wraps, and hospitality print collateral with appetizing visual design.",
        tags: ["Restaurant Menus", "Food Truck", "Chalkboard Style"],
      },
    ],
  },

  portfolio: {
    eyebrow: "Featured Showcase",
    heading: "Design Portfolio",
    subheading:
      "Curated commercial works across branding, large-format sign banners, food truck wraps, business cards, and custom AI visual compositions.",
    marquee: [
      "Brand Identity",
      "Large-Format Signage",
      "Business Card Systems",
      "Pre-Press Production",
      "Vector Illustration",
      "Packaging Design",
      "Restaurant Menus",
      "AI Visual Artistry",
      "Promotional Flyers",
      "Outdoor A-Frames",
    ],
    categories: [
      { id: "business-card", label: "Business Cards" },
      { id: "banner", label: "Banners & Signs" },
      { id: "flyer", label: "Flyers" },
      { id: "menu", label: "Menus" },
    ],
    items: [
      {
        id: "3",
        title: "Zomi Wireless A-Frame Sign",
        category: "banner",
        image: "/images/zomi-sign.jpeg",
        description: "High-contrast black & yellow retail sidewalk A-frame for on-spot repair & printing.",
        tags: ["Signage", "Retail", "Large Format"],
        featured: true,
        spotlight: false,
      },
      {
        id: "4",
        title: "Telangana Ruchulu – Food Truck Wrap",
        category: "menu",
        image: "/images/telangana-food-truck.jpeg",
        description: "Chalkboard-style South Indian food truck menu wrap with authentic Telangana branding.",
        tags: ["Menu", "Food Truck", "Wrap Design"],
        featured: true,
        spotlight: true,
      },
      {
        id: "5",
        title: "Telangana Ruchulu – Table Menu",
        category: "menu",
        image: "/images/telangana-table-menu.jpeg",
        description: "Premium flat-lay restaurant menu board with dark chalkboard aesthetic.",
        tags: ["Menu", "Restaurant", "Print"],
        featured: false,
        spotlight: false,
      },
      {
        id: "6",
        title: "Avon Business Card",
        category: "business-card",
        image: "/images/avon-card.jpeg",
        description: "Elegant floral matte black Avon representative business card design.",
        tags: ["Business Card", "Floral", "Elegant"],
        featured: false,
        spotlight: false,
      },
      {
        id: "7",
        title: "Alvarez Custom Paint & Remodeling",
        category: "business-card",
        image: "/images/alvarez-card.jpeg",
        description: "Brushstroke artistic themed business card for home remodeling company.",
        tags: ["Business Card", "Construction", "Blue"],
        featured: true,
        spotlight: false,
      },
      {
        id: "8",
        title: "DSWM Streetwear Market",
        category: "business-card",
        image: "/images/dswm-card.jpeg",
        description: "Urban vibrant graffiti-style streetwear brand business card with plaid pattern.",
        tags: ["Business Card", "Streetwear", "Urban"],
        featured: false,
        spotlight: false,
      },
      {
        id: "9",
        title: "Soleo Health",
        category: "business-card",
        image: "/images/soleo-card.jpeg",
        description: "Clean minimalist medical/healthcare professional business card.",
        tags: ["Business Card", "Healthcare", "Minimal"],
        featured: false,
        spotlight: false,
      },
      {
        id: "10",
        title: "Boutte's Roadside Service",
        category: "business-card",
        image: "/images/bouttes-card.jpeg",
        description: "High-visibility lime green automotive roadside service card with QR code.",
        tags: ["Business Card", "Automotive", "QR Code"],
        featured: false,
        spotlight: false,
      },
      {
        id: "11",
        title: "Wright Way Loads LLC",
        category: "business-card",
        image: "/images/wright-way-card.jpeg",
        description: "Freight logistics trucking company business card with freightliner photography.",
        tags: ["Business Card", "Logistics", "Trucking"],
        featured: false,
        spotlight: false,
      },
      {
        id: "12",
        title: "Stixxx & Stones – Cigar Business Card",
        category: "business-card",
        image: "/images/stixxx-cigar-card.jpeg",
        description: "Premium dark luxury cigar brand card with gold-foil aesthetic.",
        tags: ["Business Card", "Luxury", "Gold"],
        featured: false,
        spotlight: false,
      },
      {
        id: "13",
        title: "Stixxx & Stones – Roll-up Banner",
        category: "banner",
        image: "/images/stixxx-banner.jpeg",
        description: "Premium retractable roll-up banner for luxury cigar lounge brand.",
        tags: ["Banner", "Roll-up", "Luxury"],
        featured: true,
        spotlight: true,
      },
      {
        id: "14",
        title: "American Star Title – Roll-up Banner",
        category: "banner",
        image: "/images/american-star-banner.jpeg",
        description: "Corporate roll-up exhibition banner for real estate title & escrow services.",
        tags: ["Banner", "Real Estate", "Corporate"],
        featured: false,
        spotlight: false,
      },
      {
        id: "15",
        title: "American Star Title – Flyer",
        category: "flyer",
        image: "/images/american-star-flyer.jpeg",
        description: "Professional flyer for residential & commercial title closing services.",
        tags: ["Flyer", "Real Estate", "Corporate"],
        featured: false,
        spotlight: false,
      },
      {
        id: "16",
        title: "CM&E Commercial Metals",
        category: "business-card",
        image: "/images/cme-card.jpeg",
        description: "Industrial high-contrast red/silver metallic business card.",
        tags: ["Business Card", "Industrial", "Metal"],
        featured: false,
        spotlight: false,
      },
      {
        id: "17",
        title: "Beautiful Green Lawns",
        category: "flyer",
        image: "/images/beautiful-lawns.jpeg",
        description: "Promotional landscaping postcard with 1 Month Free offer.",
        tags: ["Flyer", "Landscaping", "Promotion"],
        featured: false,
        spotlight: false,
      },
    ],
  },

  resume: {
    eyebrow: "My Journey",
    heading: "Resume",
    cvUrl: "/arman-ali-cv.pdf",
    experience: [
      {
        title: "Graphic Designer",
        company: "Sign Banner Printing",
        period: "Present",
        description:
          "Worked on diverse graphic design projects and visual content, handling daily design tasks under tight deadlines while gaining experience in professional workflows and real-world design practices.",
        tags: ["Banners", "Signs", "Large-Format", "Print"],
      },
      {
        title: "Graphic Designer",
        company: "South West Printing",
        period: "Present",
        description:
          "Creating impactful visual designs that bring brands to life. Work includes brand identities, logos, promotional banners, business cards, and marketing collateral.",
        tags: ["Branding", "Business Cards", "Flyers", "Logos"],
      },
      {
        title: "Freelance Brand Designer",
        company: "Self-Employed",
        period: "Present",
        description:
          "Working directly with startup clients to develop visual assets — from initial design concepts to promotional materials, managing client feedback, revisions, and project deadlines.",
        tags: ["Freelance", "Startups", "Brand Identity", "Client Management"],
      },
    ],
    education: [
      {
        title: "Diploma of Associate Engineering (DAE)",
        institution: "Computer Science",
        period: "3rd Semester — Ongoing",
        description:
          "Currently pursuing DAE in Computer Science, building a strong technical foundation alongside design.",
        grade: "",
      },
      {
        title: "Graphic Designing (4 Months Course)",
        institution: "Arba Tech Institute",
        period: "Completed",
        description:
          "Intensive graphic design certification covering industry-standard tools, design principles, and practical projects.",
        grade: "A+1",
      },
      {
        title: "Matriculation – Computer Science",
        institution: "Zelashia English Secondary School",
        period: "Completed",
        description: "Secondary education with Computer Science as a major subject.",
        grade: "B",
      },
    ],
  },

  testimonials: {
    eyebrow: "Client Feedback",
    heading: "Testimonials",
    items: [
      {
        name: "Marcus Thompson",
        role: "Owner, Stixxx & Stones Cigars",
        text: "Arman delivered an absolutely stunning brand package for our cigar business. The roll-up banner and business cards exceeded every expectation — premium gold aesthetic, perfect print quality. We've gotten so many compliments at events!",
        rating: 5,
      },
      {
        name: "Maria Lopez",
        role: "Manager, Telangana Ruchulu",
        text: "The food truck menu wrap and table menus Arman designed brought our restaurant brand to life. He perfectly captured the authentic Telangana vibe with the chalkboard style. Very professional and delivered on time.",
        rating: 5,
      },
      {
        name: "David Wright",
        role: "Owner, Wright Way Loads LLC",
        text: "Quick turnaround, great communication, and a business card that truly represents our trucking company. Arman understood our vision immediately and nailed the design on the first draft.",
        rating: 5,
      },
      {
        name: "Harper Lewis",
        role: "Owner, Boutte's Roadside Service",
        text: "The double-sided business card with the QR code is exactly what we needed. Eye-catching, professional, and packed with info. Arman handled every revision patiently and professionally.",
        rating: 5,
      },
      {
        name: "Carlos Alvarez",
        role: "Owner, Alvarez Custom Paint & Remodeling",
        text: "Arman created an incredible business card for my painting company. The brushstroke artistic design perfectly reflects what we do. Got compliments from every client who received one.",
        rating: 5,
      },
    ],
  },

  contact: {
    eyebrow: "Start A Conversation",
    heading: "Get in Touch",
    subheading:
      "Have a branding, print, or digital design project in mind? Let's build something impactful together.",
    email: "armanalyanxari@gmail.com",
    whatsappNumber: "923232902969",
    whatsappMessage: "Hi Arman, I saw your portfolio and would like to discuss a design project!",
    whatsappGreeting:
      "👋 Hi there! Need a logo, banner, business card, or full brand identity? Message me directly on WhatsApp!",
    availabilityNote:
      "Open to freelance branding, print shop pre-press contracts, and remote collaborations. Reach out on WhatsApp or email for rapid responses!",
    socials: [
      { platform: "instagram", name: "Instagram", handle: "@hey_armee", url: "https://www.instagram.com/hey_armee" },
      { platform: "linkedin", name: "LinkedIn", handle: "Arman Aly", url: "https://pk.linkedin.com/in/arman-aly-ab1409443" },
      { platform: "facebook", name: "Facebook", handle: "Arman Ali", url: "https://www.facebook.com/share/19za8kRrX9/" },
      { platform: "whatsapp", name: "WhatsApp", handle: "+92 323 2902969", url: "" },
    ],
  },
};
