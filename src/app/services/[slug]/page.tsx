import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PageFrame, whatsapp } from "@/components/SiteLayout";
import { getService } from "@/lib/services";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  await connection();
  const { slug } = await params;
  const service = await getService(slug);
  return service ? { title: `${service.title} | Memon Tech Hub`, description: service.summary } : { title: "Service not found | Memon Tech Hub" };
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  await connection();
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return <PageFrame><main><section className="service-detail-hero"><div className="container detail-breadcrumb"><Link href="/services">Services</Link><span>/</span><span>{service.title}</span></div><div className="container detail-layout"><div className="detail-copy"><div className="eyebrow"><span className="eyebrow-dot" /> SERVICE {service.number}</div><div className="detail-icon">{service.icon}</div><h1>{service.title}</h1><p>{service.summary}</p><a className="button button-dark" href={whatsapp} target="_blank" rel="noreferrer">Ask about this service <span>↗</span></a></div><div className="detail-image-wrap"><img src={service.image} alt={`${service.title} in a professional setting`} /><span className="detail-image-caption">THOUGHTFUL SUPPORT. PRACTICAL RESULTS.</span></div></div></section><section className="container detail-content"><div className="detail-story"><div className="eyebrow">HOW WE CAN HELP</div><h2>Support built around <em>your next step.</em></h2>{service.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><aside className="detail-includes"><div className="eyebrow">WHAT&apos;S INCLUDED</div><h3>A clear path forward</h3><ul>{service.highlights.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul><a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Discuss your needs <span>↗</span></a></aside></section><section className="detail-bottom container"><div><span className="detail-bottom-icon">{service.icon}</span><p>Looking for another way to grow your business?</p></div><Link className="button button-light" href="/services">See all services <span>↗</span></Link></section></main></PageFrame>;
}
