import type { Metadata, Viewport } from "next";
import { Poltawski_Nowy, Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

// Antykwa Półtawskiego, the typeface of Polish schoolbooks, in its 2020 revival.
// Both fonts fall back to the metric-matched faces in globals.css, which carry font-display too.
const poltawski = Poltawski_Nowy({
  variable: "--font-poltawski",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  adjustFontFallback: false,
  fallback: ["Poltawski Fallback"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
  adjustFontFallback: false,
  fallback: ["Schibsted Fallback"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.institute}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.institute, url: site.url }],
  creator: site.institute,
  publisher: site.institute,
  category: "humor",
  openGraph: { type: "website", locale: "pl_PL", siteName: site.name },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${poltawski.variable} ${schibsted.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
