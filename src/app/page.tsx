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

export async function generateMetadata(): Promise<Metadata> {
  const { seo, general } = await getSiteContent();
  const images = seo.ogImage
    ? [{ url: seo.ogImage, width: 1200, height: 630, alt: `${general.name} – ${general.role}` }]
    : undefined;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: general.name }],
    creator: general.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://arman-portfolio.vercel.app",
      title: seo.title,
      description: seo.description,
      siteName: `${general.name} Portfolio`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: images?.map((i) => i.url),
    },
  };
}

export default async function Home() {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
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
