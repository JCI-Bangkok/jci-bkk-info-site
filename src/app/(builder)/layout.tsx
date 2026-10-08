import React from "react";
import localFont from "next/font/local";
import { Kanit } from "next/font/google";
import "@/app/(frontend)/globals.css"; // Ensure global styles are loaded in the builder

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap"
});

const plusJakartaSans = localFont({
  src: [
    { path: "../../fonts/PlusJakartaSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../../fonts/PlusJakartaSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/PlusJakartaSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/PlusJakartaSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/PlusJakartaSans-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-body",
  display: "swap",
  preload: false
});

const arvo = localFont({
  src: [
    { path: "../../fonts/Arvo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Arvo-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-accent",
  display: "swap",
  preload: false
});

export const metadata = {
  title: "Visual Editor",
  description: "Drag and drop visual page builder",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${arvo.variable} ${kanit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
