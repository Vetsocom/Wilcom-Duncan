import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wilcomduncan.com";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Wilcom Duncan",
    default: "Wilcom Duncan | SME Development Consultant & Executive Business Trainer",
  },
  description:
    "Official website of Wilcom Duncan, Liberian SME Development Consultant, entrepreneur, speaker, media executive, and founder of CEOs Bootcamp.",
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Wilcom Duncan",
    title: "Wilcom Duncan | SME Development Consultant & Executive Business Trainer",
    description:
      "Official website of Wilcom Duncan, Liberian SME Development Consultant, entrepreneur, speaker, media executive, and founder of CEOs Bootcamp.",
  },
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
