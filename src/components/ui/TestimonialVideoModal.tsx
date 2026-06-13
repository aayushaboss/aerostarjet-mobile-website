import { useEffect, useId, useMemo, useRef, type RefObject } from 'react'
import type { Testimonial } from '../../data/content'
import { getInstagramReelEmbedUrl } from '../../utils/testimonialVideo'

const CLOSE_MS = 250

type TestimonialVideoModalProps = {
  testimonials: readonly Testimonial[]
  activeIndex: number
  isClosing: boolean
  returnFocusRef: RefObject<HTMLElement | null>
  onClose: () => void
  onVideoEnded: () => void
}

export default function TestimonialVideoModal({
  testimonials,
  activeIndex,
  isClosing,
  onClose,
  onVideoEnded,
}: TestimonialVideoModalProps) {
  const titleId = useId()
  const videoRef = useRef<HTMLVideoElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const item = testimonials[activeIndex]
  const instagramEmbedUrl = useMemo(
    () =>
      !item?.videoUrl && item?.instagramUrl
        ? getInstagramReelEmbedUrl(item.instagramUrl)
        : null,
    [item?.instagramUrl, item?.videoUrl],
  )
  const usesInstagramEmbed = Boolean(instagramEmbedUrl)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (usesInstagramEmbed) return

    const video = videoRef.current
    if (!video || !item?.videoUrl) return

    video.currentTime = 0

    const playVideo = () => {
      void video.play().catch(() => {})
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playVideo()
      return
    }

    video.addEventListener('loadeddata', playVideo, { once: true })
    return () => video.removeEventListener('loadeddata', playVideo)
  }, [item?.videoUrl, activeIndex, usesInstagramEmbed])

  useEffect(() => {
    if (isClosing) {
      videoRef.current?.pause()
    }
  }, [isClosing])

  if (!item || (!item.videoUrl && !instagramEmbedUrl)) return null

  return (
    <div
      className={`testimonial-video-modal${isClosing ? ' testimonial-video-modal--closing' : ''}`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="testimonial-video-modal__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="testimonial-video-modal__close"
          aria-label="Close testimonial video"
          onClick={onClose}
        >
          {'\u2715'}
        </button>

        <h2 id={titleId} className="sr-only">
          Testimonial video from {item.name}
        </h2>

        {usesInstagramEmbed && instagramEmbedUrl ? (
          <iframe
            className="testimonial-video-modal__embed"
            src={instagramEmbedUrl}
            title={`Instagram testimonial from ${item.name}`}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video
            ref={videoRef}
            className="testimonial-video-modal__video"
            src={item.videoUrl}
            width={1080}
            height={1920}
            playsInline
            controls
            onEnded={onVideoEnded}
          />
        )}
      </div>
    </div>
  )
}

export { CLOSE_MS as TESTIMONIAL_VIDEO_MODAL_CLOSE_MS }
