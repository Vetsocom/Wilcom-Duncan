import Link from "next/link";
import { Bootcamp } from "@/data/bootcamps";
import { MotionWrapper } from "./MotionWrapper";
import { ImageCard } from "./ImageCard";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

interface BootcampCardProps {
  bootcamp: Bootcamp;
  index: number;
}

export function BootcampCard({ bootcamp, index }: BootcampCardProps) {
  return (
    <MotionWrapper delay={index * 0.1} className="group premium-card relative overflow-hidden">
      <div className="flex h-full flex-col md:flex-row">
        <div className="relative w-full md:w-2/5">
           <ImageCard
             src={bootcamp.images[0]}
             alt={bootcamp.title}
             className=" rounded-none border-0 shadow-none md:h-full md:min-h-68"
             sizes="(min-width: 768px) 40vw, 100vw"
           />
           <div className="absolute left-4 top-4 z-20">
             <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${bootcamp.status === 'upcoming' ? 'bg-gold text-midnight' : 'bg-midnight/80 text-ivory border border-slate/20 backdrop-blur-sm'}`}>
               {bootcamp.status}
             </span>
           </div>
        </div>
        
        <div className="flex w-full flex-col justify-between p-6 md:w-3/5 md:p-8">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {bootcamp.theme || "CEOs Bootcamp"}
            </div>
            <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-ivory transition-colors group-hover:text-gold">
              {bootcamp.title}
            </h3>
            <p className="mb-6 line-clamp-2 text-sm leading-7 text-slate-300 md:line-clamp-3">
              {bootcamp.overview}
            </p>
            
            <div className="mb-6 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {bootcamp.date && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gold" />
                  <span>{bootcamp.date}</span>
                </div>
              )}
              {bootcamp.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gold" />
                  <span>{bootcamp.location}</span>
                </div>
              )}
            </div>
          </div>
          
          <Link href={`/ceos-bootcamp/${bootcamp.slug}`} className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10">
            View Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </MotionWrapper>
  );
}
