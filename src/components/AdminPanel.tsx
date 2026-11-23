"use client";

import { FormEvent, useEffect, useState } from "react";

type Service = { slug: string; title: string; icon: string; summary: string; image: string };

export default function AdminPanel() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refreshServices() {
    const response = await fetch("/api/admin/services", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setServices(data.services);
      setSignedIn(true);
    } else setSignedIn(false);
    setReady(true);
  }

  useEffect(() => { void refreshServices(); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: form.get("username"), password: form.get("password") }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); return; }
    await refreshServices();
  }

  async function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); return; }
    setServices((current) => [...current, data.service]);
    formElement.reset(); setNotice("Service added and published.");
  }

  async function removeService(slug: string) {
    if (!window.confirm("Remove this service from the website?")) return;
    const response = await fetch(`/api/admin/services?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setError(data.error); return; }
    setServices(data.services); setNotice("Service removed.");
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setSignedIn(false); setServices([]); setNotice("You have signed out.");
  }

  if (!ready) return <div className="admin-loading">Loading secure admin area…</div>;

  return <main className="admin-page"><div className="admin-wrap">
    <a className="admin-back" href="/">← Back to website</a>
    <div className="admin-heading"><div className="eyebrow"><span className="eyebrow-dot" /> MEMON TECH HUB</div><h1>Services <em>admin</em></h1><p>Manage the services shown on your website.</p></div>
    {error && <p role="alert" className="admin-alert">{error}</p>}{notice && <p role="status" className="admin-notice">{notice}</p>}
    {!signedIn ? <form className="admin-card admin-login" onSubmit={login}><h2>Sign in</h2><p>Use your admin account to manage website services.</p><label>Username<input name="username" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="button button-dark" type="submit">Sign in <span>↗</span></button></form> : <>
      <div className="admin-list-head"><div><h2>Published services</h2><p>{services.length} service{services.length === 1 ? "" : "s"} on your website</p></div><button type="button" className="admin-signout" onClick={logout}>Sign out</button></div>
      <div className="admin-service-list">{services.map((service) => <div className="admin-service-row" key={service.slug}><span className="admin-service-icon">{service.icon}</span><span><strong>{service.title}</strong><small>/{service.slug}</small></span><button type="button" className="admin-delete" onClick={() => void removeService(service.slug)} aria-label={`Remove ${service.title}`}>Remove</button></div>)}</div>
    <form className="admin-card admin-form" onSubmit={addService}><h2>Add a service</h2><p>New services are published immediately. Add detailed information so visitors know what to expect.</p><div className="admin-form-grid"><label>Service name<input name="title" placeholder="e.g. Business coaching" maxLength={90} required /></label><label>Icon emoji<input name="icon" placeholder="e.g. 💡" maxLength={8} required /></label></div><label>Short summary<textarea name="summary" rows={2} maxLength={260} required /></label><label>Detailed description <small>Separate paragraphs with a blank line.</small><textarea name="description" rows={5} required /></label><label>What's included <small>One item per line.</small><textarea name="highlights" rows={4} required /></label><label>Image path or secure image URL <small>Use a local file such as /services/quran.svg, or an https:// image URL.</small><input name="image" type="text" placeholder="/services/quran.svg or https://example.com/service.jpg" required /></label><button className="button button-dark" type="submit">Publish service <span>↗</span></button></form>
    </>}
    <p className="admin-footnote">Your admin session expires automatically after 8 hours.</p>
  </div></main>;
}
