import { ReactNode } from "react";
import { MotionWrapper } from "./MotionWrapper";

interface TimelineYearGroupProps {
  year: number;
  children: ReactNode;
}

export function TimelineYearGroup({ year, children }: TimelineYearGroupProps) {
  return (
    <div className="relative pl-8 md:pl-0">
      {/* Vertical line for desktop */}
      <div className="hidden md:block absolute left-[50%] translate-x-[-0.5px] top-0 bottom-0 w-px bg-slate/10" />
      
      {/* Year badge */}
      <MotionWrapper className="relative z-10 flex justify-start md:justify-center mb-12">
        <div className="bg-charcoal border border-gold/30 px-6 py-2 rounded-full shadow-lg shadow-gold/5">
          <span className="font-serif text-2xl font-bold text-ivory">{year}</span>
        </div>
      </MotionWrapper>
      
      <div className="space-y-8 relative">
        {/* Vertical line for mobile */}
        <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-slate/10 ml-[-19px]" />
        {children}
      </div>
    </div>
  );
}
