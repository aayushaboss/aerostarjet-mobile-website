import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  PREVIEW_WIDTHS,
  appendPreviewParams,
  clearPreviewStorage,
  getPreviewBreakpoint,
  isPreviewDismissed,
  readPreviewStorage,
  setPreviewDismissed,
  writePreviewStorage,
  type PreviewBreakpoint,
} from '../utils/preview'

const DEFAULT_WIDTH = PREVIEW_WIDTHS.mobile

function normalizePreviewWidth(width: number) {
  return PREVIEW_WIDTHS[getPreviewBreakpoint(width)]
}

export function usePreview() {
  const [searchParams, setSearchParams] = useSearchParams()
  const storedPreview = readPreviewStorage()

  const urlPreview = searchParams.get('preview') === 'true'
  const isPreview = urlPreview || Boolean(storedPreview?.active)

  const previewWidth = useMemo(() => {
    if (urlPreview) {
      return normalizePreviewWidth(Number(searchParams.get('w') ?? DEFAULT_WIDTH))
    }
    return normalizePreviewWidth(storedPreview?.width ?? DEFAULT_WIDTH)
  }, [searchParams, storedPreview?.width, urlPreview])

  const activeBreakpoint = useMemo(
    () => getPreviewBreakpoint(previewWidth),
    [previewWidth],
  )

  const persistPreview = useCallback(
    (width: number) => {
      writePreviewStorage({ active: true, width })
    },
    [],
  )

  const setPreviewWidth = useCallback(
    (width: number) => {
      const normalizedWidth = normalizePreviewWidth(width)
      setPreviewDismissed(false)
      const next = new URLSearchParams(searchParams)
      next.set('preview', 'true')
      next.set('w', String(normalizedWidth))
      setSearchParams(next, { replace: true })
      persistPreview(normalizedWidth)
    },
    [persistPreview, searchParams, setSearchParams],
  )

  const enablePreview = useCallback(
    (width = DEFAULT_WIDTH) => {
      setPreviewWidth(width)
    },
    [setPreviewWidth],
  )

  const exitPreview = useCallback(() => {
    clearPreviewStorage()
    setPreviewDismissed(true)
    const next = new URLSearchParams(searchParams)
    next.delete('preview')
    next.delete('w')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const withPreview = useCallback(
    (path: string) => {
      if (!isPreview) return path
      return appendPreviewParams(path, previewWidth)
    },
    [isPreview, previewWidth],
  )

  const setPreviewBreakpoint = useCallback(
    (breakpoint: PreviewBreakpoint) => {
      setPreviewWidth(PREVIEW_WIDTHS[breakpoint])
    },
    [setPreviewWidth],
  )

  const restorePreviewInUrl = useCallback(() => {
    if (urlPreview) {
      const width = normalizePreviewWidth(Number(searchParams.get('w') ?? DEFAULT_WIDTH))
      const currentW = searchParams.get('w')

      if (!currentW || currentW !== String(width)) {
        const next = new URLSearchParams(searchParams)
        next.set('w', String(width))
        setSearchParams(next, { replace: true })
      }

      persistPreview(width)
      return
    }

    const stored = readPreviewStorage()
    if (stored?.active) {
      const width = normalizePreviewWidth(stored.width)
      const next = new URLSearchParams(searchParams)
      next.set('preview', 'true')
      next.set('w', String(width))
      setSearchParams(next, { replace: true })
      return
    }

    if (import.meta.env.DEV && !isPreviewDismissed()) {
      const next = new URLSearchParams(searchParams)
      next.set('preview', 'true')
      next.set('w', String(DEFAULT_WIDTH))
      setSearchParams(next, { replace: true })
      persistPreview(DEFAULT_WIDTH)
    }
  }, [persistPreview, searchParams, setSearchParams, urlPreview])

  return {
    activeBreakpoint,
    enablePreview,
    exitPreview,
    isPreview,
    previewWidth,
    restorePreviewInUrl,
    setPreviewBreakpoint,
    setPreviewWidth,
    withPreview,
  }
}
