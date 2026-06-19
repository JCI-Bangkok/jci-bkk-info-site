import type { Metadata } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, Locale } from "@/lib/i18n";

import "../globals.css";

const plusJakartaSans = localFont({
  src: [
    { path: "../../../fonts/PlusJakartaSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../../../fonts/PlusJakartaSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../../fonts/PlusJakartaSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../../fonts/PlusJakartaSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../../fonts/PlusJakartaSans-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-body",
  display: "swap",
  preload: false
});

const arvo = localFont({
  src: [
    { path: "../../../fonts/Arvo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../../fonts/Arvo-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-accent",
  display: "swap",
  preload: false
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return {
    title: {
      default: dict.nav.home + " | JCI Bangkok",
      template: `%s | JCI Bangkok`
    },
    description: dict.home.heroSub
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${arvo.variable}`}
    >
      <body>
        <SiteHeader locale={locale as Locale} />
        <main>{children}</main>
        <SiteFooter locale={locale as Locale} />
      </body>
    </html>
  );
}

