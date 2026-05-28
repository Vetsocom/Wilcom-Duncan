import { MotionWrapper } from "./MotionWrapper";

interface ExpertiseCardProps {
  title: string;
  description: string;
  index: number;
}

export function ExpertiseCard({ title, description, index }: ExpertiseCardProps) {
  return (
    <MotionWrapper delay={index * 0.1} className="group relative">
      <div className="premium-card relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div>
          <span className="mb-4 block font-mono text-sm text-white/45 transition-colors duration-300 group-hover:text-white">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mb-4 font-serif text-2xl font-bold text-ivory transition-colors group-hover:text-white">
            {title}
          </h3>
          <p className="text-base leading-8 text-slate-300">
            {description}
          </p>
        </div>
      </div>
    </MotionWrapper>
  );
}
