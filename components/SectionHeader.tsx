import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  heading: string;
  subheading?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  heading,
  subheading,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 mb-12", centered && "items-center text-center", className)}>
      {subheading && (
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
          {subheading}
        </span>
      )}
      <h2 className="max-w-3xl font-serif text-3xl font-bold leading-tight text-ivory sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
