import Link from "next/link";
import { connection } from "next/server";
import ServicesGrid from "@/components/ServicesGrid";
import HomeBanner from "@/components/HomeBanner";
import { PageFrame, whatsapp } from "@/components/SiteLayout";
import { getServices } from "@/lib/services";

export const instant = false;

export default async function Home() {
  await connection();
  const services = await getServices();
  const slides = [
    { eyebrow: "WELCOME TO MEMON TECH", title: "Support for learning, business & growth.", copy: "Memon Tech brings thoughtful tutoring and practical business services together, helping people learn with confidence and businesses move forward.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=2400&q=90", alt: "Students learning together in a bright classroom", href: "/about", action: "Discover our hub" },
    ...services.map((service) => ({ eyebrow: `SERVICE ${service.number} · MEMON TECH`, title: service.title, copy: service.summary, image: service.image, alt: `${service.title} — professional service photography`, href: `/services/${service.slug}`, action: "Explore this service" })),
  ];
  return <PageFrame>
    <main>
      <HomeBanner slides={slides} />
      <section className="section container" id="services">
        <div className="section-heading"><div><div className="eyebrow">WHAT WE DO</div><h2>Everything your business <em>needs to grow.</em></h2></div><p>Practical services, delivered with care. Get the right help at the right stage of your journey.</p></div>
        <ServicesGrid compact />
      </section>

      <section className="about-band"><div className="container about-band-inner"><div><div className="eyebrow eyebrow-light">A PARTNER IN YOUR CORNER</div><h2>Business is personal.<br /><em>So is our support.</em></h2></div><p>We bring essential business services together under one roof—making it easier to get organized, show up professionally, and keep moving forward.</p><Link className="text-link light-link" href="/about">Get to know us <span>↗</span></Link></div></section>

      <section className="contact-cta container"><div className="cta-symbol">↗</div><div><div className="eyebrow">YOUR NEXT STEP STARTS HERE</div><h2>Let&apos;s make your business <em>work better.</em></h2><p>Tell us what you&apos;re working on. We&apos;ll help you find the right next step.</p></div><a className="button button-dark" href={whatsapp} target="_blank" rel="noreferrer">Message us on WhatsApp <span>↗</span></a></section>
    </main>
  </PageFrame>;
}
