import { getAllStockItems } from "@/lib/stock";
import { getAllDiseaseSlugs } from "@/lib/diseases";
import { blogs } from "../data/blogs";

// Hardcoded to match robots.txt and the canonicals in every layout — the
// sitemap must never emit URLs on another host.
const baseUrl = "https://duckaroo.com.au";

// lastModified is only set where a real date exists (blog publishDate).
// Stamping new Date() on every build teaches Google to distrust lastmod.
export default async function sitemap() {
  const [products, diseaseRows] = await Promise.all([
    getAllStockItems(),
    getAllDiseaseSlugs(),
  ]);
  const productSlugs = products.map((p) => p.slug);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/service`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aquatic-specialists-gold-coast`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/customer-stories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/how-to-setup-your-first-aquarium`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/common-aquarium-diseases`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Product pages
  const productPages = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.publishDate),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Disease pages
  const diseasePages = diseaseRows.map((r) => ({
    url: `${baseUrl}/common-aquarium-diseases/${r.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages, ...diseasePages];
}
