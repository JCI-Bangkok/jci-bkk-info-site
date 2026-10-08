import sanitizeHtml from 'sanitize-html';
export function sanitizeBuilderRichText(value: string) {
  return sanitizeHtml(value, {
    allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'title'], p: ['style'] },
    allowedStyles: { p: { 'text-align': [/^(left|center|right)$/] } },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
    allowProtocolRelative: false,
  });
}
