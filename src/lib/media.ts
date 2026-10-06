export function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media && typeof (media as { url: unknown }).url === 'string') {
    return (media as { url: string }).url;
  }
  return undefined;
}
