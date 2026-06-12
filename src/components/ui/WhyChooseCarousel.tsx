import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { WhyChooseItem } from '../../data/content'

const SNAP_MS = 360
const DRAG_THRESHOLD = 4
const SLIDE_COMMIT_RATIO = 0.12
const SCROLL_SETTLE_MS = 120

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

type WhyChooseCardProps = {
  item: WhyChooseItem
  className?: string
  compact?: boolean
}

function WhyChooseCard({ item, className = '', compact = false }: WhyChooseCardProps) {
  return (
    <article
      className={`why-choose-card rounded-2xl border border-white/16 bg-white/8 ${
        compact ? 'why-choose-card--compact p-4' : 'p-6'
      } ${className}`.trim()}
    >
      <div
        className={`why-choose-card__icon flex shrink-0 items-center justify-center rounded-xl bg-accent ${
          compact ? 'size-11' : 'size-14 rounded-2xl'
        }`}
      >
        <img alt="" className={compact ? 'size-5' : 'size-6'} aria-hidden src={item.icon} />
      </div>
      <div className="why-choose-card__body">
        <h4
          className={`why-choose-card__title font-bold text-surface ${
            compact ? 'text-sm leading-snug' : 'text-heading-md'
          }`}
        >
          {item.title[0]}
          <br />
          {item.title[1]}
        </h4>
        <p
          className={`why-choose-card__description text-white/82 ${
            compact ? 'text-[11px] leading-relaxed' : 'text-description'
          }`}
        >
          {item.description}
        </p>
      </div>
    </article>
  )
}

function getSlides(scroller: HTMLDivElement) {
  const row = scroller.querySelector('.why-choose-track-inner')
  if (!row) return [] as HTMLElement[]
  return Array.from(row.querySelectorAll<HTMLElement>('.why-choose-carousel__slide'))
}

function getSlideWidth(scroller: HTMLDivElement) {
  const styles = getComputedStyle(scroller)
  const width = Number.parseFloat(styles.getPropertyValue('--why-choose-slide-width'))
  if (Number.isFinite(width) && width > 0) return width

  const paddingInline =
    (Number.parseFloat(styles.paddingLeft) || 0) + (Number.parseFloat(styles.paddingRight) || 0)
  return Math.max(0, scroller.clientWidth - paddingInline)
}

function getSlideGap(scroller: HTMLDivElement) {
  const row = scroller.querySelector('.why-choose-track-inner')
  if (!row) return 0

  const styles = getComputedStyle(row)
  const gap = Number.parseFloat(styles.columnGap || styles.gap)
  return Number.isFinite(gap) ? gap : 0
}

function getSlideStep(scroller: HTMLDivElement) {
  return getSlideWidth(scroller) + getSlideGap(scroller)
}

function getSlideScrollTarget(scroller: HTMLDivElement, slideIndex: number) {
  return slideIndex * getSlideStep(scroller)
}

function getSlideTargets(scroller: HTMLDivElement, slides: HTMLElement[]) {
  return slides.map((_slide, index) => getSlideScrollTarget(scroller, index))
}

function getIndexForScroll(targets: number[], scroll: number) {
  if (targets.length <= 1) return 0

  let activeIndex = 0
  let minDistance = Infinity

  targets.forEach((target, index) => {
    const distance = Math.abs(target - scroll)
    if (distance < minDistance) {
      minDistance = distance
      activeIndex = index
    }
  })

  return activeIndex
}

function getActiveIndex(scroller: HTMLDivElement) {
  const slides = getSlides(scroller)
  if (!slides.length) return 0

  const step = getSlideStep(scroller)
  if (step <= 0) return 0

  return Math.max(0, Math.min(slides.length - 1, Math.round(scroller.scrollLeft / step)))
}

type WhyChooseCarouselProps = {
  items: WhyChooseItem[]
}

export default function WhyChooseCarousel({ items }: WhyChooseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)
  const hasDragged = useRef(false)
  const activePointerId = useRef<number | null>(null)
  const animationFrame = useRef<number | null>(null)

  const cancelAnimation = () => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
  }

  const animateToIndex = (scroller: HTMLDivElement, index: number) => {
    const slides = getSlides(scroller)
    if (!slides.length) return

    const clampedIndex = Math.max(0, Math.min(index, slides.length - 1))
    const target = getSlideScrollTarget(scroller, clampedIndex)
    const from = scroller.scrollLeft
    const distance = target - from

    if (Math.abs(distance) < 1) {
      scroller.scrollLeft = target
      setActiveIndex(clampedIndex)
      return
    }

    cancelAnimation()
    scroller.dataset.animating = 'true'

    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / SNAP_MS, 1)
      scroller.scrollLeft = from + distance * easeOutCubic(progress)

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step)
        return
      }

      scroller.scrollLeft = target
      delete scroller.dataset.animating
      animationFrame.current = null
      setActiveIndex(clampedIndex)
    }

    animationFrame.current = requestAnimationFrame(step)
  }

  const snapToNearest = (scroller: HTMLDivElement) => {
    if (scroller.dataset.animating === 'true' || scroller.dataset.dragging === 'true') return

    const slides = getSlides(scroller)
    if (!slides.length) return

    const index = getActiveIndex(scroller)
    const target = getSlideScrollTarget(scroller, index)

    if (Math.abs(scroller.scrollLeft - target) > 1) {
      animateToIndex(scroller, index)
      return
    }

    setActiveIndex(index)
  }

  const settleAfterDrag = (scroller: HTMLDivElement) => {
    const slides = getSlides(scroller)
    if (!slides.length) return

    const targets = getSlideTargets(scroller, slides)
    const scrollStart = scrollLeftStart.current
    const scrollEnd = scroller.scrollLeft
    const dragDistance = scrollEnd - scrollStart
    const startIndex = getIndexForScroll(targets, scrollStart)
    const step = getSlideStep(scroller)

    let index: number

    if (Math.abs(dragDistance) >= step * SLIDE_COMMIT_RATIO) {
      index = startIndex + (dragDistance > 0 ? 1 : -1)
    } else {
      index = getIndexForScroll(targets, scrollEnd)
    }

    index = Math.max(0, Math.min(index, slides.length - 1))
    animateToIndex(scroller, index)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollRef.current
    if (!scroller || event.button !== 0) return

    cancelAnimation()
    delete scroller.dataset.animating

    isDragging.current = true
    hasDragged.current = false
    activePointerId.current = event.pointerId
    startX.current = event.clientX
    scrollLeftStart.current = scroller.scrollLeft
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollRef.current
    if (!isDragging.current || !scroller || activePointerId.current !== event.pointerId) return

    const delta = event.clientX - startX.current

    if (Math.abs(delta) <= DRAG_THRESHOLD) return

    if (!hasDragged.current) {
      hasDragged.current = true
      scroller.setPointerCapture(event.pointerId)
      scroller.dataset.dragging = 'true'
    }

    event.preventDefault()

    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
    scroller.scrollLeft = Math.max(0, Math.min(scrollLeftStart.current - delta, maxScroll))
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollRef.current
    if (!isDragging.current || !scroller || activePointerId.current !== event.pointerId) return

    isDragging.current = false
    activePointerId.current = null
    delete scroller.dataset.dragging

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId)
    }

    if (hasDragged.current) {
      settleAfterDrag(scroller)
    }
  }

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return

    scroller.scrollLeft = 0
    setActiveIndex(0)

    let settleTimeout: ReturnType<typeof setTimeout> | undefined

    const onScroll = () => {
      if (scroller.dataset.animating === 'true') return
      setActiveIndex(getActiveIndex(scroller))
    }

    const scheduleSnap = () => {
      if (scroller.dataset.animating === 'true' || scroller.dataset.dragging === 'true') return
      if (settleTimeout) clearTimeout(settleTimeout)
      settleTimeout = setTimeout(() => snapToNearest(scroller), SCROLL_SETTLE_MS)
    }

    const onScrollEnd = () => {
      if (settleTimeout) clearTimeout(settleTimeout)
      snapToNearest(scroller)
    }

    const syncSlideWidth = () => {
      if (scroller.dataset.dragging === 'true' || scroller.dataset.animating === 'true') return

      const styles = getComputedStyle(scroller)
      const paddingInline =
        (Number.parseFloat(styles.paddingLeft) || 0) + (Number.parseFloat(styles.paddingRight) || 0)
      const contentWidth = Math.max(0, scroller.clientWidth - paddingInline)

      scroller.style.setProperty('--why-choose-slide-width', `${contentWidth}px`)

      const slides = getSlides(scroller)
      if (!slides.length) return

      const index = Math.max(0, Math.min(getActiveIndex(scroller), slides.length - 1))
      scroller.scrollLeft = getSlideScrollTarget(scroller, index)
      setActiveIndex(index)
    }

    const onResize = () => {
      syncSlideWidth()
    }

    syncSlideWidth()
    onScroll()

    const resizeObserver = new ResizeObserver(() => {
      syncSlideWidth()
    })
    resizeObserver.observe(scroller)
    scroller.addEventListener('scroll', onScroll, { passive: true })
    scroller.addEventListener('scroll', scheduleSnap, { passive: true })
    scroller.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('resize', onResize)

    return () => {
      if (settleTimeout) clearTimeout(settleTimeout)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('scroll', scheduleSnap)
      scroller.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('resize', onResize)
      resizeObserver.disconnect()
      cancelAnimation()
    }
  }, [items.length])

  const loop = [...items, ...items]

  return (
    <>
      <div className="why-choose-carousel-wrap">
        <div className="overflow-x-hidden">
          <div
            ref={scrollRef}
            role="region"
            aria-label="Why choose Aerostar features"
            aria-roledescription="carousel"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(event) => {
              if (hasDragged.current) {
                event.preventDefault()
                event.stopPropagation()
                hasDragged.current = false
              }
            }}
            className="why-choose-carousel w-full min-w-0 cursor-grab overflow-x-hidden overflow-y-hidden overscroll-x-contain scrollbar-hide touch-pan-x select-none [&_*]:[webkit-user-drag:none] [&_img]:pointer-events-none"
          >
            <div className="why-choose-track-inner flex w-max flex-nowrap">
              {items.map((item) => (
                <div key={item.title.join(' ')} className="why-choose-carousel__slide shrink-0">
                  <WhyChooseCard item={item} compact className="why-choose-carousel__card" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="carousel-dots flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Feature carousel pagination"
        >
          {items.map((item, index) => (
            <span
              key={item.title.join(' ')}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Feature ${index + 1} of ${items.length}`}
              className={`size-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-[#FFC629]' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="why-choose-marquee-wrap overflow-hidden">
        <div className="why-choose-marquee-track">
          <div className="scroll-row animate-why-choose-marquee flex w-max flex-nowrap gap-4 px-4">
            {loop.map((item, index) => (
              <WhyChooseCard
                key={`${item.title.join(' ')}-${index}`}
                item={item}
                compact
                className="why-choose-marquee-card w-[17rem] max-w-[17rem] shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
