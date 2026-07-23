import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { safeJsonLd } from "@/lib/json-ld";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://assurawy.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Assurawy Islamic Media — Designing Da'wah with Excellence",
    template: "%s",
  },
  description:
    "Learn Qur'an, Fiqh, Seerah, Tafseer, Hadith and Islamic Tarbiyyah through structured online courses at Assurawy Islamic Media.",
  keywords: [
    "Islamic online courses",
    "Qur'an academy",
    "Fiqh course",
    "Seerah course",
    "Tafseer course",
    "Islamic education Nigeria",
    "online Islamic school",
  ],
  authors: [{ name: "Assurawy Islamic Media" }],
  openGraph: {
    type: "website",
    siteName: "Assurawy Islamic Media",
    title: "Assurawy Islamic Media — Designing Da'wah with Excellence",
    description:
      "Learn Qur'an, Fiqh, Seerah, Tafseer, Hadith and Islamic Tarbiyyah through structured online courses.",
    url: siteUrl,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Assurawy Islamic Media" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assurawy Islamic Media — Designing Da'wah with Excellence",
    description:
      "Learn Qur'an, Fiqh, Seerah, Tafseer, Hadith and Islamic Tarbiyyah through structured online courses.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: siteUrl },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Assurawy",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E3B2E",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Assurawy Islamic Media",
  slogan: "Designing Da'wah with Excellence",
  url: siteUrl,
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${amiri.variable} font-body antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
