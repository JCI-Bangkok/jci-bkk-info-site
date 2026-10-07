function cleanEnv(val?: string, fallback = ''): string {
  if (!val) return fallback
  let cleaned = val.trim()
  cleaned = cleaned.replace(/^(\\?["'])+|(\\?["'])+$/g, '').trim()
  if (cleaned.includes('your-') || cleaned === '') return fallback
  return cleaned
}

const S3_ENDPOINT = cleanEnv(process.env.S3_ENDPOINT, 'https://br-lucky-fog-aol9sf27.storage.c-2.ap-southeast-1.aws.neon.tech').replace(/\/+$/, '')
const S3_BUCKET = cleanEnv(process.env.S3_BUCKET, 'jci-bkk-media')

export function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media && typeof (media as { url: unknown }).url === 'string') {
    const rawUrl = (media as { url: string }).url
    if (rawUrl.startsWith('/api/media/file/') && process.env.S3_ENABLED !== 'false') {
      const filename = rawUrl.replace('/api/media/file/', '')
      return `${S3_ENDPOINT}/${S3_BUCKET}/${filename}`
    }
    return rawUrl
  }
  return undefined
}

