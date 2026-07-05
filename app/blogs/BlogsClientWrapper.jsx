"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock } from "lucide-react";
import { searchBlogs } from "@/data/blogs";

export default function BlogsClientWrapper({ blogs, blogCategories, featuredBlogs }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredBlogs = useMemo(() => {
    let filtered = searchQuery ? searchBlogs(searchQuery) : [...blogs];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.publishDate) - new Date(b.publishDate);
        case "title":
          return a.title.localeCompare(b.title);
        case "readTime":
          return parseInt(a.readTime) - parseInt(b.readTime);
        case "newest":
        default:
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, blogs]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-AU", {
      timeZone: "Australia/Brisbane",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getCategoryInfo = (categoryId) =>
    blogCategories.find((cat) => cat.id === categoryId);

  return (
    <>
      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <section className="px-4 mb-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-glow font-medium mb-5">
              Featured
            </p>
            <div className="space-y-6">
              {featuredBlogs.map((blog) => {
                const cat = getCategoryInfo(blog.category);
                return (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    className="group flex gap-5 items-start"
                  >
                    <div className="w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-cream/10 border border-cream/15">
                      <Image
                        src={blog.image}
                        alt={blog.imageAlt || blog.title}
                        width={96}
                        height={64}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-amber-glow uppercase tracking-[0.14em]">
                        {cat?.name}
                      </span>
                      <h2 className="font-display font-medium text-parchment group-hover:text-amber-glow transition-colors leading-snug mt-0.5">
                        {blog.title}
                      </h2>
                      <p className="text-cream/60 text-xs mt-1">
                        {formatDate(blog.publishDate)} · {blog.readTime}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-cream/15 mt-10" />
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/50 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-cream/5 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow/50"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger
                className="w-full sm:w-44 bg-cream/5 border-cream/20 text-cream"
                aria-label="Select category"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {blogCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                className="w-full sm:w-40 bg-cream/5 border-cream/20 text-cream"
                aria-label="Sort by"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title">A–Z</SelectItem>
                <SelectItem value="readTime">Read Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-cream/50 text-xs mt-3">
            {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto divide-y divide-cream/15">
          {filteredBlogs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-cream/60">No articles match your search.</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                size="sm"
                className="mt-4 border border-cream/30 text-cream/90 rounded-full bg-transparent hover:border-cream/60 hover:bg-cream/5"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filteredBlogs.map((blog) => {
              const cat = getCategoryInfo(blog.category);
              return (
                <article key={blog.id} className="py-7 group">
                  <div className="flex items-center gap-3 mb-2 text-xs text-cream/60">
                    <span className="font-medium text-amber-glow uppercase tracking-[0.14em]">
                      {cat?.name}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(blog.publishDate)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-medium text-parchment group-hover:text-amber-glow transition-colors mb-2 leading-snug">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-cream/75 text-sm leading-relaxed mb-3 line-clamp-2">
                    {blog.description}
                  </p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-amber-glow hover:text-amber-glow/80 text-xs font-medium uppercase tracking-[0.14em] transition-colors"
                  >
                    Read article →
                  </Link>
                </article>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
