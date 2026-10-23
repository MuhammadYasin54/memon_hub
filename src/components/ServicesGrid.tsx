import Link from "next/link";
import { getServices } from "@/lib/services";

export default async function ServicesGrid({ compact = false }: { compact?: boolean }) {
  const allServices = await getServices();
  const items = compact ? allServices.slice(0, 3) : allServices;
  return <div className={`service-grid${compact ? " service-grid-compact" : ""}`}>
    {items.map((service) => <Link className="service-card" href={`/services/${service.slug}`} key={service.slug}>
      <div className="service-top"><span className="service-icon" aria-hidden="true">{service.icon}</span><span className="service-number">{service.number}</span></div>
      <h3>{service.title}</h3><p>{service.summary}</p><span className="service-arrow" aria-hidden="true">↗</span>
      <span className="service-card-hint">Explore service</span>
    </Link>)}
    {compact && <Link href="/services" className="service-card more-card"><span className="service-icon" aria-hidden="true">＋</span><h3>Explore all services</h3><p>Find the right support for your next step.</p><span className="service-arrow" aria-hidden="true">↗</span></Link>}
  </div>;
}
