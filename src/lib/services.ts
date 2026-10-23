import { readFile } from "node:fs/promises";
import path from "node:path";

export type BusinessService = {
  number: string;
  slug: string;
  icon: string;
  title: string;
  summary: string;
  description: string[];
  highlights: string[];
  image: string;
};

const servicesFile = path.join(process.cwd(), "data", "services.json");

export async function getServices(): Promise<BusinessService[]> {
  try {
    return JSON.parse(await readFile(servicesFile, "utf8")) as BusinessService[];
  } catch {
    return [];
  }
}

export async function getService(slug: string): Promise<BusinessService | undefined> {
  return (await getServices()).find((service) => service.slug === slug);
}
