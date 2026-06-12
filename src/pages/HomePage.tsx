import { useState, type FormEvent } from 'react'
import PreviewLink from '../components/layout/PreviewLink'
import PageLayout from '../components/layout/PageLayout'
import SectionLabel from '../components/ui/SectionLabel'
import FormSelect from '../components/ui/FormSelect'
import FormSuccessMessage from '../components/ui/FormSuccessMessage'
import LeadCaptureButton from '../components/ui/LeadCaptureButton'
import { EnrollCtaButton } from '../components/ui/EnrollCtaButton'
import PlacementsMarquee from '../components/ui/PlacementsMarquee'
import TestimonialsCarousel from '../components/ui/TestimonialsCarousel'
import WhyChooseCarousel from '../components/ui/WhyChooseCarousel'
import CtaBanner from '../components/sections/CtaBanner'
import FaqAccordion from '../components/ui/FaqAccordion'
import { assets } from '../data/assets'
import {
  aboutCopy,
  faqs,
  heroPartnerLogoSlots,
  heroStats,
  homepageAdmissionCopy,
  homepageCoursesCopy,
  infrastructureCopy,
  placements,
  recognitionsCopy,
  site,
  testimonials,
  whyChoose,
  whyChooseCopy,
} from '../data/content'

const formFieldClass =
  'min-h-10 w-full rounded-lg border border-border-alt bg-bg-grey px-3 text-xs text-placeholder outline-none focus:border-primary'

function PartnerLogoSlot({ slot }: { slot: (typeof heroPartnerLogoSlots)[number] }) {
  return (
    <div className="homepage-hero__partner-logo-slot">
      <div className="homepage-hero__partner-logo-mark">
        <img
          className="homepage-hero__partner-logo"
          src={slot.src}
          alt={slot.alt}
          loading="lazy"
          decoding="async"
          style={{ transform: `scale(${slot.scale})` }}
        />
      </div>
    </div>
  )
}

function PartnerLogoBatch({
  slots,
  leading = false,
  ariaHidden = false,
}: {
  slots: typeof heroPartnerLogoSlots
  leading?: boolean
  ariaHidden?: boolean
}) {
  return (
    <div
      className={`homepage-hero__partner-logos-batch${leading ? ' homepage-hero__partner-logos-batch--leading' : ''}`}
      aria-hidden={ariaHidden || undefined}
    >
      {slots.map((slot) => (
        <PartnerLogoSlot key={leading ? slot.id : `${slot.id}-dup`} slot={slot} />
      ))}
    </div>
  )
}

export default function HomePage() {
  const [admissionSubmitted, setAdmissionSubmitted] = useState(false)

  const handleAdmissionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAdmissionSubmitted(true)
  }

  return (
    <PageLayout>
      <section className="homepage-hero relative bg-primary px-4 pb-10 pt-8">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white/6" />
        <div className="homepage-hero__inner relative">
          <div className="homepage-hero__badge inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-surface px-4 py-2">
            <span className="size-2 shrink-0 rounded-full bg-accent-bright" aria-hidden />
            <span className="text-xs font-semibold uppercase leading-tight tracking-wide text-primary">
              {site.heroBadge}
            </span>
          </div>
          <h1 className="homepage-hero__title text-[2.25rem] font-extrabold leading-[1.1] tracking-tight text-surface">
            {site.heroHeadline}
          </h1>
          <p className="homepage-hero__body text-description max-w-[320px] text-white/82">{site.heroSubheadline}</p>
          <LeadCaptureButton entryId="hero_brochure" className="homepage-hero__cta-wrap" />
          <div className="homepage-hero__stats" role="group" aria-label="Aerostar achievements">
            <div className="homepage-hero__stat-excellence">
              <span className="homepage-hero__stat-value">{heroStats[0].value}</span>
              <span className="homepage-hero__stat-label">{heroStats[0].label}</span>
            </div>
            <div className="homepage-hero__partners-cluster">
              <p className="homepage-hero__stat-line homepage-hero__stat-line--accent">
                {heroStats[1].value} {heroStats[1].label}
              </p>
              <div className="homepage-hero__partner-logos" aria-label="Hiring partner logos">
                <div className="homepage-hero__partner-logos-track" aria-hidden="true">
                  <PartnerLogoBatch slots={heroPartnerLogoSlots} leading />
                  <PartnerLogoBatch slots={heroPartnerLogoSlots} ariaHidden />
                </div>
              </div>
            </div>
          </div>
          <div className="homepage-hero__media relative min-w-0">
            <img
              className="homepage-hero__image"
              src={assets.heroStudent}
              alt="Aerostar Aviation Academy students and staff in professional aviation uniforms"
            />
          </div>
        </div>
      </section>

      <section className="stack-section px-4 py-10">
        <div className="about-preview-layout">
          <div className="about-preview-layout__media overflow-hidden rounded-3xl bg-bg-image shadow-lg">
            <img alt="Training session" className="about-preview-layout__image" src={assets.aboutImage} />
          </div>
          <div className="about-preview-layout__copy">
            <SectionLabel>{aboutCopy.overline}</SectionLabel>
            <p className="text-sm font-bold text-navy-deep">{aboutCopy.title}</p>
            <h2 className="about-preview-layout__heading text-heading-lg font-extrabold text-navy-deep">
              {aboutCopy.heading}{' '}
              <span className="text-primary">{aboutCopy.headingAccent}</span>
            </h2>
            {aboutCopy.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-description leading-6 text-black">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-3">
              <PreviewLink
                to="/about"
                className="pill-cta pill-cta--primary inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-xs font-bold text-surface"
              >
                View More {'\u2192'}
              </PreviewLink>
              <PreviewLink
                to="/apply"
                className="pill-cta pill-cta--outline inline-flex min-h-12 items-center rounded-full border border-primary px-6 text-xs font-bold text-primary"
              >
                Admission {'\u2192'}
              </PreviewLink>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-section bg-bg-light px-4 py-10">
        <div className="stack-section-header text-center">
          <SectionLabel className="justify-center">{recognitionsCopy.overline}</SectionLabel>
          <h2 className="text-heading-lg font-extrabold tracking-tight text-navy-deep">
            {recognitionsCopy.heading}
          </h2>
        </div>
        <div className="recognitions-grid feature-cards-grid grid grid-cols-2 gap-3">
          {recognitionsCopy.logos.map((logo) => (
            <div key={logo.src} className="recognitions-card border border-border bg-surface shadow-sm">
              <img
                className="recognitions-card__logo"
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="stack-section px-4 py-10">
        <div className="stack-section-header text-center">
          <SectionLabel className="justify-center">{homepageCoursesCopy.overline}</SectionLabel>
          <h2 className="text-heading-lg font-extrabold tracking-tight text-navy-deep">
            {homepageCoursesCopy.heading}
          </h2>
        </div>
        <div className="course-categories-grid grid grid-cols-2 gap-4">
          {homepageCoursesCopy.categories.map((category) => (
            <PreviewLink
              key={category.label}
              to={category.href}
              className="course-category-card overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <div className="course-category-card__media">
                <img
                  className="course-category-card__image"
                  src={category.image}
                  alt={category.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="course-category-card__label-wrap">
                <p className="course-category-card__label">{category.label}</p>
              </div>
            </PreviewLink>
          ))}
        </div>
      </section>

      <section id="why-choose" className="why-choose-section stack-section bg-primary py-10">
        <div className="stack-section-header text-center px-4">
          <p className="text-label font-bold uppercase tracking-[0.12em] text-accent">
            {whyChooseCopy.overline}
          </p>
          <h2 className="text-heading-lg font-extrabold tracking-tight text-surface">
            {whyChooseCopy.heading}
          </h2>
        </div>
        <WhyChooseCarousel items={whyChoose} />
      </section>

      <section className="stack-section px-4 py-10">
        <div className="infrastructure-teaser-layout">
          <div className="infrastructure-teaser-layout__copy stack-copy">
            <h2 className="text-heading-lg font-extrabold tracking-tight text-navy-deep">
              {infrastructureCopy.heading}
            </h2>
            {infrastructureCopy.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-description leading-6 text-body">
                {paragraph}
              </p>
            ))}
            <PreviewLink
              to="/infrastructure"
              className="pill-cta pill-cta--primary inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-xs font-bold text-surface"
            >
              {infrastructureCopy.cta} {'\u2192'}
            </PreviewLink>
          </div>
          <div className="infrastructure-teaser-layout__media">
            <img
              alt="Aerostar infrastructure"
              src={infrastructureCopy.gallery[0].src}
            />
          </div>
        </div>
      </section>

      <section className="stack-section bg-primary-alt px-4 py-10">
        <h2 className="text-center text-heading-lg font-bold">
          <span className="text-surface">Our </span>
          <span className="text-accent">Placements</span>
        </h2>
        <PlacementsMarquee placements={placements} />
      </section>

      <section className="stack-section bg-bg-grey px-4 py-10">
        <div className="stack-section-header-tight text-center">
          <p className="text-overline font-semibold uppercase tracking-widest text-primary-alt">
            Testimonials
          </p>
          <h2 className="text-heading-lg font-bold tracking-tight text-navy">
            What Our Students Have to Say about{'\u00A0'}
            <span className="text-primary-alt">Aerostar</span>
          </h2>
        </div>
        <TestimonialsCarousel testimonials={testimonials} />
      </section>

      <section id="enquiry" className="stack-section bg-bg-grey px-4 py-8">
        <div className="stack-section-header text-center">
          <p className="text-overline font-semibold uppercase tracking-widest text-primary-alt">
            {homepageAdmissionCopy.overline}
          </p>
          <h2 className="text-heading-lg font-bold text-navy">{homepageAdmissionCopy.heading}</h2>
        </div>
        {admissionSubmitted ? (
          <div className="admission-form mx-auto w-full max-w-[300px] rounded-lg border border-border-alt bg-surface p-4 shadow-md">
            <FormSuccessMessage />
          </div>
        ) : (
          <form
            className="admission-form admission-form--grid mx-auto w-full max-w-[300px] stack-form rounded-lg border border-border-alt bg-surface p-4 shadow-md"
            onSubmit={handleAdmissionSubmit}
          >
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Nearest Academy *</span>
            <FormSelect
              defaultValue=""
              placeholder="Select academy"
              required
              options={homepageAdmissionCopy.nearestAcademyOptions.map((option) => ({
                value: option,
                label: option,
              }))}
            />
          </label>
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Highest Qualification *</span>
            <FormSelect
              defaultValue=""
              placeholder="Select qualification"
              required
              options={homepageAdmissionCopy.qualificationOptions.map((option) => ({
                value: option,
                label: option,
              }))}
            />
          </label>
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Course Interested *</span>
            <FormSelect
              defaultValue=""
              placeholder="Select course"
              required
              options={homepageAdmissionCopy.courseOptions.map((option) => ({
                value: option,
                label: option,
              }))}
            />
          </label>
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Full Name *</span>
            <input placeholder="Your full name" className={formFieldClass} type="text" />
          </label>
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Email Address *</span>
            <input placeholder="your@email.com" className={formFieldClass} type="email" />
          </label>
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Mobile Number *</span>
            <input placeholder="+91" className={formFieldClass} type="text" />
          </label>
          <label className="stack-field block">
            <span className="text-xs font-semibold text-navy">Message</span>
            <textarea
              rows={3}
              placeholder="Your message"
              className="w-full rounded-lg border border-border-alt bg-bg-grey px-3 py-2 text-xs text-placeholder outline-none focus:border-primary"
            />
          </label>
          <EnrollCtaButton type="submit">
            {homepageAdmissionCopy.submitLabel}
          </EnrollCtaButton>
          </form>
        )}
      </section>

      <section id="faq" className="faq-section stack-section px-4 py-10">
        <h2 className="text-center text-heading-lg font-bold text-navy">
          Frequently Asked{'\u00A0'}
          <span className="text-primary-alt">Questions</span>
        </h2>
        <FaqAccordion faqs={faqs} />
      </section>
      <CtaBanner />
    </PageLayout>
  )
}


