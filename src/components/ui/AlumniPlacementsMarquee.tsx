import type { AlumniPlacementPhoto } from '../../data/content'

type AlumniPlacementsMarqueeProps = {
  photos: readonly AlumniPlacementPhoto[]
}

function AlumniPlacementCard({
  photo,
  ariaHidden = false,
}: {
  photo: AlumniPlacementPhoto
  ariaHidden?: boolean
}) {
  return (
    <article className="alumni-placement-card">
      <div className="alumni-placement-card__media">
        <img
          className="alumni-placement-card__image"
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          aria-hidden={ariaHidden || undefined}
        />
      </div>
    </article>
  )
}

export default function AlumniPlacementsMarquee({ photos }: AlumniPlacementsMarqueeProps) {
  const loop = [...photos, ...photos]

  return (
    <div className="alumni-marquee-wrap">
      <div className="alumni-marquee-track">
        {loop.map((photo, index) => (
          <AlumniPlacementCard
            key={`${photo.id}-${index}`}
            photo={photo}
            ariaHidden={index >= photos.length}
          />
        ))}
      </div>
    </div>
  )
}
