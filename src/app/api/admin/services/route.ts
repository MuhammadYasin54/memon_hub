import { NextResponse } from "next/server";
import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAdmin } from "@/lib/admin-auth";
import { getServices, type BusinessService } from "@/lib/services";

const file = path.join(process.cwd(), "data", "services.json");

function validImage(image: string) {
  if (image.startsWith("/services/") && /^\/services\/[a-z0-9-]+\.(svg|png|jpg|jpeg|webp)$/i.test(image)) return true;
  try { return new URL(image).protocol === "https:"; } catch { return false; }
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  return NextResponse.json({ services: await getServices() });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const title = cleanText(body.title, 90);
  const icon = cleanText(body.icon, 8);
  const summary = cleanText(body.summary, 260);
  const description = cleanText(body.description, 3000).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).slice(0, 8);
  const highlights = cleanText(body.highlights, 1000).split("\n").map((p) => p.trim()).filter(Boolean).slice(0, 10);
  const slug = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
  const image = cleanText(body.image, 500);
  if (!title || !slug || !icon || !summary || description.length === 0 || highlights.length === 0 || !validImage(image)) {
    return NextResponse.json({ error: "Please complete every field and provide a local /services image or secure https image URL." }, { status: 400 });
  }
  const services = await getServices();
  if (services.some((service) => service.slug === slug)) return NextResponse.json({ error: "A service with that title already exists." }, { status: 409 });
  const service: BusinessService = { number: String(services.length + 1).padStart(2, "0"), slug, icon, title, summary, description, highlights, image };
  const next = [...services, service];
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await rename(temporary, file);
  return NextResponse.json({ service }, { status: 201 });
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const services = await getServices();
  if (!services.some((service) => service.slug === slug)) return NextResponse.json({ error: "Service not found." }, { status: 404 });
  const next = services.filter((service) => service.slug !== slug).map((service, index) => ({ ...service, number: String(index + 1).padStart(2, "0") }));
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await rename(temporary, file);
  return NextResponse.json({ services: next });
}
