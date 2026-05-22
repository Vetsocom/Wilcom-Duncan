import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getBootcamps } from "@/lib/cms";
import type { Bootcamp } from "@/data/bootcamps";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

export async function generateStaticParams() {
  const bootcamps = (await getBootcamps()) as Bootcamp[];
  return bootcamps.filter((b) => b.slug && b.published).map((b) => ({
    slug: b.slug,
  }));
}

export default async function BootcampDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const bootcamps = (await getBootcamps()) as Bootcamp[];
  const bootcamp = bootcamps.find((b) => b.slug === slug && b.published);
  
  if (!bootcamp) {
    notFound();
  }

  return (
    <div>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-midnight relative border-b border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl text-center">
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${bootcamp.status === 'upcoming' ? 'bg-gold text-midnight' : 'bg-charcoal border border-slate/20 text-ivory'}`}>
                {bootcamp.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-midnight pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-10 relative z-20">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-charcoal border border-slate/10 flex items-center justify-center relative shadow-2xl">
             {bootcamp.images?.[0] ? (
               <Image src={bootcamp.images[0]} alt={bootcamp.title} fill className="object-cover" />
             ) : (
               <span className="text-slate/40 font-serif opacity-50">No hero image selected</span>
             )}
             <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
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

      <section className="py-24 bg-charcoal border-y border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader heading="Bootcamp Gallery" />
          <GalleryGrid images={bootcamp.images?.slice(1) || []} />
        </div>
      </section>

      {bootcamp.status === 'upcoming' ? (
        <CTASection 
          heading={`Apply for ${bootcamp.title}`}
          text="Secure your spot in the next executive education session."
          primaryBtnText="Apply Now"
          primaryBtnLink="/contact"
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
