import { cn } from "@/lib/utils";
import { SafeImage } from "./SafeImage";

interface ImageCardProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  label?: string;
  priority?: boolean;
  sizes?: string;
}

export function ImageCard({
  src,
  alt,
  className,
  imageClassName,
  label,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: ImageCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/30",
        className
      )}
    >
      <SafeImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/45 via-transparent to-white/5" />
      {label ? (
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#070B14]/65 px-4 py-3 text-sm font-semibold text-ivory backdrop-blur-md">
          {label}
        </div>
      ) : null}
    </div>
  );
}
