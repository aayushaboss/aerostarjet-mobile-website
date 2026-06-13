import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SectionLabel from '../components/ui/SectionLabel'
import BlogCard from '../components/ui/BlogCard'
import CtaBanner from '../components/sections/CtaBanner'
import { assets } from '../data/assets'
import {
  aboutCopy,
  blogPosts,
  branches,
  contactCopy,
  founderCopy,
  homepageNewsCopy,
} from '../data/content'

export default function AboutPage() {
  return (
    <PageLayout>
      <section className="stack-hero bg-primary-alt px-4 py-8 text-surface">
        <h1 className="text-[1.75rem] font-bold">About Us</h1>
        <p className="text-description text-white/85">Training for Excellence in Air and Hospitality Service</p>
      </section>

      <section className="stack-section px-4 py-10">
        <div className="about-founder-layout">
          <div className="about-founder-layout__media">
            <img
              src={assets.founderSheetalJadeja}
              alt="Dr. Sheetal Jadeja, Founder of Aerostar Aviation Academy"
              className="about-founder-layout__image rounded-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-founder-layout__copy stack-copy">
            <div className="stack-section-header">
              <SectionLabel>{founderCopy.overline}</SectionLabel>
              <h2 className="text-heading-lg font-extrabold text-navy-deep">{founderCopy.name}</h2>
              <p className="text-sm font-bold text-navy-deep">{founderCopy.title}</p>
            </div>
            <p className="text-description leading-6 text-body">{founderCopy.description}</p>
          </div>
        </div>
      </section>

      <section className="stack-section px-4 py-10">
        <div className="about-content-layout">
          <div className="about-content-layout__media">
            <img src={assets.aboutImage} alt="" className="about-preview-layout__image rounded-2xl" />
          </div>
          <div className="about-content-layout__copy stack-copy">
            <div className="stack-section-header">
              <SectionLabel>{aboutCopy.overline}</SectionLabel>
              <p className="text-sm font-bold text-navy-deep">{aboutCopy.title}</p>
              <h2 className="text-heading-lg font-extrabold text-navy-deep">
                {aboutCopy.heading} <span className="text-primary">{aboutCopy.headingAccent}</span>
              </h2>
            </div>
            {aboutCopy.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-description leading-6 text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mobile-listing-section stack-section bg-bg-light py-8">
        <div className="mobile-listing-section__intro stack-section-header-tight text-center">
          <SectionLabel className="justify-center">{homepageNewsCopy.overline}</SectionLabel>
          <h2 className="text-heading-lg font-extrabold tracking-tight text-navy-deep">
            {homepageNewsCopy.heading}
          </h2>
        </div>
        <div className="blog-cards-grid about-news-cards">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mobile-listing-section__intro text-center">
          <Link
            to="/blogs"
            className="inline-flex min-h-12 items-center text-xs font-bold text-primary"
          >
            View all news →
          </Link>
        </div>
      </section>

      <section className="stack-section bg-primary-alt px-4 py-10 text-surface">
        <div className="stack-section-header-tight text-center">
          <SectionLabel className="justify-center [&_.text-label]:text-surface">{contactCopy.overline}</SectionLabel>
          <h2 className="text-heading-lg font-bold">
            {contactCopy.heading}{' '}
            <span className="text-accent">{contactCopy.headingAccent}</span>
          </h2>
        </div>
        <div className="stack-copy rounded-2xl border border-border bg-surface p-5 shadow-md">
          <div className="contact-field">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-alt">Corporate Office</p>
            <p className="text-description text-body">{contactCopy.corporateOffice}</p>
          </div>
          <div className="contact-field">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-alt">Mobile</p>
            <p className="text-description text-body">{contactCopy.phones.join(' | ')}</p>
          </div>
          <div className="contact-field">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-alt">Email</p>
            <p className="text-description text-body">{contactCopy.email}</p>
          </div>
          <div className="contact-field">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-alt">Social</p>
            <p className="text-description text-body">
              Facebook: {contactCopy.social.facebook} | Instagram: {contactCopy.social.instagram} | YouTube{' '}
              {contactCopy.social.youtube}
            </p>
          </div>
        </div>
      </section>

      <section className="mobile-listing-section stack-section py-8">
        <h3 className="mobile-listing-section__intro pt-10 pb-0 text-sm font-bold text-navy">Branch Locations</h3>
        <div className="branch-cards">
        {branches.map((branch) => (
          <div key={branch.city} className="branch-card rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="branch-card__content">
              <div className="branch-card__title-row">
                <span className="branch-card__marker" aria-hidden="true" />
                <h4 className="branch-card__name font-bold text-navy">{branch.city}</h4>
              </div>
              <p className="branch-card__address text-description text-body">{branch.address}</p>
            </div>
            <a
              href={`tel:${branch.phone.replace(/\s/g, '')}`}
              className="branch-card__phone flex min-h-12 items-center text-xs font-semibold text-primary-alt"
            >
              {branch.phone}
            </a>
          </div>
        ))}
        </div>
      </section>

      <CtaBanner />
    </PageLayout>
  )
}