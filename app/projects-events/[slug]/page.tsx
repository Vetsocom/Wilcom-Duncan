import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { GalleryGrid } from "@/components/GalleryGrid";
import { VideoEmbedGrid } from "@/components/VideoEmbedGrid";
import { CTASection } from "@/components/CTASection";
import { getProjects } from "@/lib/cms";
import type { ProjectEvent } from "@/data/projects";
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
  const projects = (await getProjects()) as ProjectEvent[];
  const project = projects.find((p) => p.slug === slug);
  if (!project) return constructMetadata({ title: "Not Found" });
  return constructMetadata({
    title: project.title,
    description: project.excerpt,
  });
}

export default async function ProjectEventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = (await getProjects()) as ProjectEvent[];
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    notFound();
  }

  const relatedEvents = projects.filter(p => p.id !== project.id).slice(0, 3);

  return (
    <div>
      {/* Detail Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-midnight relative border-b border-slate/10">
        <div className="absolute inset-0 bg-grid-white opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-6 block">
            {project.category} • {project.year}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-8">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate text-sm">
            {project.date && (
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gold" />
                <span>{project.date}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gold" />
                <span>{project.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${project.status === 'upcoming' ? 'bg-gold text-midnight' : 'bg-charcoal border border-slate/20 text-ivory'}`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="bg-midnight pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-10 relative z-20">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-charcoal border border-slate/10 flex items-center justify-center relative shadow-2xl">
             <SafeImage src={project.images?.[0]} alt={project.title} fill className="object-cover" />
             <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none text-slate">
            
            <h2 className="font-serif text-2xl text-ivory font-bold mb-4">Overview</h2>
            <p>{project.description}</p>
            
            <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-xl border border-gold/10 bg-charcoal/50">
              <div>
                <h3 className="font-serif text-xl text-gold font-bold mb-3">Wilcom's Role</h3>
                <p className="text-base">{project.role}</p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-gold font-bold mb-3">Key Topics Covered</h3>
                <ul className="list-disc pl-5 text-base space-y-1">
                  {project.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="font-serif text-2xl text-ivory font-bold mb-4">Outcomes and Impact</h2>
            {project.outcomes.map((outcome, i) => (
              <p key={i}>{outcome}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="py-24 bg-charcoal border-y border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <SectionHeader heading="Event Gallery" />
          <GalleryGrid images={project.images || []} />
          
          <div className="mt-16">
            <SectionHeader heading="Videos" />
            <VideoEmbedGrid videos={project.videos || []} />
          </div>
        </div>
      </section>

      {project.status === 'upcoming' ? (
        <CTASection 
          heading={`Join ${project.title}`}
          text="Apply now to be part of this upcoming event."
          primaryBtnText="Apply / Register"
          primaryBtnLink="/contact"
          application={{
            activityTitle: project.title,
            activityId: project.id,
            activityType: project.category,
            source: "event",
          }}
        />
      ) : (
        <CTASection 
          heading="Book Wilcom for Your Next Event"
          text="Bring similar impact to your organization through a dedicated speaking or training session."
          primaryBtnText="Contact Wilcom"
          primaryBtnLink="/contact"
        />
      )}
    </div>
  );
}
