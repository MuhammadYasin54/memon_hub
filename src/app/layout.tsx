import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memon Tutoring Hub | Your Success, Our Priority",
  description: "Accounting, tax, branding, website, and marketing solutions for your business.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body  cz-shortcut-listen="true">{children}</body></html>;
}
