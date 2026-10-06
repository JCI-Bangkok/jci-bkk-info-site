export function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media && typeof (media as any).url === 'string') {
    return (media as any).url;
  }
  return undefined;
}
