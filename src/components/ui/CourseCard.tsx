import { Link } from 'react-router-dom'
import type { Course } from '../../data/content'

type CourseCardProps = {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const displayTitle = course.code ? `${course.title} (${course.code})` : course.title

  return (
    <article className="course-card" data-course-id={course.id}>
      <Link
        to={`/courses/${course.id}`}
        className="course-card__stretched-link"
        aria-label={`View ${displayTitle}`}
      />
      <div className="course-card__media">
        <img alt={course.title} className="course-card__image" src={course.image} />
      </div>

      <div className="course-card__body">
        <div className="course-card__content">
          <div className="course-card__title-row">
            <h3 className="course-card__title">
              {course.id === 'cchm' ? (
                <span className="course-card__title-text course-card__title-text--cchm">
                  <span className="course-card__title-text-primary">Cabin Crew & Hospitality</span>
                  <span className="course-card__title-text-secondary">Management</span>
                </span>
              ) : (
                <span className="course-card__title-text">{course.title}</span>
              )}
              {course.code ? (
                <span className="course-card__title-code">({course.code})</span>
              ) : null}
            </h3>
            <span className="course-card__duration">{course.duration}</span>
          </div>
          <p className="course-card__description">{course.description}</p>
        </div>
        <div className="course-card__cta-wrap">
          <Link to={`/courses/${course.id}`} className="course-card__cta">
            View more
          </Link>
        </div>
      </div>
    </article>
  )
}
