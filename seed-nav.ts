import { getPayload } from "payload";
import configPromise from "./src/payload.config";

async function run() {
  const payload = await getPayload({ config: configPromise });

  const defaultNavEn = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Members", href: "/members" },
    { label: "PhotoBomb", href: "/photobomb" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  const defaultNavTh = [
    { label: "หน้าแรก", href: "/" },
    { label: "กิจกรรม", href: "/events" },
    { label: "สมาชิก", href: "/members" },
    { label: "PhotoBomb", href: "/photobomb" },
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "ติดต่อเรา", href: "/contact" }
  ];

  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      mainNav: defaultNavEn,
    },
  });

  await payload.updateGlobal({
    slug: "site-settings",
    locale: "th",
    data: {
      mainNav: defaultNavTh,
    },
  });

  console.log("Seeded mainNav into site-settings successfully!");
  process.exit(0);
}

run();
