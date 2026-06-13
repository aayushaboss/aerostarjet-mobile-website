import { Link } from 'react-router-dom'
import type { BlogPost } from '../../data/blogs'

type BlogCardProps = {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      to={`/${post.slug}`}
      className="blog-card-link overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="blog-card__media">
        <img
          alt={post.imageAlt}
          className="blog-card__image"
          src={post.image}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="blog-card__body">
        <p className="blog-card__date">{post.date}</p>
        <h2 className="blog-card__title">{post.title}</h2>
      </div>
    </Link>
  )
}
