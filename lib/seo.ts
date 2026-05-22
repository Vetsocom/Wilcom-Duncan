import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    template: "%s | Wilcom Duncan",
    default: "Wilcom Duncan | SME Development Consultant, Speaker & Media Executive",
  },
  description:
    "Official website of Wilcom Duncan, Liberian entrepreneur, SME Development Consultant, business trainer, speaker, media executive, and founder-connected voice behind CEOs Bootcamp and CEOs Chat.",
  keywords: [
    "Wilcom Duncan",
    "Liberia SME Development Consultant",
    "CEOs Bootcamp Liberia",
    "Reecom Media",
    "CEOs Chat",
    "business development consultant Liberia",
    "corporate branding consultant",
    "business trainer Liberia",
    "entrepreneurship bootcamp Liberia",
    "executive training Liberia",
  ],
  authors: [{ name: "Wilcom Duncan" }],
};

export function constructMetadata({
  title,
  description,
}: {
  title?: string;
  description?: string;
}): Metadata {
  return {
    ...defaultMetadata,
    ...(title && { title }),
    ...(description && { description }),
  };
}
