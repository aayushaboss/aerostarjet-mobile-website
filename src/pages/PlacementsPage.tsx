import PageLayout from '../components/layout/PageLayout'
import SectionLabel from '../components/ui/SectionLabel'
import LeadCaptureButton from '../components/ui/LeadCaptureButton'
import AlumniPlacementsMarquee from '../components/ui/AlumniPlacementsMarquee'
import { PartnerTagGrid } from '../components/ui/PartnerMarquee'
import PlacementsMarquee from '../components/ui/PlacementsMarquee'
import CtaBanner from '../components/sections/CtaBanner'
import { alumniPlacementPhotos, hiringPartners, placements } from '../data/content'

export default function PlacementsPage() {
  return (
    <PageLayout>
      <section className="placements-hero-section stack-hero bg-primary-alt px-4 py-8 text-surface">
        <h1 className="text-[1.75rem] font-bold">Placements & Career</h1>
        <p className="text-description max-w-[480px] leading-snug text-white/85">
          Aerostar provides internship and job placement support, with established partnerships across Aviation, Hospitality and Travel & Tourism.
        </p>
        <LeadCaptureButton entryId="placements_placement" className="page-hero-cta-wrap" />
      </section>
      <section className="placements-featured-section stack-section px-4 py-10">
        <div className="stack-section-header">
          <SectionLabel>FEATURED PLACEMENTS</SectionLabel>
          <h2 className="text-heading-lg font-bold text-navy">
            From Classroom to the{'\u00A0'}
            <span className="text-primary-alt">Cabin</span>
          </h2>
        </div>
        <PlacementsMarquee placements={placements} />
      </section>
      <section className="placements-alumni-section stack-section px-4 py-10">
        <div className="stack-section-header">
          <SectionLabel>OUR ALUMNI</SectionLabel>
          <h2 className="text-heading-lg font-bold text-navy">
            From our classrooms to the world&apos;s best airlines.
          </h2>
        </div>
        <AlumniPlacementsMarquee photos={alumniPlacementPhotos} />
      </section>
      <section className="mobile-listing-section stack-section bg-bg-light py-8">
        <h2 className="mobile-listing-section__intro text-heading-lg font-bold text-navy text-center">
          Companies That Hire Our Graduates
        </h2>
        <PartnerTagGrid partners={hiringPartners} className="hiring-partners-tags" />
      </section>
      <CtaBanner />
    </PageLayout>
  )
}
