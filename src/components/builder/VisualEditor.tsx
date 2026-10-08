"use client";

import { Puck, usePuck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import "@/app/(frontend)/globals.css"; // Ensure Tailwind works in the editor
import { buildBuilderConfig, builderPlugins } from "@/lib/builder/config";
import { DocumentContext } from "@/components/builder/DocumentContext";
import { createContext, useContext, useMemo, useState } from "react";
import { LayoutCodeEditor } from './LayoutCodeEditor';
import { BuilderTools } from './BuilderTools';
import { BuilderRuntimeProvider } from './RuntimeProvider';
import { enabledPluginIds } from '@/lib/builder/plugin-catalog';
import { validateBuilderLayout } from '@/lib/builder/layout-utils';
import { migrateBuilderPlugins } from '@/lib/builder/plugin-migrations';

type Props = {
  pageId: string;
  collectionSlug: string;
  initialData: Data;
  previewData?: any;
  enabledPlugins?: string[];
  initialStatus?: 'draft' | 'published';
};

type Actions = {
  saveDraft: (data: Data) => Promise<void>;
  publishLive: (data: Data) => Promise<void>;
  isPublishing: boolean;
  onPluginsChange: (ids: string[]) => void;
  versionStatus: 'draft' | 'published';
  collectionSlug: string;
  pageId: string;
};
const EditorActionsContext = createContext<Actions | null>(null);
function HeaderActionsFromContext() {
  const actions = useContext(EditorActionsContext);
  return actions ? <CustomHeaderActions {...actions} /> : null;
}
const editorOverrides = { headerActions: () => <HeaderActionsFromContext /> };

export default function VisualEditor({ pageId, collectionSlug, initialData, previewData, enabledPlugins, initialStatus }: Props) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [versionStatus, setVersionStatus] = useState<'draft' | 'published'>(initialStatus || 'draft');
  const [activePlugins, setActivePlugins] = useState(enabledPlugins || enabledPluginIds());
  const initialTypes = [...new Set([...initialData.content, ...Object.values(initialData.zones || {}).flat()].map(block => block.type))].sort().join('|');
  const [observedTypes, setObservedTypes] = useState(initialTypes);
  const preparedData = useMemo(() => migrateBuilderPlugins(initialData, builderPlugins, activePlugins), [initialData, activePlugins]);
  const config = useMemo(() => buildBuilderConfig(activePlugins, { root: { props: {} }, content: observedTypes ? observedTypes.split('|').map(type => ({ type, props: { id: `registry-${type}` } })) : [] }), [activePlugins, observedTypes]);
  const editorPlugins = useMemo(() => builderPlugins.filter(plugin => activePlugins.includes(plugin.id)).flatMap(plugin => plugin.editorPlugins || []), [activePlugins]);
  function versionedData(data: Data) {
    validateBuilderLayout(data);
    const previous = (data.root.props as Record<string, any> | undefined)?.pluginVersions || {};
    return { ...data, root: { ...data.root, props: { ...data.root.props, pluginVersions: { ...previous, ...Object.fromEntries(builderPlugins.filter(plugin => activePlugins.includes(plugin.id)).map(plugin => [plugin.id, plugin.version])) } } } };
  }

  // Saves a version in 'draft' state
  async function saveDraft(data: Data) {
    const response = await fetch(
      `/api/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(pageId)}?draft=true`,
      {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          puckLayout: versionedData(data),
          _status: "draft",
          status: "draft",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to save draft");
    }
    setVersionStatus("draft");
  }

  // Promotes/saves a version in 'published' state
  async function publishLive(data: Data) {
    setIsPublishing(true);
    try {
      const response = await fetch(
        `/api/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(pageId)}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            puckLayout: versionedData(data),
            _status: "published",
            status: "published",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to publish");
      }
      setVersionStatus("published");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <BuilderRuntimeProvider enabledPlugins={activePlugins}><DocumentContext.Provider value={previewData || null}><EditorActionsContext.Provider value={{ saveDraft, publishLive, isPublishing, onPluginsChange: setActivePlugins, versionStatus, collectionSlug, pageId }}>
      <Puck
        config={config}
        plugins={editorPlugins}
        viewports={[{ width: 1280, height: 'auto', label: 'Desktop' }, { width: 820, height: 'auto', label: 'Tablet' }, { width: 390, height: 'auto', label: 'Mobile' }]}
        data={preparedData}
        onChange={data => { const types = [...new Set([...data.content, ...Object.values(data.zones || {}).flat()].map(block => block.type))].sort().join('|'); if (types !== observedTypes) setObservedTypes(types); }}
        onPublish={saveDraft} // Default publish button acts as Save Draft
        overrides={editorOverrides}
      />
    </EditorActionsContext.Provider></DocumentContext.Provider></BuilderRuntimeProvider>
  );
}

function CustomHeaderActions({
  saveDraft,
  publishLive,
  isPublishing,
  onPluginsChange,
  versionStatus,
  collectionSlug,
  pageId,
}: {
  saveDraft: (data: Data) => Promise<void>;
  publishLive: (data: Data) => Promise<void>;
  isPublishing: boolean;
  onPluginsChange: (ids: string[]) => void;
  versionStatus: 'draft' | 'published';
  collectionSlug: string;
  pageId: string;
}) {
  const { appState } = usePuck();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  async function runSave(publish: boolean) {
    setSaving(true);
    setMessage('');
    try {
      await (publish ? publishLive(appState.data) : saveDraft(appState.data));
      setMessage(publish ? 'Published successfully.' : 'Draft saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <BuilderTools onPluginsChange={onPluginsChange} />
      <LayoutCodeEditor />
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            versionStatus === 'published'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}
          title={`Current version state: ${versionStatus}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${versionStatus === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {versionStatus === 'published' ? 'Published' : 'Draft'}
        </span>
        <a
          href={`/admin/collections/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(pageId)}/versions`}
          target="_blank"
          rel="noreferrer"
          title="View version history and restored revisions in Payload Admin"
          className="text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2"
        >
          Revisions
        </a>
      </div>
      <span role="status" className="text-xs text-slate-600">{message}</span>
      <button
        onClick={() => runSave(false)}
        disabled={saving}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
      >
        Save Draft
      </button>
      <button
        onClick={() => runSave(true)}
        disabled={saving || isPublishing}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isPublishing ? "Publishing..." : "Publish Live"}
      </button>
    </>
  );
}
