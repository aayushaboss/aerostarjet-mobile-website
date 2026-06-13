import PageLayout from '../components/layout/PageLayout'
import BlogCard from '../components/ui/BlogCard'
import { blogsCopy, getBlogListingPosts } from '../data/content'

export default function BlogsPage() {
  const posts = getBlogListingPosts()

  return (
    <PageLayout>
      <section className="blogs-hero-section stack-hero bg-primary-alt py-8 text-surface">
        <h1 className="text-[1.75rem] font-bold">{blogsCopy.heading}</h1>
        <p className="text-description text-white/85">{blogsCopy.subheading}</p>
      </section>

      <section className="blogs-listing-section mobile-listing-section py-8">
        <div className="blog-cards-grid mb-0">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
