import { useEffect, useState } from 'react'

type GalleryImage = {
  src: string
  alt: string
}

type InfrastructureMasonryGalleryProps = {
  images: readonly GalleryImage[]
}

export default function InfrastructureMasonryGallery({ images }: InfrastructureMasonryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) =>
          index === null ? null : (index - 1 + images.length) % images.length,
        )
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index === null ? null : (index + 1) % images.length))
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, images.length])

  const activeImage = activeIndex === null ? null : images[activeIndex]

  return (
    <>
      <div className="infrastructure-gallery">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className="infrastructure-gallery__item block w-full cursor-pointer border-0 bg-transparent p-0"
            onClick={() => setActiveIndex(index)}
          >
            <div className="infrastructure-gallery__frame">
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            </div>
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/92 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            aria-label="Close image preview"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/12 text-lg text-surface"
            onClick={() => setActiveIndex(null)}
          >
            {'\u2715'}
          </button>

          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-3 inline-flex size-10 items-center justify-center rounded-full bg-white/12 text-lg text-surface"
            onClick={(event) => {
              event.stopPropagation()
              setActiveIndex((index) =>
                index === null ? null : (index - 1 + images.length) % images.length,
              )
            }}
          >
            {'\u2190'}
          </button>

          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            aria-label="Next image"
            className="absolute right-3 inline-flex size-10 items-center justify-center rounded-full bg-white/12 text-lg text-surface"
            onClick={(event) => {
              event.stopPropagation()
              setActiveIndex((index) => (index === null ? null : (index + 1) % images.length))
            }}
          >
            {'\u2192'}
          </button>
        </div>
      ) : null}
    </>
  )
}
