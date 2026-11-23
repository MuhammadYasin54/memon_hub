"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BannerSlide = { eyebrow: string; title: string; copy: string; image: string; alt: string; href: string; action: string };

export default function HomeBanner({ slides }: { slides: BannerSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];
  return <section className="home-banner" aria-roledescription="carousel" aria-label="Memon Tech and services">
    <div className="home-banner-photo" key={slide.image}>
      <img src={slide.image} alt={slide.alt} />
    </div>
    <div className="home-banner-shade" />
    <div className="container home-banner-content" key={slide.title}>
      <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> {slide.eyebrow}</div>
      <h1>{slide.title}</h1>
      <p>{slide.copy}</p>
      <Link className="button banner-button" href={slide.href}>{slide.action}<span>↗</span></Link>
      <div className="banner-controls" aria-label="Choose banner slide">
        {slides.map((item, index) => <button key={item.title} className={index === active ? "active" : ""} type="button" aria-label={`Show slide ${index + 1}: ${item.title}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}
      </div>
    </div>
  </section>;
}
