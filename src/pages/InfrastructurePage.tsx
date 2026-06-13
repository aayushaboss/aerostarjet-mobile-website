import PageLayout from '../components/layout/PageLayout'
import InfrastructureMasonryGallery from '../components/ui/InfrastructureMasonryGallery'
import CtaBanner from '../components/sections/CtaBanner'
import { infrastructureCopy } from '../data/content'

export default function InfrastructurePage() {
  return (
    <PageLayout>
      <section className="infrastructure-page-hero stack-hero bg-primary-alt px-4 py-8 text-surface">
        <h1 className="text-[1.75rem] font-bold">{infrastructureCopy.pageHeading}</h1>
      </section>

      <section className="infrastructure-page-content stack-copy px-4">
        {infrastructureCopy.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-description leading-6 text-body">
            {paragraph}
          </p>
        ))}
        <InfrastructureMasonryGallery images={infrastructureCopy.gallery} />
      </section>

      <CtaBanner />
    </PageLayout>
  )
}
