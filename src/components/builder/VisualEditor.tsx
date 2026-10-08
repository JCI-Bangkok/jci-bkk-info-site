"use client";

import { Puck, usePuck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import "@/app/(frontend)/globals.css"; // Ensure Tailwind works in the editor
import { builderConfig } from "@/lib/builder/config";
import { useState } from "react";

type Props = {
  pageId: string;
  initialData: Data;
};

export default function VisualEditor({ pageId, initialData }: Props) {
  const [isPublishing, setIsPublishing] = useState(false);

  // Saves a safe draft (doesn't push to production if drafts are enabled)
  async function saveDraft(data: Data) {
    const response = await fetch(
      `/api/pages/${encodeURIComponent(pageId)}?draft=true`,
      {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          puckLayout: data,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to save draft");
    }
  }

  // Hard publish (pushes to production directly)
  async function publishLive(data: Data) {
    setIsPublishing(true);
    try {
      const response = await fetch(
        `/api/pages/${encodeURIComponent(pageId)}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            puckLayout: data,
            _status: "published", // Force Payload to mark it as published
            status: "published",  // Also update your custom status field
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to publish");
      }
      alert("Page published successfully!");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <Puck
      config={builderConfig}
      data={initialData}
      onPublish={saveDraft} // Default publish button acts as Save Draft
      overrides={{
        headerActions: () => (
          <CustomHeaderActions
            saveDraft={saveDraft}
            publishLive={publishLive}
            isPublishing={isPublishing}
          />
        ),
      }}
    />
  );
}

function CustomHeaderActions({
  saveDraft,
  publishLive,
  isPublishing,
}: {
  saveDraft: (data: Data) => void;
  publishLive: (data: Data) => void;
  isPublishing: boolean;
}) {
  const { appState } = usePuck();
  return (
    <>
      <button
        onClick={() => saveDraft(appState.data)}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
      >
        Save Draft
      </button>
      <button
        onClick={() => publishLive(appState.data)}
        disabled={isPublishing}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isPublishing ? "Publishing..." : "Publish Live"}
      </button>
    </>
  );
}
