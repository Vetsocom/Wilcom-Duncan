"use client";

import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { BlogCard } from "@/components/BlogCard";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];

  const filteredPosts = filterCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(p => p.category === filterCategory);

  return (
    <div>
      <PageHero 
        heading="Business Insights & Thought Leadership"
        subheading="Articles and Perspectives"
        intro="Explore practical insights from Wilcom Duncan on what it takes to build stronger businesses, communicate with clarity, lead with discipline, and create lasting value."
      />

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === cat 
                    ? 'bg-gold text-midnight' 
                    : 'bg-charcoal border border-slate/20 text-slate hover:border-gold/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} index={index} post={post} />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
             <div className="text-center py-24 border border-slate/10 rounded-xl bg-charcoal max-w-3xl mx-auto">
               <p className="text-slate text-lg">No articles found for this category.</p>
             </div>
          )}
          
        </div>
      </section>
    </div>
  );
}
