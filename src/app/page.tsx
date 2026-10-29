import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Resume from "@/components/Resume";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getSiteContent } from "@/lib/content/get-content";
import { verificationCode, whatsappUrl } from "@/lib/content/merge";
import type { SiteContent } from "@/lib/content/types";
import { getSiteUrl } from "@/lib/site-url";

// The share image comes from app/opengraph-image.tsx (it uses the image set in
// Admin → SEO when there is one), so no images are listed here.
export async function generateMetadata(): Promise<Metadata> {
  const { seo, general } = await getSiteContent();
  const googleCode = verificationCode(seo.googleVerification ?? "");

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: general.name, url: getSiteUrl() }],
    creator: general.name,
    alternates: { canonical: "/" },
    verification: googleCode ? { google: googleCode } : undefined,
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: "/",
      title: seo.title,
      description: seo.description,
      siteName: `${general.name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

// schema.org data so Google understands who the site is about (name, job,
// location, social profiles, services and work samples).
function structuredData({ general, seo, hero, about, services, portfolio, contact }: SiteContent) {
  const siteUrl = getSiteUrl();
  const abs = (src: string) => (src.startsWith("http") ? src : `${siteUrl}${src}`);
  const sameAs = contact.socials
    .map((s) => s.url || (s.platform === "whatsapp" ? whatsappUrl(contact.whatsappNumber) : ""))
    .filter((url) => url.startsWith("http"));

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: general.name,
    jobTitle: general.role,
    description: seo.description,
    url: siteUrl,
    image: hero.portraitImage ? abs(hero.portraitImage) : undefined,
    email: contact.email ? `mailto:${contact.email}` : undefined,
    address: general.location
      ? { "@type": "PostalAddress", addressLocality: general.location.split(",")[0].trim(), addressCountry: "PK" }
      : undefined,
    sameAs,
    knowsAbout: [...new Set([...about.skills.map((s) => s.name), ...hero.keySkills])],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${general.name} Portfolio`,
        description: seo.description,
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: seo.title,
        mainEntity: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: `${general.name} – ${general.role}`,
        url: siteUrl,
        image: hero.portraitImage ? abs(hero.portraitImage) : undefined,
        founder: { "@id": `${siteUrl}/#person` },
        areaServed: "Worldwide",
        address: person.address,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Design services",
          itemListElement: services.items.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.description },
          })),
        },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#portfolio`,
        name: "Design portfolio",
        itemListElement: portfolio.items
          .filter((item) => item.image)
          .map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "CreativeWork",
              name: item.title,
              description: item.description,
              image: abs(item.image),
              keywords: item.tags.join(", "),
              creator: { "@id": `${siteUrl}/#person` },
            },
          })),
      },
    ],
  };
}

export default async function Home() {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
      <script
        type="application/ld+json"
        // Escape "<" so content typed in the admin panel can't close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(content)).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Resume />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </SiteContentProvider>
  );
}
