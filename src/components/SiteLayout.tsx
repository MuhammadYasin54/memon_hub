import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const phone = "92 309 8189021";
const whatsapp = "https://wa.me/923098189021";
const email = "memontutoringhub@gmail.com";
const emailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Memon Tech Hub inquiry")}`;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="Memon Tech Hub home">
          <Image src="/memon-logo.jpg" alt="Memon Tech Hub logo" width={52} height={52} priority />
          <span><strong>Memon</strong><small>Tech Hub</small></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
        </nav>
        <a className="nav-cta" href={whatsapp} target="_blank" rel="noreferrer">Let&apos;s talk <span>↗</span></a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="brand footer-brand" href="/"><Image src="/memon-logo.jpg" alt="" width={42} height={42} /><span><strong>Memon</strong><small>Tech Hub</small></span></Link>
        <p>Practical support for brighter business growth.</p>
        <span className="copyright">© 2026 Memon Tech Hub</span>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}

export { phone, whatsapp, email, emailCompose };
