import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/cms";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const heading = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.studioName} — Movement & Dance Studio`,
      template: `%s — ${settings.studioName}`,
    },
    description: settings.tagline,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    openGraph: {
      title: settings.studioName,
      description: settings.tagline,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${heading.variable} ${body.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
