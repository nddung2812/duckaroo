import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Tag, ChevronRight } from "lucide-react";
import {
  blogs,
  blogCategories,
  getBlogBySlug,
  getRecentBlogs,
} from "@/data/blogs";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ShareButton from "./ShareButton";

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const blog = getBlogBySlug(resolvedParams.slug);

  if (!blog) return { title: "Blog Post Not Found" };

  return {
    title: blog.seo?.metaTitle || `${blog.title} | Duckaroo Brisbane`,
    description: blog.seo?.metaDescription || blog.description,
    keywords: blog.tags.join(", "),
    alternates: {
      canonical: `https://aquaticswandesign.com.au/blogs/${resolvedParams.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://aquaticswandesign.com.au/blogs/${resolvedParams.slug}`,
      images: [{ url: blog.image, alt: blog.title }],
      type: "article",
      publishedTime: blog.publishDate,
      authors: [blog.author],
      tags: blog.tags,
      siteName: "Duckaroo",
      locale: "en_AU",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.image],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const blog = getBlogBySlug(resolvedParams.slug);

  if (!blog) notFound();

  const categoryInfo = blogCategories.find((cat) => cat.id === blog.category);
  const relatedBlogs = getRecentBlogs(4)
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-AU", {
      timeZone: "Australia/Brisbane",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://aquaticswandesign.com.au/blogs/${blog.slug}#article`,
        url: `https://aquaticswandesign.com.au/blogs/${blog.slug}`,
        headline: blog.title,
        description: blog.description,
        image: blog.image,
        inLanguage: "en-AU",
        author: {
          "@type": "Person",
          name: blog.author,
          url: "https://aquaticswandesign.com.au/about-us",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://aquaticswandesign.com.au/#organization",
          name: "Duckaroo",
          logo: {
            "@type": "ImageObject",
            url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
            width: 400,
            height: 400,
          },
        },
        datePublished: blog.publishDate,
        dateModified: blog.updatedDate || blog.publishDate,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://aquaticswandesign.com.au/blogs/${blog.slug}`,
        },
        articleSection: categoryInfo?.name ?? "Aquarium Care",
        keywords: blog.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://aquaticswandesign.com.au" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://aquaticswandesign.com.au/blogs" },
          { "@type": "ListItem", position: 3, name: blog.title, item: `https://aquaticswandesign.com.au/blogs/${blog.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/40 text-xs mb-10">
            <Link href="/blogs" className="hover:text-white/70 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span
              className={`font-medium bg-gradient-to-r ${categoryInfo?.color} bg-clip-text text-transparent`}
            >
              {categoryInfo?.name}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            <span
              className={`text-xs font-semibold bg-gradient-to-r ${categoryInfo?.color} bg-clip-text text-transparent uppercase tracking-widest`}
            >
              {categoryInfo?.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4 leading-tight">
              {blog.title}
            </h1>
            <p className="text-white/65 text-lg leading-relaxed mb-6">
              {blog.description}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-white/45 text-sm border-t border-b border-white/10 py-4">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.publishDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {blog.readTime}
              </span>
              <ShareButton blog={blog} />
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-56 md:h-80 rounded-xl overflow-hidden mb-12 bg-white/5">
            <Image
              src={blog.image}
              alt={blog.imageAlt || blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
          </div>

          {/* Article Body */}
          <article className="prose prose-lg prose-invert max-w-none mb-14">
            {blog.content.map((paragraph, index) => (
              <p key={index} className="text-white/85 leading-relaxed mb-6 text-base md:text-lg">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 py-6 border-t border-white/10">
            <Tag className="w-4 h-4 text-white/35" />
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs text-white/55 border border-white/15 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-start gap-4 py-6 border-t border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {blog.author.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{blog.author}</p>
              <p className="text-white/55 text-sm mt-1 leading-relaxed">
                Aquarium specialist at Duckaroo Brisbane with years of experience in aquatic care, fish
                health, and aquascaping.
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-5">
                Related Articles
              </p>
              <div className="space-y-5">
                {relatedBlogs.map((related) => {
                  const relCat = blogCategories.find((c) => c.id === related.category);
                  return (
                    <div key={related.id} className="group">
                      <span
                        className={`text-xs font-medium bg-gradient-to-r ${relCat?.color} bg-clip-text text-transparent`}
                      >
                        {relCat?.name}
                      </span>
                      <h3 className="text-white font-medium group-hover:text-emerald-300 transition-colors leading-snug mt-0.5">
                        <Link href={`/blogs/${related.slug}`}>{related.title}</Link>
                      </h3>
                      <p className="text-white/40 text-xs mt-1">
                        {formatDate(related.publishDate)} · {related.readTime}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Link
                  href="/blogs"
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  ← Back to all articles
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
