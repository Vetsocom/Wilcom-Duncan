import { notFound } from "next/navigation";
import { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { constructMetadata } from "@/lib/seo";
import { CTASection } from "@/components/CTASection";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return constructMetadata({ title: "Not Found" });
  return constructMetadata({
    title: post.title,
    description: post.excerpt,
  });
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({
    slug: p.slug,
  }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  // Splitting content to insert quote block
  const contentParagraphs = post.content.split('\n\n');
  const halfLength = Math.ceil(contentParagraphs.length / 2);
  const firstHalf = contentParagraphs.slice(0, halfLength);
  const secondHalf = contentParagraphs.slice(halfLength);

  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-midnight relative border-b border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6 text-sm">
             <span className="text-gold font-semibold uppercase tracking-wider">{post.category}</span>
             <span className="text-slate/50">•</span>
             <span className="text-slate">{post.date}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-8">
            {post.title}
          </h1>
          <p className="text-slate text-lg">By <span className="text-ivory font-medium">{post.author}</span></p>
        </div>
      </section>

      <section className="bg-midnight pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-10 relative z-20">
          <div className="aspect-21/9 rounded-3xl overflow-hidden bg-charcoal border border-white/10 flex items-center justify-center relative shadow-2xl">
             <Image 
               src={post.image} 
               alt={post.title} 
               fill 
               className="object-fill" 
             />
          </div>
        </div>
      </section>

      <section className="py-12 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate">
            <p className="lead text-ivory text-xl font-medium mb-8">
              {post.excerpt}
            </p>
            
            {firstHalf.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            
            <div className="my-16 bg-charcoal border-l-4 border-gold p-8 md:p-12 rounded-r-xl relative">
              <span className="text-gold font-serif text-6xl absolute top-4 left-6 opacity-20">"</span>
              <p className="font-serif text-2xl md:text-3xl text-ivory leading-snug relative z-10 italic m-0">
                Business growth requires clarity, discipline, communication, and the ability to create value consistently.
              </p>
            </div>
            
            {secondHalf.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          
          <div className="mt-20 p-8 md:p-12 bg-charcoal/50 border border-white/10 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="shrink-0 relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gold/30">
              <Image src="/images/blog-3.jpg" alt={post.author} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-serif text-2xl font-bold text-ivory mb-2">About {post.author}</h4>
              <p className="text-slate text-sm leading-relaxed">
                Wilcom Duncan is an SME Development Consultant, speaker, and media executive. He works with entrepreneurs and business leaders to help them build structure, discipline, and long-term value in their organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="Need Strategic Guidance?"
        text="Book a consultation session with Wilcom Duncan to discuss your business growth, brand positioning, or leadership development."
        primaryBtnText="Contact Wilcom"
        primaryBtnLink="/contact"
      />
    </div>
  );
}
