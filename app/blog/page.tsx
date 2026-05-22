import { PageHero } from "@/components/PageHero";
import { BlogIndex } from "@/components/BlogIndex";
import { getBlogPosts } from "@/lib/cms";
import type { BlogPost } from "@/data/blog";

export default async function BlogPage() {
  const posts = (await getBlogPosts()) as BlogPost[];

  return (
    <div>
      <PageHero
        heading="Business Insights & Thought Leadership"
        subheading="Articles and Perspectives"
        intro="Explore practical insights from Wilcom Duncan on what it takes to build stronger businesses, communicate with clarity, lead with discipline, and create lasting value."
      />

      <section className="bg-midnight py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BlogIndex posts={posts} />
        </div>
      </section>
    </div>
  );
}
