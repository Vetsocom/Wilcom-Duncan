"use client";

import { useState } from "react";
import type { BlogPost } from "@/data/blog";
import { BlogCard } from "@/components/BlogCard";

type BlogIndexProps = {
  posts: BlogPost[];
};

export function BlogIndex({ posts }: BlogIndexProps) {
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];
  const filteredPosts = filterCategory === "All" ? posts : posts.filter((post) => post.category === filterCategory);

  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filterCategory === category
                ? "bg-gold text-midnight"
                : "border border-slate/20 bg-charcoal text-slate hover:border-gold/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post, index) => (
          <BlogCard key={post.id} index={index} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="mx-auto max-w-3xl rounded-xl border border-slate/10 bg-charcoal py-24 text-center">
          <p className="text-lg text-slate">No articles found for this category.</p>
        </div>
      ) : null}
    </>
  );
}
