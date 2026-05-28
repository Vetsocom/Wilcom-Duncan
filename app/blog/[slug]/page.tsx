import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { CTASection } from "@/components/CTASection";
import { getBlogPosts, getProfile } from "@/lib/cms";
import type { BlogPost } from "@/data/blog";
import { SafeImage } from "@/components/SafeImage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = (await getBlogPosts()) as BlogPost[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) return constructMetadata({ title: "Not Found" });
  return constructMetadata({
    title: post.title,
    description: post.excerpt,
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, profile] = (await Promise.all([getBlogPosts(), getProfile()])) as [BlogPost[], { images?: Record<string, string> }];
  const post = posts.find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  // Splitting content to insert quote block
  const contentParagraphs = post.content.split('\n\n');
  const halfLength = Math.ceil(contentParagraphs.length / 2);
  const firstHalf = contentParagraphs.slice(0, halfLength);
  const secondHalf = contentParagraphs.slice(halfLength);
  const heroImage =
    post.image ||
    (post as BlogPost & { featuredImage?: string }).featuredImage ||
    (post as BlogPost & { imageUrl?: string }).imageUrl ||
    "";

  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-midnight relative border-b border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6 text-sm">
             <span className="font-semibold uppercase tracking-wider text-white/65">{post.category}</span>
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
        <div className="container relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {heroImage ? (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">
              <SafeImage
                src={heroImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 960px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="mt-10 flex aspect-[16/9] w-full items-center justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#080808] to-black shadow-2xl">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-white/65">
                  Wilcom Duncan
                </p>
                <p className="mt-3 font-serif text-3xl text-white">
                  Business Insights
                </p>
              </div>
            </div>
          )}
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
            
            <div className="relative my-16 rounded-r-xl border-l-4 border-white bg-charcoal p-8 md:p-12">
              <span className="absolute left-6 top-4 font-serif text-6xl text-white opacity-20">"</span>
              <p className="font-serif text-2xl md:text-3xl text-ivory leading-snug relative z-10 italic m-0">
                Business growth requires clarity, discipline, communication, and the ability to create value consistently.
              </p>
            </div>
            
            {secondHalf.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          
          <div className="mt-20 p-8 md:p-12 bg-charcoal/50 border border-white/10 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-white/25 md:h-40 md:w-40">
              <SafeImage src={profile.images?.author || profile.images?.hero || "/images/blog-3.jpg"} alt={post.author} fill className="object-cover" />
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
