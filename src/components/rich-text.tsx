import React from 'react'

interface LexicalNode {
  type: string
  text?: string
  format?: number
  tag?: string
  listType?: string
  children?: LexicalNode[]
}

interface LexicalRoot {
  children?: LexicalNode[]
}

interface LexicalContent {
  root?: LexicalRoot
}

export function RichText({ content }: { content: LexicalContent | null | undefined }) {
  if (!content || !content.root || !content.root.children) return null

  return (
    <div className="space-y-4">
      {content.root.children.map((node, index) => {
        if (node.type === 'paragraph') {
          return (
            <p key={index} className="text-base leading-7 text-[var(--muted)]">
              {node.children?.map((child, i) => {
                if (child.type === 'text') {
                  const text = child.text || ''
                  const format = child.format || 0
                  if (format & 1) { // bold
                    return <strong key={i}>{text}</strong>
                  }
                  if (format & 2) { // italic
                    return <em key={i}>{text}</em>
                  }
                  return <span key={i}>{text}</span>
                }
                return null
              })}
            </p>
          )
        }
        if (node.type === 'heading') {
          const Tag = (node.tag || 'h3') as keyof React.JSX.IntrinsicElements
          return (
            <Tag key={index} className="font-display text-2xl mt-6 text-[var(--ink)]">
              {node.children?.map((child) => child.text).join('')}
            </Tag>
          )
        }
        if (node.type === 'list') {
          const Tag = node.listType === 'number' ? 'ol' : 'ul'
          return (
            <Tag key={index} className="list-disc pl-5 space-y-2 text-base leading-7 text-[var(--muted)]">
              {node.children?.map((li, i) => (
                <li key={i}>
                  {li.children?.map((child) => child.text).join('')}
                </li>
              ))}
            </Tag>
          )
        }
        return null
      })}
    </div>
  )
}

