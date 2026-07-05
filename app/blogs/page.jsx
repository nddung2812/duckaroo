import { blogs, blogCategories, getFeaturedBlogs } from "@/data/blogs";
import Layout from "@/app/components/Layout";
import PageAmbience from "../components/PageAmbience";
import BlogsClientWrapper from "./BlogsClientWrapper";

// The listing only needs card metadata — never send full article bodies to the client.
const toCard = ({ id, slug, title, description, category, image, imageAlt, publishDate, readTime }) => ({
  id, slug, title, description, category, image, imageAlt, publishDate, readTime,
});

export default function BlogsPage() {
  const featuredBlogs = getFeaturedBlogs().slice(0, 2).map(toCard);

  return (
    <Layout>
      <PageAmbience />
      <div className="min-h-screen relative z-10">
        {/* Header — server-rendered for SEO */}
        <section className="pt-28 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-glow font-medium mb-3">
              Expert Guides
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-parchment mb-4 leading-tight">
              Aquarium Care Blog
            </h1>
            <p className="text-cream/75 text-lg">
              Practical fish tank tips, disease guides, and maintenance advice
              from Brisbane&apos;s aquarium specialists.
            </p>
          </div>
        </section>

        <BlogsClientWrapper
          blogs={blogs.map(toCard)}
          blogCategories={blogCategories}
          featuredBlogs={featuredBlogs}
        />
      </div>
    </Layout>
  );
}
