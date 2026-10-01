import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBulletin } from "@/lib/bulletin";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  preload: false,
});

const title = `${site.name} · ${site.institute}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: site.name,
    title,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f1ebdd",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const bulletin = await getBulletin();

  return (
    <html lang="pl" className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable}`}>
      <body>
        <SiteHeader bulletin={bulletin} />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
