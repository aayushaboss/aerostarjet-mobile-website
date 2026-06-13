import { useEffect, useState } from 'react'
import { assets } from '../../data/assets'
import { usePreview } from '../../hooks/usePreview'
import PreviewLink from './PreviewLink'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Placements', to: '/placements' },
  { label: 'Blogs', to: '/blogs' },
  { label: 'Courses', to: '/courses' },
  { label: 'About Us', to: '/about' },
  { label: 'Apply', to: '/apply' },
] as const

export default function Footer() {
  const { isPreview, previewWidth } = usePreview()
  const [isLiveMobile, setIsLiveMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px)').matches
  })

  useEffect(() => {
    if (isPreview) return

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const syncMobileLayout = () => setIsLiveMobile(mediaQuery.matches)

    syncMobileLayout()
    mediaQuery.addEventListener('change', syncMobileLayout)
    return () => mediaQuery.removeEventListener('change', syncMobileLayout)
  }, [isPreview])

  const mobileLayout = isPreview ? previewWidth < 768 : isLiveMobile

  return (
    <footer
      className={`site-footer bg-navy-deep text-surface${mobileLayout ? ' site-footer--mobile-layout' : ''}`}
    >
      <div className="shell-footer-inner mx-auto w-full px-4">
        <div className="footer-main">
          <div className="footer-brand">
            <img
              src={assets.footerLogo}
              alt="Aerostar Aviation Academy"
              className="footer-brand__logo"
            />
            <p className="text-description text-white/82">
              Aerostar Aviation Academy is Gujarat&apos;s leading training institute for Aviation,
              Hospitality and Tours & Travel. Approved training partner of NSDC and Skill India.
            </p>
          </div>

          <div className="footer-explore">
            <h5 className="text-body font-medium text-surface">Explore</h5>
            <nav className="footer-explore-links" aria-label="Footer explore links">
              {mobileLayout ? (
                <>
                  <div className="footer-explore-links-row">
                    {footerLinks.slice(0, 3).map((link) => (
                      <PreviewLink key={link.label} to={link.to} className="footer-link">
                        {link.label}
                      </PreviewLink>
                    ))}
                  </div>
                  <div className="footer-explore-links-row">
                    {footerLinks.slice(3).map((link) => (
                      <PreviewLink key={link.label} to={link.to} className="footer-link">
                        {link.label}
                      </PreviewLink>
                    ))}
                  </div>
                </>
              ) : (
                footerLinks.map((link) => (
                  <PreviewLink key={link.label} to={link.to} className="footer-link">
                    {link.label}
                  </PreviewLink>
                ))
              )}
            </nav>
          </div>
        </div>
      </div>

      <div className="footer-legal px-4">
        <p className="footer-legal-copy text-body-sm text-white/82">
          ©2026 Aerostar Aviation Academy. All rights reserved.
        </p>
        <div className="footer-legal-links">
          <PreviewLink to="/privacy-policy" className="footer-link">
            Privacy Policy
          </PreviewLink>
        </div>
      </div>
    </footer>
  )
}
