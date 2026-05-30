import type { Metadata } from "next";
import { Camera, Images } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ImageCard } from "@/components/ImageCard";
import { getBootcamps } from "@/lib/cms";
import { constructMetadata } from "@/lib/seo";
import type { Bootcamp } from "@/data/bootcamps";

export const metadata: Metadata = constructMetadata({
  title: "Gallery | Events, Bootcamps, and Speaking Moments",
  description:
    "Explore photos from Wilcom Duncan events, CEOs Bootcamp sessions, trainings, and public business leadership engagements.",
});

export const dynamic = "force-dynamic";

const generalGalleryImages = [
  "/images/gallery.jpg",
  "/images/gallery1.jpg",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpg",
  "/images/gallery6.jpg",
  "/images/gallery7.jpg",
  "/images/gallery8.jpg",
  "/images/gallery9.jpg",
];

function uniqueImages(images: string[]) {
  return Array.from(new Set(images.filter(Boolean)));
}

export default async function GalleryPage() {
  const bootcamps = (await getBootcamps()) as Bootcamp[];
  const publishedBootcamps = bootcamps.filter((bootcamp) => bootcamp.published);
  const bootcampImages = uniqueImages(publishedBootcamps.flatMap((bootcamp) => bootcamp.images || []));
  const allImages = uniqueImages([...generalGalleryImages, ...bootcampImages]);
  const heroImage = allImages[0] || "/images/bootcamp/ceos-bootcamp-hero-speaker.jpg";

  const stats = [
    { value: allImages.length, label: "Gallery images" },
    { value: publishedBootcamps.length, label: "Bootcamp archives" },
  ];

  return (
    <div>
      <PageHero
        heading="Gallery"
        subheading="Events, bootcamps, and business leadership moments"
        intro="A visual archive of Wilcom Duncan's bootcamps, trainings, speaking engagements, and public business development work."
        image={heroImage}
        imageAlt="Wilcom Duncan gallery highlight"
      />

      <section className="border-b border-white/10 bg-charcoal py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
                <p className="font-serif text-4xl font-bold text-ivory">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-midnight py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subheading="Photo Archive"
            heading="Highlights from the Room"
            description="Selected moments from events, conversations, leadership sessions, and participant experiences."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {allImages.map((image, index) => (
              <ImageCard
                key={image}
                src={image}
                alt={`Wilcom Duncan gallery image ${index + 1}`}
                label={index === 0 ? "Featured" : undefined}
                className={index % 7 === 0 ? "aspect-[4/5] lg:row-span-2" : "aspect-square"}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      </section>

      {publishedBootcamps.length > 0 ? (
        <section className="border-y border-white/10 bg-charcoal py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              subheading="CEOs Bootcamp"
              heading="Bootcamp Gallery Sections"
              description="Each bootcamp keeps its own image section for visitors who want to browse a specific edition."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              {publishedBootcamps.map((bootcamp) => {
                const images = uniqueImages(bootcamp.images || []).slice(0, 4);
                if (!images.length) return null;

                return (
                  <article key={bootcamp.id} className="rounded-3xl border border-white/10 bg-midnight/70 p-5">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-ivory">{bootcamp.title}</h2>
                        <p className="mt-1 text-sm text-slate-300">{bootcamp.theme || "CEOs Bootcamp"}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                        <Images size={15} />
                        {images.length} photos
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {images.map((image, index) => (
                        <ImageCard
                          key={`${bootcamp.id}-${image}`}
                          src={image}
                          alt={`${bootcamp.title} gallery image ${index + 1}`}
                          className={index === 0 ? "aspect-[4/3] sm:col-span-2" : "aspect-square"}
                          sizes="(min-width: 1024px) 45vw, 100vw"
                        />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-midnight py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-ivory">
                <Camera size={20} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ivory">More moments are added as the archive grows.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Future bootcamp, training, and speaking photos can be uploaded through the admin media tools and surfaced here through each event archive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
