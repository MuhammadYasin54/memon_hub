import ServicesGrid from "@/components/ServicesGrid";
import { PageFrame, whatsapp, emailCompose } from "@/components/SiteLayout";
import { connection } from "next/server";

export const instant = false;

export const metadata = { title: "Services | Memon Tech", description: "Accounting, tax, software, branding, web design, and marketing services for your business." };

export default async function ServicesPage() {
  await connection();
  return <PageFrame><main><section className="inner-hero"><div className="container"><div className="eyebrow"><span className="eyebrow-dot" /> OUR SERVICES</div><h1>Support for every<br /><em>side of business.</em></h1><p>Six practical services. One dependable team. Let&apos;s make your next move a little easier.</p></div></section><section className="container section services-page-section"><ServicesGrid /><div className="inline-cta"><p>Need help deciding where to start?</p><a className="button button-dark" href={whatsapp} target="_blank" rel="noreferrer">Ask us on WhatsApp <span>↗</span></a><a className="button button-dark" href={emailCompose} target="_blank" rel="noreferrer">Email us <span>↗</span></a></div></section></main></PageFrame>;
}
