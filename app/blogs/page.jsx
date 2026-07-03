import { blogs, blogCategories, getFeaturedBlogs } from "@/data/blogs";
import Layout from "@/app/components/Layout";
import BlogsClientWrapper from "./BlogsClientWrapper";

export default function BlogsPage() {
  const featuredBlogs = getFeaturedBlogs().slice(0, 2);

  return (
    <Layout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Header — server-rendered for SEO */}
        <section className="pt-28 pb-12 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-3">
              Expert Guides
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Aquarium Care Blog
            </h1>
            <p className="text-white/60 text-lg">
              Practical fish tank tips, disease guides, and maintenance advice
              from Brisbane&apos;s aquarium specialists.
            </p>
          </div>
        </section>

        <BlogsClientWrapper
          blogs={blogs}
          blogCategories={blogCategories}
          featuredBlogs={featuredBlogs}
        />
      </div>
    </Layout>
  );
}
