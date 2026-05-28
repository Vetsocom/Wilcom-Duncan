export type Bootcamp = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  location?: string;
  theme?: string;
  status: "past" | "upcoming";
  overview: string;
  objectives: string[];
  topics: string[];
  speakers: string[];
  images: string[];
  videos: string[];
  testimonials: string[];
  published: boolean;
  registrationOpen?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export const bootcamps: Bootcamp[] = [
  {
    id: "ceos-bootcamp-1",
    slug: "ceos-bootcamp-1",
    title: "CEOs Bootcamp 1.0",
    date: "2023",
    location: "Mamba Point Hotel",
    theme: "Business Leadership and Growth",
    status: "past",
    overview: "CEOs Bootcamp 1.0 introduced a practical business leadership experience designed for CEOs, founders, entrepreneurs, and emerging executives.",
    objectives: [
      "Strengthen business leadership capacity",
      "Improve understanding of business models",
      "Develop practical growth strategies"
    ],
    topics: [
      "Business model design",
      "Executive leadership",
      "SME growth"
    ],
    speakers: ["Wilcom Duncan"],
    images: ["/images/bootcamp/bootcamp-may-2024.jpg", "/images/bootcamp/bootcamp-2024.jpg", "/images/bootcamp/ceos-bootcamp-audience.jpg"],
    videos: [],
    testimonials: [
      "The bootcamp helped me rethink my business model and leadership approach.",
      "A practical experience for entrepreneurs who want clarity, discipline, and growth."
    ],
    published: true
  },
  {
    id: "ceos-bootcamp-december-edition-2024",
    slug: "ceos-bootcamp-december-edition-2024",
    title: "CEOs Bootcamp — December Edition 2024",
    date: "December 27, 2024",
    location: "Monrovia",
    theme: "Value Creation and Delivery",
    status: "past",
    overview: "A business model and growth strategy session focused on helping entrepreneurs understand how companies create, deliver, and capture value.",
    objectives: [
      "Build stronger communication habits",
      "Improve brand positioning"
    ],
    topics: [
      "Branding and visibility",
      "Corporate communication"
    ],
    speakers: ["Wilcom Duncan"],
    images: ["/images/bootcamp/bootcamp-2024.jpg", "/images/bootcamp/ceos-bootcamp-speaker-spotlight.jpg", "/images/bootcamp/global-entrepreneur-week-session.jpg"],
    videos: [],
    testimonials: [
      "CEOs Bootcamp created a powerful room for networking, learning, and business reflection."
    ],
    published: true
  },
  {
    id: "ceos-bootcamp-2",
    slug: "ceos-bootcamp-2",
    title: "CEOs Bootcamp 2.0",
    date: "2025",
    location: "Paynesville City Hall",
    theme: "Building with Clarity and Structure",
    status: "past",
    overview: "A leadership and business growth event focused on helping entrepreneurs and business operators build with clarity, mission, and structure.",
    objectives: [
      "Create room for networking and collaboration",
      "Develop practical growth strategies"
    ],
    topics: [
      "Strategy and execution",
      "Entrepreneurship discipline"
    ],
    speakers: ["Wilcom Duncan"],
    images: ["/images/bootcamp/ceos-bootcamp-audience.jpg", "/images/bootcamp/ceos-bootcamp-community-collage.jpg", "/images/bootcamp/global-entrepreneur-week-session.jpg"],
    videos: [],
    testimonials: [
      "The bootcamp helped me rethink my business model and leadership approach."
    ],
    published: true
  },
  {
    id: "ceos-bootcamp-4",
    slug: "ceos-bootcamp-4",
    title: "CEOs Bootcamp 4.0",
    date: "November 6, 2026",
    location: "To Be Confirmed",
    theme: "To Be Confirmed",
    status: "upcoming",
    registrationOpen: true,
    overview: "An upcoming executive education experience for C-Suite executives, entrepreneurs, and experienced business leaders.",
    objectives: [
      "Strengthen business leadership capacity",
      "Improve understanding of business models",
      "Develop practical growth strategies",
      "Build stronger communication habits",
      "Improve brand positioning",
      "Create room for networking and collaboration"
    ],
    topics: [
      "Business model design",
      "Executive leadership",
      "SME growth",
      "Branding and visibility",
      "Corporate communication",
      "Strategy and execution",
      "Entrepreneurship discipline"
    ],
    speakers: ["Wilcom Duncan"],
    images: [
      "/images/bootcamp/upcoming/ceos-bootcamp-4-side-profile.jpg",
      "/images/bootcamp/upcoming/ceos-bootcamp-4-side-profile-alt.jpg",
      "/images/bootcamp/upcoming/ceos-bootcamp-4-coming-soon-executive.jpg",
      "/images/bootcamp/upcoming/ceos-bootcamp-4-coming-soon-woman.jpg",
      "/images/bootcamp/upcoming/ceos-bootcamp-4-mobile-preview.jpg"
    ],
    videos: [],
    testimonials: [],
    published: true
  },
  {
    id: "strategic-foresight-2024",
    slug: "strategic-foresight-2024",
    title: "Strategic Foresight for 2024",
    date: "2024",
    location: "Monrovia",
    theme: "Strategic Planning and Business Readiness",
    status: "past",
    overview: "Strategic Foresight for 2024 helped entrepreneurs and business leaders think clearly about planning, positioning, execution, and opportunities for the year ahead.",
    objectives: [
      "Improve strategic planning habits",
      "Identify growth opportunities",
      "Strengthen execution discipline"
    ],
    topics: [
      "Strategic foresight",
      "Business planning",
      "Market positioning"
    ],
    speakers: ["Wilcom Duncan"],
    images: ["/images/bootcamp/strategic-foresight-2024-flyer.jpg", "/images/bootcamp/global-entrepreneur-week-session.jpg", "/images/bootcamp/ceos-bootcamp-speaker-spotlight.jpg"],
    videos: [],
    testimonials: [],
    published: true
  }
];
