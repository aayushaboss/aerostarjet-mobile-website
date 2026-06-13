import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from 'react'
import type { Testimonial } from '../../data/content'
import { usePreview } from '../../hooks/usePreview'
import { testimonialHasVideo } from '../../utils/testimonialVideo'
import TestimonialVideoModal, {
  TESTIMONIAL_VIDEO_MODAL_CLOSE_MS,
} from './TestimonialVideoModal'

export type TestimonialCarouselNavigator = {
  goToIndex: (index: number) => void
  goToNext: (options?: { smooth?: boolean }) => void
}

const SNAP_MS = 360
const DRAG_THRESHOLD = 4
const SLIDE_COMMIT_RATIO = 0.12
const SCROLL_SETTLE_MS = 120
const STACK_DRAG_COMMIT = 72
const STACK_EXIT_MS = 380
const STACK_BACK_LAYERS = 3
const STACK_FLING_VELOCITY = 0.45
const AUTO_ADVANCE_MS = 520
const POST_MODAL_ADVANCE_DELAY_MS = 120
const AUTO_ADVANCE_DRAG_START = 56

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function getSlides(scroller: HTMLDivElement) {
  const row = scroller.querySelector('.testimonials-track-inner')
  if (!row) return [] as HTMLElement[]
  return Array.from(row.querySelectorAll('blockquote'))
}

function getSlideScrollTarget(scroller: HTMLDivElement, slide: HTMLElement) {
  const paddingLeft = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0
  const slideRect = slide.getBoundingClientRect()
  const scrollerRect = scroller.getBoundingClientRect()
  return scroller.scrollLeft + (slideRect.left - scrollerRect.left - paddingLeft)
}

function getSlideTargets(scroller: HTMLDivElement, slides: HTMLElement[]) {
  return slides.map((slide) => getSlideScrollTarget(scroller, slide))
}

function getIndexForScroll(targets: number[], scroll: number) {
  if (!targets.length) return 0

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
  const targets = getSlideTargets(scroller, slides)
  if (!targets.length) return 0
  return getIndexForScroll(targets, scroller.scrollLeft)
}

type TestimonialCardProps = {
  item: Testimonial
  index: number
  className?: string
  stacked?: boolean
  cardRef?: RefObject<HTMLQuoteElement | null>
  onOpen?: (index: number, trigger: HTMLElement) => void
  openOnClick?: boolean
}

function TestimonialCardShell() {
  return (
    <div
      className="testimonial-card-shell h-full min-h-full w-full rounded-lg border border-border-alt bg-surface shadow-md"
      aria-hidden
    />
  )
}

function TestimonialCard({
  item,
  index,
  className = '',
  stacked = false,
  cardRef,
  onOpen,
  openOnClick = true,
}: TestimonialCardProps) {
  const handleOpen = (trigger: HTMLElement) => {
    if (!testimonialHasVideo(item)) return
    onOpen?.(index, trigger)
  }

  return (
    <blockquote
      ref={cardRef}
      tabIndex={onOpen && testimonialHasVideo(item) ? 0 : undefined}
      role={onOpen && testimonialHasVideo(item) ? 'button' : undefined}
      aria-label={
        onOpen && testimonialHasVideo(item) ? `Play testimonial video from ${item.name}` : undefined
      }
      onKeyDown={(event) => {
        if (!onOpen || !testimonialHasVideo(item)) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleOpen(event.currentTarget)
        }
      }}
      onClick={(event) => {
        if (!openOnClick || !onOpen || !testimonialHasVideo(item)) return
        event.stopPropagation()
        handleOpen(event.currentTarget)
      }}
      className={`testimonial-card testimonial-card--interactive rounded-lg border border-border-alt bg-surface shadow-md ${
        stacked
          ? 'w-full select-none p-6'
          : 'w-[64vw] max-w-[210px] shrink-0 p-4'
      } ${className}`.trim()}
    >
      <div className="testimonial-card__video" aria-hidden="true">
        {item.videoUrl ? (
          <video
            className="testimonial-card__preview"
            src={item.videoUrl}
            poster={item.posterUrl}
            muted
            playsInline
            preload={item.posterUrl ? 'none' : 'metadata'}
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : null}
        <span className="testimonial-card__play" aria-hidden="true">
          ▶
        </span>
      </div>
      <div className="testimonial-card__meta">
        <p className={`font-semibold text-navy ${stacked ? 'text-sm' : 'text-[10px]'}`}>{item.name}</p>
        <p className={`text-muted-alt ${stacked ? 'text-xs' : 'text-[10px]'}`}>{item.role}</p>
      </div>
    </blockquote>
  )
}

type TestimonialsStackProps = {
  testimonials: Testimonial[]
  onOpenVideo?: (index: number, trigger: HTMLElement) => void
  onRegisterNavigator?: (navigator: TestimonialCarouselNavigator | null) => void
}

type StackExitDirection = 'next' | 'prev' | null

function TestimonialsStack({ testimonials, onOpenVideo, onRegisterNavigator }: TestimonialsStackProps) {
  const stackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [exitOpacity, setExitOpacity] = useState(1)
  const [exitDirection, setExitDirection] = useState<StackExitDirection>(null)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const [isPromoting, setIsPromoting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSmoothAdvancing, setIsSmoothAdvancing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const smoothAdvanceTimeoutRef = useRef<number | null>(null)
  const startX = useRef(0)
  const lastMoveX = useRef(0)
  const lastMoveTime = useRef(0)
  const velocityX = useRef(0)
  const activePointerId = useRef<number | null>(null)
  const count = testimonials.length

  const getExitDistance = useCallback((direction: 'next' | 'prev', velocity = 0) => {
    const width = stackRef.current?.offsetWidth ?? 400
    const velocityBoost = Math.min(Math.abs(velocity) * 280, 320)
    const distance = width * 1.55 + velocityBoost
    return direction === 'next' ? -distance : distance
  }, [])

  const snapBack = useCallback(() => {
    setIsAnimating(true)
    setDragX(0)
    setExitOpacity(1)
    window.setTimeout(() => setIsAnimating(false), STACK_EXIT_MS)
  }, [])

  const throwCard = useCallback(
    (
      direction: 'next' | 'prev',
      releaseDelta: number,
      velocity = 0,
      targetIndex?: number,
    ) => {
      if (isAnimating || count === 0) return

      const nextIndex =
        targetIndex ?? (direction === 'next' ? activeIndex + 1 : activeIndex - 1)
      const normalizedIndex = ((nextIndex % count) + count) % count
      const exitX = getExitDistance(direction, velocity)

      setIsAnimating(true)
      setExitDirection(direction)
      setExitingIndex(activeIndex)
      setIsPromoting(direction === 'next')
      setDragX(releaseDelta)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDragX(exitX)
          setExitOpacity(0)
        })
      })

      window.setTimeout(() => {
        setIsResetting(true)
        setActiveIndex(normalizedIndex)
        setExitingIndex(null)
        setDragX(0)
        setExitOpacity(1)
        setExitDirection(null)
        setIsPromoting(false)
        setIsAnimating(false)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsResetting(false)
          })
        })
      }, STACK_EXIT_MS)
    },
    [activeIndex, count, getExitDistance, isAnimating],
  )

  const completeThrow = useCallback((normalizedIndex: number) => {
    setIsResetting(true)
    setActiveIndex(normalizedIndex)
    setExitingIndex(null)
    setDragX(0)
    setExitOpacity(1)
    setExitDirection(null)
    setIsPromoting(false)
    setIsSmoothAdvancing(false)
    setIsAnimating(false)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsResetting(false)
      })
    })
  }, [])

  const throwCardSmooth = useCallback(
    (direction: 'next' | 'prev', targetIndex?: number) => {
      if (isAnimating || count === 0) return

      const nextIndex =
        targetIndex ?? (direction === 'next' ? activeIndex + 1 : activeIndex - 1)
      const normalizedIndex = ((nextIndex % count) + count) % count
      const exitX = getExitDistance(direction, 0)
      const startDrag = direction === 'next' ? -AUTO_ADVANCE_DRAG_START : AUTO_ADVANCE_DRAG_START

      setIsAnimating(true)
      setIsSmoothAdvancing(true)
      setExitDirection(direction)
      setExitingIndex(activeIndex)
      setIsPromoting(direction === 'next')
      setDragX(startDrag)
      setExitOpacity(Math.max(0.35, 1 - Math.abs(startDrag) / 420))

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDragX(exitX)
          setExitOpacity(0)
        })
      })

      if (smoothAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(smoothAdvanceTimeoutRef.current)
      }

      smoothAdvanceTimeoutRef.current = window.setTimeout(() => {
        smoothAdvanceTimeoutRef.current = null
        completeThrow(normalizedIndex)
      }, AUTO_ADVANCE_MS)
    },
    [activeIndex, completeThrow, count, getExitDistance, isAnimating],
  )

  const goToIndex = useCallback(
    (index: number) => {
      if (index === activeIndex || isAnimating || count === 0) return

      const forward = (index - activeIndex + count) % count
      const backward = (activeIndex - index + count) % count
      const direction = forward <= backward ? 'next' : 'prev'
      throwCard(direction, 0, 0, index)
    },
    [activeIndex, count, isAnimating, throwCard],
  )

  const goToNext = useCallback(
    (options?: { smooth?: boolean }) => {
      if (activeIndex >= count - 1 || isAnimating || count === 0) return
      if (options?.smooth) {
        throwCardSmooth('next', activeIndex + 1)
        return
      }
      throwCard('next', 0, 0, activeIndex + 1)
    },
    [activeIndex, count, isAnimating, throwCard, throwCardSmooth],
  )

  useEffect(() => {
    onRegisterNavigator?.({ goToIndex, goToNext })
    return () => {
      if (smoothAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(smoothAdvanceTimeoutRef.current)
      }
      onRegisterNavigator?.(null)
    }
  }, [goToIndex, goToNext, onRegisterNavigator])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating || event.button !== 0) return
    isDraggingRef.current = true
    setIsDragging(true)
    activePointerId.current = event.pointerId
    startX.current = event.clientX
    lastMoveX.current = event.clientX
    lastMoveTime.current = performance.now()
    velocityX.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || activePointerId.current !== event.pointerId || isAnimating) return
    const delta = event.clientX - startX.current
    if (Math.abs(delta) <= DRAG_THRESHOLD) return
    event.preventDefault()

    const now = performance.now()
    const elapsed = now - lastMoveTime.current
    if (elapsed > 0) {
      velocityX.current = (event.clientX - lastMoveX.current) / elapsed
    }
    lastMoveX.current = event.clientX
    lastMoveTime.current = now

    setDragX(delta)
    setExitOpacity(Math.max(0.35, 1 - Math.abs(delta) / 420))
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || activePointerId.current !== event.pointerId) return
    isDraggingRef.current = false
    setIsDragging(false)
    activePointerId.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const delta = event.clientX - startX.current
    const velocity = velocityX.current

    if (
      Math.abs(delta) <= DRAG_THRESHOLD &&
      Math.abs(velocity) < STACK_FLING_VELOCITY &&
      onOpenVideo
    ) {
      const card = event.currentTarget.querySelector('.testimonial-card')
      if (card instanceof HTMLElement) {
        onOpenVideo(activeIndex, card)
      }
      return
    }

    if (delta <= -STACK_DRAG_COMMIT || velocity <= -STACK_FLING_VELOCITY) {
      throwCard('next', delta, velocity)
      return
    }
    if (delta >= STACK_DRAG_COMMIT || velocity >= STACK_FLING_VELOCITY) {
      throwCard('prev', delta, velocity)
      return
    }
    snapBack()
  }

  useEffect(() => {
    setActiveIndex(0)
    setDragX(0)
    setExitOpacity(1)
    setExitDirection(null)
    setExitingIndex(null)
    setIsPromoting(false)
    setIsResetting(false)
  }, [count])

  if (!count) return null

  const topRotate = isSmoothAdvancing
    ? dragX * 0.04
    : exitDirection === 'next'
      ? -22
      : exitDirection === 'prev'
        ? 22
        : dragX * 0.04
  const incomingIndex =
    exitDirection === 'prev' ? (activeIndex - 1 + count) % count : null
  const topIndex = exitingIndex ?? activeIndex

  return (
    <div className="testimonials-stack-wrap select-none [&_*]:select-none">
      <div
        ref={stackRef}
        className={`testimonials-stack${isPromoting ? ' testimonials-stack--promoting' : ''}${isSmoothAdvancing ? ' testimonials-stack--smooth-advancing' : ''}${isResetting ? ' testimonials-stack--resetting' : ''}`}
        role="region"
        aria-label="Student testimonials"
        aria-roledescription="stacked carousel"
      >
        {Array.from({ length: STACK_BACK_LAYERS }, (_, layerIndex) => {
          const layer = layerIndex + 1
          const item = testimonials[(activeIndex + layer) % count]
          return (
            <div
              key={`back-${item.name}-${layer}-${activeIndex}`}
              className="testimonials-stack__layer"
              data-layer={layer}
              style={
                {
                  '--stack-layer': layer,
                } as CSSProperties
              }
              aria-hidden
            >
              {isPromoting && layer === 1 ? (
                <TestimonialCard item={item} index={(activeIndex + layer) % count} stacked />
              ) : (
                <TestimonialCardShell />
              )}
            </div>
          )
        })}

        {incomingIndex !== null ? (
          <div className="testimonials-stack__incoming" aria-hidden>
            <TestimonialCard item={testimonials[incomingIndex]} index={incomingIndex} stacked />
          </div>
        ) : null}

        <div
          className={`testimonials-stack__top${isDragging ? ' testimonials-stack__top--dragging' : ''}${exitDirection ? ' testimonials-stack__top--exiting' : ''}${isSmoothAdvancing ? ' testimonials-stack__top--smooth-advancing' : ''}${isResetting ? ' testimonials-stack__top--resetting' : ''}`}
          style={{
            transform: `translateX(${dragX}px) rotate(${topRotate}deg)`,
            opacity: exitOpacity,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <TestimonialCard
            item={testimonials[topIndex]}
            index={topIndex}
            stacked
            openOnClick={false}
            onOpen={onOpenVideo}
          />
        </div>
      </div>

      <div
        className="carousel-dots flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Testimonial stack pagination"
      >
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Testimonial ${index + 1} of ${count}`}
            onClick={() => {
              if (index === activeIndex || isAnimating) return
              setActiveIndex(index)
              setDragX(0)
            }}
            className={`size-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary-alt' : 'bg-border-alt'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

type TestimonialsCarouselProps = {
  testimonials: Testimonial[]
  onOpenVideo?: (index: number, trigger: HTMLElement) => void
  onRegisterNavigator?: (navigator: TestimonialCarouselNavigator | null) => void
}

type FadeExitDirection = 'next' | 'prev' | null

function useTestimonialsFadeMode() {
  const { isPreview, previewWidth } = usePreview()
  const [matchesViewport, setMatchesViewport] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(min-width: 768px)').matches
  })

  useEffect(() => {
    if (isPreview) return

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const update = () => setMatchesViewport(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [isPreview])

  if (isPreview) return previewWidth >= 768
  return matchesViewport
}

function TestimonialsFadeCarousel({
  testimonials,
  onOpenVideo,
  onRegisterNavigator,
}: TestimonialsCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [exitOpacity, setExitOpacity] = useState(1)
  const [exitDirection, setExitDirection] = useState<FadeExitDirection>(null)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSmoothAdvancing, setIsSmoothAdvancing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const smoothAdvanceTimeoutRef = useRef<number | null>(null)
  const startX = useRef(0)
  const lastMoveX = useRef(0)
  const lastMoveTime = useRef(0)
  const velocityX = useRef(0)
  const activePointerId = useRef<number | null>(null)
  const count = testimonials.length

  const getExitDistance = useCallback((direction: 'next' | 'prev', velocity = 0) => {
    const width = stageRef.current?.offsetWidth ?? 400
    const velocityBoost = Math.min(Math.abs(velocity) * 280, 320)
    const distance = width * 1.15 + velocityBoost
    return direction === 'next' ? -distance : distance
  }, [])

  const snapBack = useCallback(() => {
    setIsAnimating(true)
    setDragX(0)
    setExitOpacity(1)
    window.setTimeout(() => setIsAnimating(false), STACK_EXIT_MS)
  }, [])

  const throwCard = useCallback(
    (
      direction: 'next' | 'prev',
      releaseDelta: number,
      velocity = 0,
      targetIndex?: number,
    ) => {
      if (isAnimating || count === 0) return

      const nextIndex =
        targetIndex ?? (direction === 'next' ? activeIndex + 1 : activeIndex - 1)
      const normalizedIndex = ((nextIndex % count) + count) % count
      const exitX = getExitDistance(direction, velocity)

      setIsAnimating(true)
      setExitDirection(direction)
      setExitingIndex(activeIndex)
      setIncomingIndex(normalizedIndex)
      setDragX(releaseDelta)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDragX(exitX)
          setExitOpacity(0)
        })
      })

      window.setTimeout(() => {
        setIsResetting(true)
        setActiveIndex(normalizedIndex)
        setExitingIndex(null)
        setIncomingIndex(null)
        setDragX(0)
        setExitOpacity(1)
        setExitDirection(null)
        setIsAnimating(false)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsResetting(false)
          })
        })
      }, STACK_EXIT_MS)
    },
    [activeIndex, count, getExitDistance, isAnimating],
  )

  const completeThrow = useCallback((normalizedIndex: number) => {
    setIsResetting(true)
    setActiveIndex(normalizedIndex)
    setExitingIndex(null)
    setIncomingIndex(null)
    setDragX(0)
    setExitOpacity(1)
    setExitDirection(null)
    setIsSmoothAdvancing(false)
    setIsAnimating(false)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsResetting(false)
      })
    })
  }, [])

  const throwCardSmooth = useCallback(
    (direction: 'next' | 'prev', targetIndex?: number) => {
      if (isAnimating || count === 0) return

      const nextIndex =
        targetIndex ?? (direction === 'next' ? activeIndex + 1 : activeIndex - 1)
      const normalizedIndex = ((nextIndex % count) + count) % count
      const exitX = getExitDistance(direction, 0)
      const startDrag = direction === 'next' ? -AUTO_ADVANCE_DRAG_START : AUTO_ADVANCE_DRAG_START

      setIsAnimating(true)
      setIsSmoothAdvancing(true)
      setExitDirection(direction)
      setExitingIndex(activeIndex)
      setIncomingIndex(normalizedIndex)
      setDragX(startDrag)
      setExitOpacity(Math.max(0.35, 1 - Math.abs(startDrag) / 420))

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDragX(exitX)
          setExitOpacity(0)
        })
      })

      if (smoothAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(smoothAdvanceTimeoutRef.current)
      }

      smoothAdvanceTimeoutRef.current = window.setTimeout(() => {
        smoothAdvanceTimeoutRef.current = null
        completeThrow(normalizedIndex)
      }, AUTO_ADVANCE_MS)
    },
    [activeIndex, completeThrow, count, getExitDistance, isAnimating],
  )

  const goToIndex = useCallback(
    (index: number) => {
      if (index === activeIndex || isAnimating || count === 0) return

      const forward = (index - activeIndex + count) % count
      const backward = (activeIndex - index + count) % count
      const direction = forward <= backward ? 'next' : 'prev'
      throwCard(direction, 0, 0, index)
    },
    [activeIndex, count, isAnimating, throwCard],
  )

  const goToNext = useCallback(
    (options?: { smooth?: boolean }) => {
      if (activeIndex >= count - 1 || isAnimating || count === 0) return
      if (options?.smooth) {
        throwCardSmooth('next', activeIndex + 1)
        return
      }
      throwCard('next', 0, 0, activeIndex + 1)
    },
    [activeIndex, count, isAnimating, throwCard, throwCardSmooth],
  )

  useEffect(() => {
    onRegisterNavigator?.({ goToIndex, goToNext })
    return () => {
      if (smoothAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(smoothAdvanceTimeoutRef.current)
      }
      onRegisterNavigator?.(null)
    }
  }, [goToIndex, goToNext, onRegisterNavigator])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimating || event.button !== 0) return
    isDraggingRef.current = true
    setIsDragging(true)
    activePointerId.current = event.pointerId
    startX.current = event.clientX
    lastMoveX.current = event.clientX
    lastMoveTime.current = performance.now()
    velocityX.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || activePointerId.current !== event.pointerId || isAnimating) {
      return
    }

    const delta = event.clientX - startX.current
    if (Math.abs(delta) <= DRAG_THRESHOLD) return
    event.preventDefault()

    const now = performance.now()
    const elapsed = now - lastMoveTime.current
    if (elapsed > 0) {
      velocityX.current = (event.clientX - lastMoveX.current) / elapsed
    }
    lastMoveX.current = event.clientX
    lastMoveTime.current = now

    setDragX(delta)
    setExitOpacity(Math.max(0.35, 1 - Math.abs(delta) / 420))
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || activePointerId.current !== event.pointerId) return
    isDraggingRef.current = false
    setIsDragging(false)
    activePointerId.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const delta = event.clientX - startX.current
    const velocity = velocityX.current

    if (
      Math.abs(delta) <= DRAG_THRESHOLD &&
      Math.abs(velocity) < STACK_FLING_VELOCITY &&
      onOpenVideo
    ) {
      const card = event.currentTarget.querySelector('.testimonial-card')
      if (card instanceof HTMLElement) {
        onOpenVideo(activeIndex, card)
      }
      return
    }

    if (delta <= -STACK_DRAG_COMMIT || velocity <= -STACK_FLING_VELOCITY) {
      throwCard('next', delta, velocity)
      return
    }
    if (delta >= STACK_DRAG_COMMIT || velocity >= STACK_FLING_VELOCITY) {
      throwCard('prev', delta, velocity)
      return
    }
    snapBack()
  }

  useEffect(() => {
    setActiveIndex(0)
    setDragX(0)
    setExitOpacity(1)
    setExitDirection(null)
    setExitingIndex(null)
    setIncomingIndex(null)
    setIsResetting(false)
  }, [count])

  if (!count) return null

  const topRotate = isSmoothAdvancing
    ? dragX * 0.02
    : exitDirection === 'next'
      ? -8
      : exitDirection === 'prev'
        ? 8
        : dragX * 0.02
  const topIndex = exitingIndex ?? activeIndex
  const stageWidth = stageRef.current?.offsetWidth ?? 400
  const peekIndex =
    isSmoothAdvancing && incomingIndex !== null
      ? incomingIndex
      : isDragging && !exitDirection
        ? dragX < -DRAG_THRESHOLD
          ? (activeIndex + 1) % count
          : dragX > DRAG_THRESHOLD
            ? (activeIndex - 1 + count) % count
            : null
        : null

  return (
    <div className="testimonials-stack-wrap testimonials-fade-wrap select-none [&_*]:select-none">
      <div
        ref={stageRef}
        className={`testimonials-fade-stage${isResetting ? ' testimonials-fade-stage--resetting' : ''}${isSmoothAdvancing ? ' testimonials-fade-stage--smooth-advancing' : ''}`}
        role="region"
        aria-label="Student testimonials"
        aria-roledescription="carousel"
      >
        {incomingIndex !== null && !isSmoothAdvancing ? (
          <div
            className={`testimonials-fade-incoming${
              exitDirection === 'next'
                ? ' testimonials-fade-incoming--from-right'
                : ' testimonials-fade-incoming--from-left'
            }`}
            aria-hidden
          >
            <TestimonialCard item={testimonials[incomingIndex]} index={incomingIndex} stacked />
          </div>
        ) : null}

        {peekIndex !== null ? (
          <div
            className="testimonials-fade-peek"
            style={{
              transform: `translateX(${
                dragX < 0
                  ? `calc(100% + ${Math.max(dragX, -stageWidth)}px)`
                  : `calc(-100% + ${Math.min(dragX, stageWidth)}px)`
              })`,
              opacity: Math.min(1, Math.abs(dragX) / 120),
            }}
            aria-hidden
          >
            <TestimonialCard item={testimonials[peekIndex]} index={peekIndex} stacked />
          </div>
        ) : null}

        <div
          className={`testimonials-fade-top${isDragging ? ' testimonials-fade-top--dragging' : ''}${exitDirection ? ' testimonials-fade-top--exiting' : ''}${isSmoothAdvancing ? ' testimonials-fade-top--smooth-advancing' : ''}${isResetting ? ' testimonials-fade-top--resetting' : ''}`}
          style={{
            transform: `translateX(${dragX}px) rotate(${topRotate}deg)`,
            opacity: exitOpacity,
          }}
          aria-live="polite"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <TestimonialCard
            item={testimonials[topIndex]}
            index={topIndex}
            stacked
            openOnClick={false}
            onOpen={onOpenVideo}
          />
        </div>
      </div>

      <div
        className="carousel-dots flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Testimonial carousel pagination"
      >
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Testimonial ${index + 1} of ${count}`}
            onClick={() => goToIndex(index)}
            disabled={isAnimating}
            className={`size-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary-alt' : 'bg-border-alt'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const useFadeCarousel = useTestimonialsFadeMode()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const carouselNavRef = useRef<TestimonialCarouselNavigator | null>(null)
  const openTriggerRef = useRef<HTMLElement | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)
  const hasDragged = useRef(false)
  const activePointerId = useRef<number | null>(null)
  const animationFrame = useRef<number | null>(null)

  const registerNavigator = useCallback((navigator: TestimonialCarouselNavigator | null) => {
    carouselNavRef.current = navigator
  }, [])

  const openVideo = useCallback((index: number, trigger: HTMLElement) => {
    openTriggerRef.current = trigger
    setModalIndex(index)
    carouselNavRef.current?.goToIndex(index)
  }, [])

  const closeVideo = useCallback((options?: { advanceAfterClose?: boolean }) => {
    const endedIndex = modalIndex
    setIsModalClosing(true)
    window.setTimeout(() => {
      setModalIndex(null)
      setIsModalClosing(false)

      if (
        options?.advanceAfterClose &&
        endedIndex !== null &&
        endedIndex < testimonials.length - 1
      ) {
        window.setTimeout(() => {
          carouselNavRef.current?.goToNext({ smooth: true })
        }, POST_MODAL_ADVANCE_DELAY_MS)
        return
      }

      openTriggerRef.current?.focus()
    }, TESTIMONIAL_VIDEO_MODAL_CLOSE_MS)
  }, [modalIndex, testimonials.length])

  const handleVideoEnded = useCallback(() => {
    if (modalIndex === null) return

    if (modalIndex >= testimonials.length - 1) {
      closeVideo()
      return
    }

    closeVideo({ advanceAfterClose: true })
  }, [closeVideo, modalIndex, testimonials.length])

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
    const target = getSlideScrollTarget(scroller, slides[clampedIndex])
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
    const target = getSlideScrollTarget(scroller, slides[index])

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
    const step = targets.length > 1 ? targets[1] - targets[0] : slides[0].offsetWidth

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

    const onResize = () => {
      snapToNearest(scroller)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(scroller)

    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    scroller.addEventListener('scroll', scheduleSnap, { passive: true })
    scroller.addEventListener('scrollend', onScrollEnd)

    return () => {
      if (settleTimeout) clearTimeout(settleTimeout)
      resizeObserver.disconnect()
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('scroll', scheduleSnap)
      scroller.removeEventListener('scrollend', onScrollEnd)
      cancelAnimation()
    }
  }, [testimonials.length])

  return (
    <>
      <div className="testimonials-carousel-wrap -mx-4 overflow-x-hidden">
        <div
          ref={scrollRef}
          role="region"
          aria-label="Student testimonials"
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
          className="testimonials-carousel w-full min-w-0 cursor-grab overflow-x-auto overscroll-x-contain scroll-pl-5 pl-5 scrollbar-hide touch-pan-x select-none [&_*]:[webkit-user-drag:none]"
        >
          <div className="testimonials-track-inner flex w-max flex-nowrap gap-3 pr-5 after:block after:w-5 after:shrink-0">
            {testimonials.map((item, index) => (
              <TestimonialCard key={item.name} item={item} index={index} onOpen={openVideo} />
            ))}
          </div>
        </div>
        <div
          className="carousel-dots flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Testimonial carousel pagination"
        >
          {testimonials.map((item, index) => (
            <span
              key={item.name}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
              className={`size-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-primary-alt' : 'bg-border-alt'
              }`}
            />
          ))}
        </div>
      </div>

      {useFadeCarousel ? (
        <TestimonialsFadeCarousel
          testimonials={testimonials}
          onOpenVideo={openVideo}
          onRegisterNavigator={registerNavigator}
        />
      ) : (
        <TestimonialsStack
          testimonials={testimonials}
          onOpenVideo={openVideo}
          onRegisterNavigator={registerNavigator}
        />
      )}

      {modalIndex !== null ? (
        <TestimonialVideoModal
          testimonials={testimonials}
          activeIndex={modalIndex}
          isClosing={isModalClosing}
          returnFocusRef={openTriggerRef}
          onClose={closeVideo}
          onVideoEnded={handleVideoEnded}
        />
      ) : null}
    </>
  )
}
