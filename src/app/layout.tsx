import type { Metadata } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteCopy } from "@/lib/site-data";

import "./globals.css";

const plusJakartaSans = localFont({
  src: [
    { path: "../fonts/PlusJakartaSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/PlusJakartaSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-body",
  display: "swap",
  preload: false
});

const arvo = localFont({
  src: [
    { path: "../fonts/Arvo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Arvo-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-accent",
  display: "swap",
  preload: false
});

export const metadata: Metadata = {
  title: {
    default: siteCopy.title,
    template: `%s | ${siteCopy.title}`
  },
  description: siteCopy.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${arvo.variable}`}
    >
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
