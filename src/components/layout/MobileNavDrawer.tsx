import { useLocation } from 'react-router-dom'
import usePreviewNavigate from '../../hooks/usePreviewNavigate'
import { CloseIcon } from '../ui/NavIcons'
import { navLinks, isNavLinkActive } from '../../data/content'
import PreviewLink from './PreviewLink'
import { EnrollCtaLink } from '../ui/EnrollCtaButton'

type MobileNavDrawerProps = {
  open: boolean
  onClose: () => void
}

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const { pathname } = useLocation()
  const previewNavigate = usePreviewNavigate()

  if (!open) return null

  const goHome = () => {
    onClose()
    previewNavigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getDrawerLinkClassName = (href: string) =>
    `mobile-nav-drawer__link${isNavLinkActive(href, pathname) ? ' mobile-nav-drawer__link--active' : ''}`

  return (
    <>
      <div
        className="mobile-nav-backdrop fixed inset-0 z-[80] bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <nav className="mobile-nav-drawer fixed right-0 top-0 z-[90] flex h-full w-[min(320px,85vw)] flex-col bg-surface shadow-2xl">
        <div className="flex min-h-12 items-center justify-between border-b border-border px-4">
          <span className="text-body-sm font-semibold text-navy">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-12 items-center justify-center rounded-lg text-navy"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-1 flex-col py-2">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(link.href, pathname)

            if (link.href === '/') {
              return (
                <PreviewLink
                  key={link.label}
                  to="/"
                  onClick={(event) => {
                    event.preventDefault()
                    goHome()
                  }}
                  className={getDrawerLinkClassName(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </PreviewLink>
              )
            }

            return (
              <PreviewLink
                key={link.label}
                to={link.href}
                onClick={onClose}
                className={getDrawerLinkClassName(link.href)}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </PreviewLink>
            )
          })}
        </div>
        <div className="p-4">
          <EnrollCtaLink to="/apply" onClick={onClose}>
            Enroll Now
          </EnrollCtaLink>
        </div>
      </nav>
    </>
  )
}
