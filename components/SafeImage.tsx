"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackClassName?: string;
};

function normalizeSrc(src?: string | null) {
  const value = typeof src === "string" ? src.trim() : "";
  if (!value) return "";
  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `/images/${value}`;
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fill,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = normalizeSrc(src);

  if (!imageSrc || failed) {
    return (
      <div
        className={cn(
          fill ? "absolute inset-0" : "h-full w-full",
          "bg-[radial-gradient(circle_at_30%_20%,rgba(201,154,61,0.26),transparent_34%),linear-gradient(135deg,#111827,#070B14_55%,#0F172A)]",
          fallbackClassName
        )}
        aria-label={alt}
        role="img"
      />
    );
  }

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
