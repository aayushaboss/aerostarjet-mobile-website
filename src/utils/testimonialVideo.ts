import type { Testimonial } from '../data/content'

export function testimonialHasVideo(item: Testimonial) {
  return Boolean(item.videoUrl || item.instagramUrl)
}

export function getInstagramReelEmbedUrl(instagramUrl: string) {
  const match = instagramUrl.match(/instagram\.com\/reel\/([^/?#]+)/i)
  if (!match?.[1]) return null
  return `https://www.instagram.com/reel/${match[1]}/embed`
}