import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { GalleryGrid } from "@/components/GalleryGrid";
import { SpeakersGallery } from "@/components/SpeakersGallery";
import { getBootcamps } from "@/lib/cms";
import type { Bootcamp } from "@/data/bootcamps";
import { SafeImage } from "@/components/SafeImage";
import { Calendar, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bootcamps = (await getBootcamps()) as Bootcamp[];
  const bootcamp = bootcamps.find((b) => b.slug === slug && b.published);
  if (!bootcamp) return constructMetadata({ title: "Not Found" });
  return constructMetadata({
    title: bootcamp.seoTitle || `${bootcamp.title} | CEOs Bootcamp`,
    description: bootcamp.seoDescription || bootcamp.overview,
  });
}

export default async function BootcampDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const bootcamps = (await getBootcamps()) as Bootcamp[];
  const bootcamp = bootcamps.find((b) => b.slug === slug && b.published);
  
  if (!bootcamp) {
    notFound();
  }

  const isUpcoming = bootcamp.status === "upcoming";
  const heroImage = bootcamp.images?.[0];
  const ctaImage = bootcamp.images?.[1];
  const thumbnailImage = bootcamp.images?.[2];
  const posterImage = bootcamp.images?.[3];
  const socialPromoImage = bootcamp.images?.[4];

  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-midnight relative border-b border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl text-center">
          {isUpcoming ? (
            <span className="mx-auto mb-5 inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Coming Soon
            </span>
          ) : null}
          <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-6 block">
            {bootcamp.theme || "CEOs Bootcamp"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-8">
            {bootcamp.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate text-sm">
            {bootcamp.date && (
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gold" />
                <span>{bootcamp.date}</span>
              </div>
            )}
            {bootcamp.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gold" />
                <span>{bootcamp.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${isUpcoming ? 'bg-emerald-400 text-midnight' : 'bg-charcoal border border-slate/20 text-ivory'}`}>
                {bootcamp.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-midnight pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-10 relative z-20">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-charcoal border border-emerald-400/20 flex items-center justify-center relative shadow-2xl">
             <SafeImage src={heroImage} alt={bootcamp.title} fill priority sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" />
             <div className="absolute inset-0 bg-linear-to-t from-[#05070D]/55 via-transparent to-emerald-400/10" />
          </div>
        </div>
      </section>

      <section className="py-12 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none text-slate mb-16">
            <h2 className="font-serif text-2xl text-ivory font-bold mb-4">Overview</h2>
            <p>{bootcamp.overview}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="font-serif text-2xl text-ivory font-bold mb-6">Learning Objectives</h2>
              <ul className="space-y-4">
                {bootcamp.objectives?.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span className="text-slate">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-ivory font-bold mb-6">Session Topics</h2>
              <ul className="space-y-4">
                {bootcamp.topics?.map((topic, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span className="text-slate">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {isUpcoming ? (
        <section className="py-24 bg-[#05070D] border-y border-emerald-400/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white opacity-10" />
          <div className="pointer-events-none absolute -right-24 top-12 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1fr]">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-400/30 shadow-2xl shadow-black/40">
                <SafeImage
                  src={socialPromoImage || thumbnailImage}
                  alt={`${bootcamp.title} coming soon social promo`}
                  fill
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="mb-5 inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Coming Soon
                </div>
                <SectionHeader
                  subheading="Registration Interest Open"
                  heading="Built for executives preparing to lead with clarity"
                  description="CEOs Bootcamp 4.0 is positioned as a premium executive learning room for founders, C-suite leaders, entrepreneurs, and decision-makers who want sharper business discipline."
                  className="mb-8"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/20">
                    <SafeImage src={thumbnailImage} alt={`${bootcamp.title} event thumbnail`} fill sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover" />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-emerald-400/20">
                    <SafeImage src={posterImage} alt={`${bootcamp.title} promotional poster`} fill sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SpeakersGallery speakers={bootcamp.speakers} bootcampTitle={bootcamp.title} />

      <section className="py-24 bg-charcoal border-y border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader heading="Bootcamp Gallery" />
          <GalleryGrid images={bootcamp.images?.slice(1) || []} />
        </div>
      </section>

      {isUpcoming ? (
        <CTASection 
          heading={`Apply for ${bootcamp.title}`}
          text="Register interest for the next executive education session and be first to receive updates."
          primaryBtnText="Apply for Upcoming Bootcamp"
          primaryBtnLink="/contact"
          imageSrc={ctaImage}
          application={{
            activityTitle: bootcamp.title,
            activityId: bootcamp.id,
            activityType: "CEOs Bootcamp",
            source: "bootcamp",
          }}
        />
      ) : (
        <CTASection 
          heading="Join the Next Cohort"
          text="Missed this session? Apply for the upcoming CEOs Bootcamp."
          primaryBtnText="View Upcoming"
          primaryBtnLink="/ceos-bootcamp"
        />
      )}
    </div>
  );
}
