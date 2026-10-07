import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'

// Preserve CMS links, nested lists, line breaks and formatting in server-rendered HTML.
export function RichText({ content }: { content: SerializedEditorState | null | undefined }) {
  if (!content?.root?.children?.length) return null
  return <PayloadRichText data={content} className="space-y-4 text-base leading-7 text-[var(--muted)] [&_a]:text-[var(--jci-blue)] [&_a]:underline [&_h2]:mt-6 [&_h2]:text-2xl [&_h3]:mt-5 [&_h3]:text-xl [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5" />
}
