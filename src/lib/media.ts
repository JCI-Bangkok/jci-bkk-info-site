const S3_ENDPOINT = process.env.S3_ENDPOINT || 'https://br-lucky-fog-aol9sf27.storage.c-2.ap-southeast-1.aws.neon.tech'
const S3_BUCKET = process.env.S3_BUCKET || 'jci-bkk-media'

export function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media && typeof (media as { url: unknown }).url === 'string') {
    const rawUrl = (media as { url: string }).url
    if (rawUrl.startsWith('/api/media/file/')) {
      const filename = rawUrl.replace('/api/media/file/', '')
      return `${S3_ENDPOINT}/${S3_BUCKET}/${filename}`
    }
    return rawUrl
  }
  return undefined
}

