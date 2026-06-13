import { useLayoutEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { PREVIEW_WIDTHS } from '../../utils/preview'
import { usePreview } from '../../hooks/usePreview'
import PreviewBar from './PreviewBar'

type PreviewShellProps = {
  children: ReactNode
}

export default function PreviewShell({ children }: PreviewShellProps) {
  const location = useLocation()
  const { isPreview, previewWidth, activeBreakpoint, restorePreviewInUrl } = usePreview()
  const showDevControls = import.meta.env.DEV

  useLayoutEffect(() => {
    restorePreviewInUrl()
  }, [location.pathname, location.search, restorePreviewInUrl])

  useLayoutEffect(() => {
    if (!isPreview) {
      delete document.documentElement.dataset.preview
      delete document.documentElement.dataset.previewWidth
      return
    }

    document.documentElement.dataset.preview = 'true'
    document.documentElement.dataset.previewWidth = String(PREVIEW_WIDTHS[activeBreakpoint])
  }, [isPreview, activeBreakpoint])

  if (!isPreview) {
    return (
      <div className={showDevControls ? 'preview-shell preview-shell--bar-only' : undefined}>
        {showDevControls ? <PreviewBar /> : null}
        {children}
      </div>
    )
  }

  return (
    <div className="preview-canvas">
      {showDevControls ? <PreviewBar /> : null}
      <div
        className="preview-frame"
        style={{ width: '100%', maxWidth: `${previewWidth}px` }}
      >
        {children}
      </div>
    </div>
  )
}
