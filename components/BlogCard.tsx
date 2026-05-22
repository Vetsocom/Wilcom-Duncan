import Link from "next/link";
import { BlogPost } from "@/data/blog";
import { MotionWrapper } from "./MotionWrapper";
import { ImageCard } from "./ImageCard";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <MotionWrapper delay={index * 0.1} className="group premium-card flex h-full flex-col overflow-hidden">
      <ImageCard
        src={post.image}
        alt={post.title}
        className="aspect-[16/10] rounded-none border-0 shadow-none"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      
      <div className="flex flex-grow flex-col justify-between p-6 md:p-8">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">
              {post.date}
            </span>
          </div>
          <h3 className="mb-3 line-clamp-2 font-serif text-xl font-bold leading-tight text-ivory transition-colors group-hover:text-gold">
            {post.title}
          </h3>
          <p className="mb-6 line-clamp-3 text-sm leading-7 text-slate-300">
            {post.excerpt}
          </p>
        </div>
        
        <Link href={`/blog/${post.slug}`} className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10">
          Read Article <ArrowRight size={16} />
        </Link>
      </div>
    </MotionWrapper>
  );
}
