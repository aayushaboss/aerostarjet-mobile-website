import { PREVIEW_WIDTHS, type PreviewBreakpoint } from '../../utils/preview'
import { usePreview } from '../../hooks/usePreview'

const PREVIEW_LABELS: Record<PreviewBreakpoint, string> = {
  mobile: 'Mobile 375px',
  tablet: 'Tablet 768px',
  desktop: 'Desktop 1200px',
}

const PREVIEW_BUTTONS: Record<PreviewBreakpoint, string> = {
  mobile: 'Mobile (375px)',
  tablet: 'Tablet (768px)',
  desktop: 'Desktop (1200px)',
}

export default function PreviewBar() {
  const { activeBreakpoint, exitPreview, isPreview, previewWidth, setPreviewBreakpoint } = usePreview()

  return (
    <div className="preview-bar" role="region" aria-label="Responsive preview controls">
      <div className="preview-bar__inner">
        <span className="preview-bar__label">
          {isPreview ? `Preview: ${PREVIEW_LABELS[activeBreakpoint]}` : 'Responsive preview'}
        </span>
        <div className="preview-bar__actions">
          {(Object.keys(PREVIEW_WIDTHS) as PreviewBreakpoint[]).map((breakpoint) => {
            const width = PREVIEW_WIDTHS[breakpoint]
            const isActive = isPreview && previewWidth === width

            return (
              <button
                key={breakpoint}
                type="button"
                className={`preview-bar__btn${isActive ? ' preview-bar__btn--active' : ''}`}
                onClick={() => setPreviewBreakpoint(breakpoint)}
              >
                {PREVIEW_BUTTONS[breakpoint]}
              </button>
            )
          })}
          {isPreview ? (
            <button type="button" className="preview-bar__btn preview-bar__btn--ghost" onClick={exitPreview}>
              Exit preview
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
