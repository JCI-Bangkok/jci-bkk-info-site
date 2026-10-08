import { siteOrigin, validLocale } from '@/lib/seo';
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Kanit } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, Locale } from "@/lib/i18n";
import { getPayload } from "payload";
import config from "@/payload.config";
import { PuckRenderer } from "@/components/builder/PuckRenderer";
import type { Data } from "@puckeditor/core";
import { getBuilderSettings } from '@/lib/builder/settings';
import { BuilderRuntimeProvider } from '@/components/builder/RuntimeProvider';

import "../globals.css";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap"
});

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
  const dict = getDictionary(validLocale(locale));
  return {
    title: {
      default: dict.nav.home + " | JCI Bangkok",
      template: `%s | JCI Bangkok`
    },
    metadataBase: new URL(siteOrigin()),
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
  validLocale(locale);

  const payload = await getPayload({ config });

  const builderSettings = await getBuilderSettings();
  const [settings, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale: locale as any, depth: 1 }),
    payload.findGlobal({ slug: 'navigation', depth: 1 }),
  ]);
  const chromeData = { settings, navigation, currentLocale: locale };

  // Try to find a global header template
  const headerTemplates = await payload.find({
    collection: "templates",
    where: {
      type: {
        equals: "header",
      },
      status: {
        equals: "published",
      },
    },
    limit: 1,
  });

  const headerTemplate = headerTemplates.docs[0];

  // Try to find a global footer template
  const footerTemplates = await payload.find({
    collection: "templates",
    where: {
      type: {
        equals: "footer",
      },
      status: {
        equals: "published",
      },
    },
    limit: 1,
  });

  const footerTemplate = footerTemplates.docs[0];
  
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${arvo.variable} ${kanit.variable}`}
    >
      <body>
        <BuilderRuntimeProvider enabledPlugins={builderSettings.enabledPlugins}>
        {headerTemplate && headerTemplate.puckLayout ? (
          <PuckRenderer data={headerTemplate.puckLayout as Data} documentData={chromeData} />
        ) : (
          <SiteHeader locale={locale as Locale} />
        )}
        <main>{children}</main>
        {footerTemplate && footerTemplate.puckLayout ? (
          <PuckRenderer data={footerTemplate.puckLayout as Data} documentData={chromeData} />
        ) : (
          <SiteFooter locale={locale as Locale} />
        )}
        </BuilderRuntimeProvider>
      </body>
    </html>
  );
}
