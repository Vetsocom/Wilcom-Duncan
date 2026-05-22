import Link from "next/link";
import { Button } from "./Button";
import { ImageCard } from "./ImageCard";
import { MotionWrapper } from "./MotionWrapper";

export function HeroEditorial() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute right-[-18rem] top-24 h-[42rem] w-[42rem] rounded-full bg-gold/10 blur-[140px]" />
      <div className="absolute left-[-18rem] top-1/2 h-[34rem] w-[34rem] rounded-full bg-emerald/10 blur-[130px]" />

      <div className="site-container relative z-10 grid min-h-screen items-center gap-12 pb-20 pt-32 sm:pb-24 lg:min-h-[780px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-28">
        <div className="max-w-4xl">
          <div className="space-y-8">
            <MotionWrapper>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                SME Development Consultant • Speaker • Media Executive
              </p>
              <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[0.95] text-ivory sm:text-5xl lg:text-7xl">
                Building Business Leaders, Stronger Brands, and Enterprise-Ready Entrepreneurs
              </h1>
            </MotionWrapper>

            <MotionWrapper delay={0.1}>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Wilcom Duncan is a Liberian entrepreneur, SME Development Consultant, business trainer, speaker, and media executive working at the intersection of business development, executive education, corporate branding, and media strategy. Through platforms connected to Reecom Media, CEOs Chat, and CEOs Bootcamp, he helps entrepreneurs, founders, SMEs, and corporate teams think strategically, communicate clearly, and build businesses with structure, discipline, and long-term value.
              </p>
            </MotionWrapper>

            <MotionWrapper delay={0.2} className="flex flex-col gap-4 pt-1 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <Link href="/projects-events">Explore His Work</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ceos-bootcamp">View CEOs Bootcamp</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/contact">Book Wilcom</Link>
              </Button>
            </MotionWrapper>
          </div>
        </div>

        <MotionWrapper delay={0.3} className="relative mx-auto w-full max-w-[34rem] lg:mr-0">
          <div className="absolute -inset-4 rounded-[2.25rem] border border-gold/25" />
          <ImageCard
            src="/images/blog-1.jpg"
            alt="Wilcom Duncan speaking at a business leadership event"
            priority
            className="aspect-4/5 rounded-4xl"
            label="Executive education • SME growth • Media strategy"
          />
          <div className="absolute -left-4 top-8 rounded-2xl border border-gold/30 bg-[#070B14]/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold shadow-xl backdrop-blur-md sm:-left-8">
            SME Growth
          </div>
          <div className="absolute -right-3 bottom-10 rounded-2xl border border-white/10 bg-[#070B14]/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory shadow-xl backdrop-blur-md sm:-right-6">
            Executive Training
          </div>
          <div className="absolute left-8 bottom-28 rounded-2xl border border-emerald/40 bg-[#05070D]/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory shadow-xl backdrop-blur-md">
            Media Strategy
          </div>
        </MotionWrapper>
      </div>

      <div className="relative z-10 border-y border-white/10 bg-white/[0.03] py-4 backdrop-blur-sm">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center font-serif text-xs uppercase tracking-[0.22em] text-gold/80 sm:text-sm">
          <span>Reecom Media</span>
          <span>CEOs Chat</span>
          <span>CEOs Bootcamp</span>
          <span>SME Development</span>
          <span>Executive Training</span>
        </div>
      </div>
    </section>
  );
}
