"use client";

import { SafeImage } from "./SafeImage";
import { User } from "lucide-react";
import type { Speaker } from "@/data/bootcamps";

interface SpeakersGalleryProps {
  speakers: Speaker[];
  bootcampTitle: string;
}

export function SpeakersGallery({ speakers, bootcampTitle }: SpeakersGalleryProps) {
  const validSpeakers = speakers?.filter((s) => s.name && s.name.trim() !== "");
  if (!validSpeakers || validSpeakers.length === 0) return null;

  return (
    <section className="py-24 bg-midnight border-y border-slate/10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold border border-gold/30 rounded-full px-4 py-1.5 bg-gold/5">
            Speakers
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
            Meet the Speakers
          </h2>
          <p className="mt-4 text-slate text-base max-w-xl mx-auto">
            The voices who shaped{" "}
            <span className="text-ivory font-medium">{bootcampTitle}</span>.
          </p>
          <div className="mt-6 mx-auto w-12 h-px bg-gold/50" />
        </div>

        {/* Speaker cards */}
        <div
          className={`grid gap-8 ${
            validSpeakers.length === 1
              ? "grid-cols-1 max-w-sm mx-auto"
              : validSpeakers.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {validSpeakers.map((speaker, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center rounded-3xl bg-charcoal border border-slate/10 p-8 transition-all duration-300 hover:border-gold/30 hover:shadow-[0_0_40px_0_rgba(212,175,55,0.07)]"
            >
              {/* Photo */}
              <div className="relative mb-6 h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-gold/30 shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-105">
                {speaker.image ? (
                  <SafeImage
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    sizes="128px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-midnight/60">
                    <User size={48} className="text-slate" />
                  </div>
                )}
                {/* Gold ring on hover */}
                <div className="absolute inset-0 rounded-full ring-2 ring-gold/0 transition-all duration-300 group-hover:ring-gold/40" />
              </div>

              {/* Name & title */}
              <h3 className="font-serif text-xl font-bold text-ivory mb-1 leading-tight">
                {speaker.name}
              </h3>
              {speaker.title && (
                <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">
                  {speaker.title}
                </span>
              )}

              {/* Divider */}
              {speaker.bio && (
                <>
                  <div className="w-8 h-px bg-gold/30 mb-4" />
                  <p className="text-sm text-slate leading-7">{speaker.bio}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
