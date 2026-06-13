import { useState, type FormEvent } from 'react'
import FormSelect from '../components/ui/FormSelect'
import PageLayout from '../components/layout/PageLayout'
import { EnrollCtaButton } from '../components/ui/EnrollCtaButton'
import SectionLabel from '../components/ui/SectionLabel'
import { applyCopy, courses } from '../data/content'
import { triggerFileDownload } from '../utils/downloadFile'

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    triggerFileDownload(applyCopy.brochureUrl, applyCopy.brochureFileName)
    setSubmitted(true)
  }

  return (
    <PageLayout>
      <section className="stack-section px-4 py-10">
        <div className="stack-section-header">
          <SectionLabel>{applyCopy.overline}</SectionLabel>
          <h1 className="text-heading-lg font-extrabold text-navy">{applyCopy.heading}</h1>
          <p className="apply-urgency-subheading">{applyCopy.urgencySubheading}</p>
        </div>
        {submitted ? (
          <p className="form-success-celebrate text-description leading-6 text-body" role="status">
            {applyCopy.successMessage}
          </p>
        ) : (
          <>
            <p className="text-description leading-6 text-body">{applyCopy.intro}</p>
            <form className="stack-form" onSubmit={handleSubmit}>
              <label className="stack-field block">
                <span className="text-xs font-semibold text-navy">Full name</span>
                <input
                  required
                  type="text"
                  className="min-h-12 w-full rounded-xl border border-border-alt px-4 text-xs outline-none focus:border-primary"
                />
              </label>
              <label className="stack-field block">
                <span className="text-xs font-semibold text-navy">Email</span>
                <input
                  required
                  type="email"
                  className="min-h-12 w-full rounded-xl border border-border-alt px-4 text-xs outline-none focus:border-primary"
                />
              </label>
              <label className="stack-field block">
                <span className="text-xs font-semibold text-navy">Phone</span>
                <input
                  required
                  type="tel"
                  className="min-h-12 w-full rounded-xl border border-border-alt px-4 text-xs outline-none focus:border-primary"
                />
              </label>
              <label className="stack-field block">
                <span className="text-xs font-semibold text-navy">Preferred course</span>
                <FormSelect
                  defaultValue={courses[0]?.id ?? ''}
                  options={courses.map((course) => ({
                    value: course.id,
                    label: course.title,
                  }))}
                />
              </label>
              <label className="stack-field block">
                <span className="text-xs font-semibold text-navy">City</span>
                <input
                  required
                  type="text"
                  className="min-h-12 w-full rounded-xl border border-border-alt px-4 text-xs outline-none focus:border-primary"
                />
              </label>
              <EnrollCtaButton type="submit">{applyCopy.submitLabel}</EnrollCtaButton>
            </form>
          </>
        )}
      </section>
    </PageLayout>
  )
}
