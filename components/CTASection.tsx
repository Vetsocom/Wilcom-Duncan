"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./Button";
import { ApplicationFormModal } from "./ApplicationFormModal";
import { SafeImage } from "./SafeImage";

type ApplicationSource = "calendar" | "bootcamp" | "event" | "general";

interface CTASectionProps {
  heading: string;
  text: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  imageSrc?: string;
  application?: {
    activityTitle?: string;
    activityId?: string;
    activityType?: string;
    source?: ApplicationSource;
  };
}

export function CTASection({
  heading,
  text,
  primaryBtnText,
  primaryBtnLink,
  secondaryBtnText,
  secondaryBtnLink,
  imageSrc,
  application
}: CTASectionProps) {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  return (
    <>
      <section className="py-24 relative overflow-hidden bg-charcoal border-y border-white/10">
        <div className="absolute inset-0 bg-grid-white opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.06] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid grid-cols-1 ${imageSrc ? "lg:grid-cols-2 gap-16 items-center" : "text-center max-w-3xl mx-auto"}`}>
            <div className={imageSrc ? "" : ""}>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-ivory mb-6">
                {heading}
              </h2>
              <p className="text-slate text-lg mb-10">
                {text}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 ${imageSrc ? "" : "justify-center"}`}>
                {application ? (
                  <Button type="button" size="lg" onClick={() => setIsApplicationOpen(true)}>
                    {primaryBtnText}
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <Link href={primaryBtnLink}>{primaryBtnText}</Link>
                  </Button>
                )}
                {secondaryBtnText && secondaryBtnLink && (
                  <Button asChild variant="outline" size="lg">
                    <Link href={secondaryBtnLink}>{secondaryBtnText}</Link>
                  </Button>
                )}
              </div>
            </div>
            
            {imageSrc && (
              <div className="relative order-first lg:order-last">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative z-10">
                  <SafeImage
                    src={imageSrc}
                    alt={heading}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-full h-full border border-white/15 rounded-[2rem] -z-10" />
              </div>
            )}
          </div>
        </div>
      </section>

      {application && (
        <ApplicationFormModal
          isOpen={isApplicationOpen}
          onClose={() => setIsApplicationOpen(false)}
          activityTitle={application.activityTitle}
          activityId={application.activityId}
          activityType={application.activityType}
          source={application.source}
        />
      )}
    </>
  );
}
