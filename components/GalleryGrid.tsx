import { ImageCard } from "./ImageCard";

interface GalleryGridProps {
  images: string[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={index}
          src={image}
          alt={`Wilcom Duncan event gallery image ${index + 1}`}
          className="aspect-square rounded-2xl"
          sizes="(min-width: 768px) 33vw, 50vw"
        />
      ))}
    </div>
  );
}
