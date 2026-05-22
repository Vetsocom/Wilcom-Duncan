import { MotionWrapper } from "./MotionWrapper";
import { cn } from "@/lib/utils";
import { ImageCard } from "./ImageCard";

interface PageHeroProps {
  heading: string;
  subheading?: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  className?: string;
}

export function PageHero({ heading, subheading, intro, image, imageAlt, className }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-white/10 bg-grid-white pt-32 pb-16 md:pt-40 md:pb-24", className)}>
      <div className="absolute inset-0 bg-[#05070D]/92" />
      <div className="pointer-events-none absolute left-48 top-10 h-136 w-136 rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 bottom-0 h-120 w-120 rounded-full bg-emerald/10 blur-[120px]" />
      
      <div className="site-container relative z-10">
        <div className={cn("grid items-center gap-10", image ? "lg:grid-cols-[1fr_0.75fr]" : "text-center")}>
          <MotionWrapper className={cn(!image && "mx-auto max-w-4xl")}>
            {subheading && (
              <span className="mb-6 block text-sm font-semibold uppercase tracking-[0.22em] text-gold md:text-base">
                {subheading}
              </span>
            )}
            <h1 className="mb-8 font-serif text-4xl font-bold leading-tight text-ivory md:text-6xl lg:text-7xl">
              {heading}
            </h1>
            {intro && (
              <p className={cn("max-w-2xl text-lg leading-8 text-slate md:text-xl", !image && "mx-auto")}>
                {intro}
              </p>
            )}
          </MotionWrapper>

          {image ? (
            <MotionWrapper delay={0.1} className="relative mx-auto w-full lg:w-md lg:mr-0">
              <div className="absolute -inset-3 rounded-4xl border border-gold/25" />
              <ImageCard
                src={image}
                alt={imageAlt || heading}
                priority
                className="aspect-4/5 rounded-4xl"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </MotionWrapper>
          ) : null}
        </div>
      </div>
    </section>
  );
}
