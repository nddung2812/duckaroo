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
            <p className="text-xs text-white/40 uppercase tracking-widest mb-5">
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
                    <div className="w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-white/10">
                      <Image
                        src={blog.image}
                        alt={blog.imageAlt || blog.title}
                        width={96}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-medium bg-gradient-to-r ${cat?.color} bg-clip-text text-transparent`}
                      >
                        {cat?.name}
                      </span>
                      <h2 className="text-white font-semibold group-hover:text-emerald-300 transition-colors leading-snug mt-0.5">
                        {blog.title}
                      </h2>
                      <p className="text-white/50 text-xs mt-1">
                        {formatDate(blog.publishDate)} · {blog.readTime}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-white/10 mt-10" />
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-emerald-500/50"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger
                className="w-full sm:w-44 bg-white/5 border-white/15 text-white"
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
                className="w-full sm:w-40 bg-white/5 border-white/15 text-white"
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
          <p className="text-white/35 text-xs mt-3">
            {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto divide-y divide-white/10">
          {filteredBlogs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/50">No articles match your search.</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                size="sm"
                className="mt-4 border-white/20 text-white"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filteredBlogs.map((blog) => {
              const cat = getCategoryInfo(blog.category);
              return (
                <article key={blog.id} className="py-7 group">
                  <div className="flex items-center gap-3 mb-2 text-xs text-white/45">
                    <span
                      className={`font-medium bg-gradient-to-r ${cat?.color} bg-clip-text text-transparent`}
                    >
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
                  <h2 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-3 line-clamp-2">
                    {blog.description}
                  </p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
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
