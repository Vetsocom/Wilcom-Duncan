import Link from "next/link";
import { ProjectEvent } from "@/data/projects";
import { MotionWrapper } from "./MotionWrapper";
import { ImageCard } from "./ImageCard";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

interface ProjectEventCardProps {
  project: ProjectEvent;
  index: number;
}

export function ProjectEventCard({ project, index }: ProjectEventCardProps) {
  return (
    <MotionWrapper delay={index * 0.1} className="group premium-card flex h-full flex-col overflow-hidden">
      <div className="relative">
        <ImageCard
          src={project.images[0]}
          alt={project.title}
          className="aspect-video rounded-none border-0 shadow-none"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute right-4 top-4 z-20">
          <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${project.status === 'upcoming' ? 'bg-gold text-midnight' : 'bg-midnight/80 text-ivory border border-slate/20 backdrop-blur-sm'}`}>
            {project.status}
          </span>
        </div>
      </div>
      
      <div className="flex grow flex-col justify-between p-6 md:p-8">
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {project.category} • {project.year}
          </div>
          <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-ivory transition-colors group-hover:text-gold">
            {project.title}
          </h3>
          <p className="mb-6 line-clamp-3 text-sm leading-7 text-slate-300">
            {project.excerpt}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            {project.date && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gold" />
                <span>{project.date}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                <span>{project.location}</span>
              </div>
            )}
          </div>
          
          <Link href={`/projects-events/${project.slug}`} className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10">
            Read More <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </MotionWrapper>
  );
}
