import { useCallback, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import CourseCard from '../components/ui/CourseCard'
import HorizontalScroll from '../components/ui/HorizontalScroll'
import LeadCaptureButton from '../components/ui/LeadCaptureButton'
import CtaBanner from '../components/sections/CtaBanner'
import {
  COURSE_CATEGORY_PARAM,
  courseCategories,
  courses,
  getCourseCountByCategory,
  parseCoursesCategoryParam,
  type Course,
  type CourseCategory,
} from '../data/content'

type ActiveCategory = 'all' | CourseCategory

const listingCategories = courseCategories.filter((category) => category.id !== 'all')

function getPrimaryCategory(course: Course): CourseCategory {
  for (const category of listingCategories) {
    if (course.categories.includes(category.id as CourseCategory)) {
      return category.id as CourseCategory
    }
  }

  return course.categories[0]
}

function isElementVisible(element: Element) {
  const style = window.getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = useMemo(
    () => parseCoursesCategoryParam(searchParams.get(COURSE_CATEGORY_PARAM)),
    [searchParams]
  )

  const setActiveCategory = useCallback(
    (category: ActiveCategory) => {
      const next = new URLSearchParams(searchParams)

      if (category === 'all') {
        next.delete(COURSE_CATEGORY_PARAM)
      } else {
        next.set(COURSE_CATEGORY_PARAM, category)
      }

      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  const groupedCoursesByCategory = useMemo(
    () =>
      listingCategories.map((category) => ({
        ...category,
        courses: courses.filter((course) => getPrimaryCategory(course) === category.id),
      })),
    []
  )

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'all') return courses
    return courses.filter((course) => course.categories.includes(activeCategory))
  }, [activeCategory])

  const displayedCourseCount =
    activeCategory === 'all' ? courses.length : filteredCourses.length

  useEffect(() => {
    if (activeCategory === 'all') return

    const frame = requestAnimationFrame(() => {
      const filtersRoot = document.querySelector('.courses-filters')
      if (!filtersRoot) return

      const scrollRow = filtersRoot.querySelector('.course-categories-scroll')
      const wrapRow = filtersRoot.querySelector('.course-categories-wrap')
      const visibleRow =
        scrollRow && isElementVisible(scrollRow)
          ? scrollRow
          : wrapRow && isElementVisible(wrapRow)
            ? wrapRow
            : null

      if (!visibleRow) return

      const chip = visibleRow.querySelector<HTMLElement>(`[data-category-id="${activeCategory}"]`)
      if (!chip) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      chip.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [activeCategory])

  return (
    <PageLayout>
      <section className="courses-hero-section relative overflow-hidden bg-primary-alt px-4 text-surface">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white/8" />
        <div className="page-hero-layout relative">
          <div>
            <nav className="flex flex-wrap items-center gap-2 text-xs text-white/72">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <span>Courses</span>
            </nav>
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight">All Courses</h1>
            <p className="text-description max-w-[320px] leading-snug text-white/84">
              Explore our curriculum built with industry experts. Select a category to narrow your search.
            </p>
            <LeadCaptureButton entryId="courses_placement" className="page-hero-cta-wrap" />
          </div>
        </div>
      </section>

      <section className="courses-listing-section stack-section bg-bg-grey">
        <div className="courses-filters relative min-w-0 stack-section-header-tight">
          <div className="course-categories-scroll">
            <div
              className="pointer-events-none absolute right-0 top-0 z-10 h-10 w-10 bg-gradient-to-l from-bg-grey to-transparent"
              aria-hidden
            />
            <HorizontalScroll ariaLabel="Browse course categories" className="px-0">
              {courseCategories.map((category) => {
                const isActive = activeCategory === category.id
                const count = getCourseCountByCategory(category.id)
                return (
                  <button
                    key={category.id}
                    type="button"
                    data-category-id={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`site-tag inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-xs font-medium leading-none shadow-sm ${
                      isActive
                        ? 'site-tag--selected border-primary bg-primary text-surface'
                        : 'border-border-alt bg-surface text-navy'
                    }`}
                  >
                    {category.label}
                    {category.id !== 'all' ? (
                      <span
                        className={`course-category-chip__count ${
                          isActive ? 'bg-surface text-primary' : 'bg-bg-avatar text-primary'
                        }`}
                      >
                        {count}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </HorizontalScroll>
          </div>

          <div className="course-categories-wrap hidden">
            {courseCategories.map((category) => {
              const isActive = activeCategory === category.id
              const count = getCourseCountByCategory(category.id)
              return (
                <button
                  key={`wrap-${category.id}`}
                  type="button"
                  data-category-id={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`site-tag inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-xs font-medium leading-none shadow-sm ${
                    isActive
                      ? 'site-tag--selected border-primary bg-primary text-surface'
                      : 'border-border-alt bg-surface text-navy'
                  }`}
                >
                  {category.label}
                  {category.id !== 'all' ? (
                    <span
                      className={`course-category-chip__count ${
                        isActive ? 'bg-surface text-primary' : 'bg-bg-avatar text-primary'
                      }`}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <p className="courses-showing-count mt-[23px] text-left text-xs text-navy">
            {activeCategory === 'all' ? (
              'Showing all courses'
            ) : (
              <>
                Showing <span className="font-semibold">{displayedCourseCount} courses</span>
              </>
            )}
          </p>
        </div>

        {activeCategory === 'all' ? (
          groupedCoursesByCategory.map((section) =>
            section.courses.length > 0 ? (
              <div key={section.id} className="courses-category-section">
                <h2 className="courses-category-heading">{section.label}</h2>
                <div className="courses-grid">
                  {section.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <CtaBanner />
    </PageLayout>
  )
}
