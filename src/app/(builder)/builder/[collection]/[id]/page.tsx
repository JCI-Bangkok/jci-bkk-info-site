import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@/payload.config";
import VisualEditor from "@/components/builder/VisualEditor";
import type { Data } from "@puckeditor/core";
import { getActivities } from "@/lib/activity-data";
import { getBuilderSettings } from '@/lib/builder/settings';

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const { collection, id } = await params;

  const payload = await getPayload({ config });
  const requestHeaders = await headers();

  const { user } = await payload.auth({
    headers: requestHeaders,
  });

  if (!user) redirect("/admin/login");
  if (!['pages', 'templates'].includes(collection) || user.roles?.includes('viewer')) notFound();
  const builderSettings = await getBuilderSettings();

  const parsedId = /^\d+$/.test(id) ? parseInt(id, 10) : id;

  const page = await payload.findByID({
    collection: collection as any,
    id: parsedId,
    draft: true,
    user,
    overrideAccess: false,
  }).catch(() => null);

  if (!page) notFound();

  const rawData: Data = (page.puckLayout as Data | null) ?? {
    root: { props: {} },
    content: [],
  };

  const initialData: Data = {
    ...rawData,
    root: rawData.root || { props: {} },
    content: (rawData.content || []).map((item, idx) => ({
      ...item,
      props: {
        id: item.props?.id || `${item.type}-${page.id}-${idx}`,
        ...item.props,
      },
    })),
    zones: rawData.zones
      ? Object.fromEntries(
          Object.entries(rawData.zones).map(([key, items]) => [
            key,
            (items || []).map((item, idx) => ({
              ...item,
              props: {
                id: item.props?.id || `${item.type}-${page.id}-${key.replace(/[^a-zA-Z0-9_-]/g, '-')}-${idx}`,
                ...item.props,
              },
            })),
          ])
        )
      : undefined,
  };

  let previewData: any = null;

  if (collection === "templates") {
    const templateType = (page as any).type;
    if (templateType === "event-single") {
      const sample = await payload.find({ collection: "events", limit: 1 });
      previewData = sample.docs[0] ? { ...sample.docs[0], currentLocale: "en" } : null;
    } else if (templateType === "project-single") {
      const sample = await payload.find({ collection: "projects", limit: 1 });
      previewData = sample.docs[0] ? { ...sample.docs[0], currentLocale: "en" } : null;
    } else if (templateType === "news-single") {
      const sample = await payload.find({ collection: "articles", limit: 1 });
      previewData = sample.docs[0] ? { ...sample.docs[0], currentLocale: "en" } : null;
    } else if (templateType === "member-board-year") {
      const boardMembers = await payload.find({
        collection: "board-members",
        where: { year: { equals: 2026 } },
        sort: "displayOrder",
        limit: 100,
      });
      const regularMembers = await payload.find({
        collection: "members",
        sort: "displayOrder",
        limit: 100,
      });
      const presidentMember = boardMembers.docs.find(m =>
        m.displayOrder === 1 || (m.position || "").toLowerCase().includes("president")
      );
      previewData = {
        year: "2026",
        members: boardMembers.docs,
        regularMembers: regularMembers.docs,
        presidentName: presidentMember ? presidentMember.name : "Local President",
        metadata: {
          theme: "Young to Yak - 12 years JCI Bangkok",
          summary: "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok."
        },
        currentLocale: "en",
      };
    } else if (templateType === 'home' || templateType === 'events-listing') {
      const { activities, today } = await getActivities('en')
      previewData = { activities, today, currentLocale: 'en' }
    } else if (templateType === 'members-listing') {
      const board = await payload.find({ collection: 'board-members', locale: 'en' as any, pagination: false, sort: 'displayOrder' })
      const years = [...new Set(board.docs.map((member: any) => member.year))].sort((a, b) => b - a)
      previewData = { members: board.docs.filter((member: any) => member.year === years[0]), activeYear: years[0], years, currentLocale: 'en' }
    } else if (['about', 'contact', 'membership', 'photobomb'].includes(templateType)) {
      const settings = await payload.findGlobal({ slug: 'site-settings', locale: 'en' })
      previewData = { settings, currentLocale: 'en' }
    }
  } else if (collection === "pages") {
    const slug = (page as any).slug;
    if (slug === "events") {
      const { activities, today } = await getActivities("en");
      previewData = {
        ...page,
        activities,
        today,
        currentLocale: "en",
      };
    } else if (slug === "members") {
      const [board, stories] = await Promise.all([
        payload.find({ collection: 'board-members', locale: 'en' as any, depth: 1, pagination: false, sort: 'displayOrder' }),
        payload.find({ collection: 'member-stories', locale: 'en' as any, depth: 1, limit: 6 }),
      ]);
      const years: number[] = [...new Set<number>(board.docs.map((member: any) => member.year))].sort((a, b) => b - a);
      const activeYear = years[0];
      const members = board.docs.filter((member: any) => member.year === activeYear);
      previewData = {
        ...page,
        board,
        stories,
        years,
        activeYear,
        members,
        currentLocale: "en",
      };
    } else {
      previewData = {
        ...page,
        currentLocale: "en",
      };
    }
  }

  return (
    <VisualEditor
      pageId={String(page.id)}
      collectionSlug={collection}
      initialData={initialData}
      previewData={previewData}
      enabledPlugins={builderSettings.enabledPlugins}
    />
  );
}
