import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@/payload.config";
import VisualEditor from "@/components/builder/VisualEditor";
import type { Data } from "@puckeditor/core";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const payload = await getPayload({ config });
  const requestHeaders = await headers();

  const { user } = await payload.auth({
    headers: requestHeaders,
  });

  if (!user) redirect("/admin/login");

  const parsedId = /^\d+$/.test(id) ? parseInt(id, 10) : id;

  const page = await payload.findByID({
    collection: "pages",
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
                id: item.props?.id || `${item.type}-${page.id}-${key}-${idx}`,
                ...item.props,
              },
            })),
          ])
        )
      : undefined,
  };

  return (
    <VisualEditor
      pageId={String(page.id)}
      initialData={initialData}
    />
  );
}
