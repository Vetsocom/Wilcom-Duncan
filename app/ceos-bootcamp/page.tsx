import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { BootcampCard } from "@/components/BootcampCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import { getBootcamps, getProfile } from "@/lib/cms";
import type { Bootcamp } from "@/data/bootcamps";
import { constructMetadata } from "@/lib/seo";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";

export const metadata: Metadata = constructMetadata({
  title: "CEOs Bootcamp | Executive Business Leadership Platform",
});

export const dynamic = "force-dynamic";

export default async function CEOsBootcampPage() {
  const [bootcamps, profile] = (await Promise.all([getBootcamps(), getProfile()])) as [Bootcamp[], { images?: Record<string, string> }];
  const publishedBootcamps = bootcamps.filter((b) => b.slug && b.published);
  const pastBootcamps = publishedBootcamps.filter(b => b.status === "past");
  const upcomingBootcamp = publishedBootcamps.find(b => b.status === "upcoming");
  const bootcampImages = publishedBootcamps.flatMap((bootcamp) => bootcamp.images || []);
  const heroImage = upcomingBootcamp?.images?.[0] || bootcampImages[0] || "/images/bootcamp/ceos-bootcamp-hero-speaker.jpg";
  const communityImage = upcomingBootcamp?.images?.[1] || bootcampImages[1] || "/images/bootcamp/ceos-bootcamp-community-collage.jpg";
  const upcomingCardImage = upcomingBootcamp?.images?.[2] || heroImage;
  const upcomingPosterImage = upcomingBootcamp?.images?.[3] || communityImage;
  const upcomingMobileImage = upcomingBootcamp?.images?.[4] || upcomingCardImage;
  const hostImage = profile.images?.speakerProfile || profile.images?.hero || "/images/bootcamp/bootcamp-featured-portrait.jpg";

  const learningCards = [
    { title: "Business Model Development", desc: "Understand how your business creates, delivers, and captures value." },
    { title: "Growth Strategy", desc: "Learn how to think beyond survival and build systems for sustainable business growth." },
    { title: "Leadership Discipline", desc: "Develop the mindset, habits, and responsibility required to lead people and organizations." },
    { title: "Corporate Communication", desc: "Improve how you communicate ideas, value, vision, and business direction." },
    { title: "Brand Positioning", desc: "Learn how to make your business more visible, trusted, and memorable." },
    { title: "Strategic Partnerships", desc: "Understand how relationships, collaboration, and networks can support growth." },
    { title: "Operational Thinking", desc: "Strengthen how you think about structure, systems, execution, and business performance." }
  ];

  const faqs = [
    { question: "Who can attend CEOs Bootcamp?", answer: "CEOs Bootcamp is created for entrepreneurs, CEOs, founders, SME owners, executives, and emerging business leaders." },
    { question: "Is it only for CEOs?", answer: "No. While it focuses on executive leadership, founders, senior managers, and emerging business leaders who want to learn enterprise discipline are welcome." },
    { question: "How do I apply?", answer: "You can apply via the 'Apply for Upcoming Bootcamp' button. Applications are reviewed before acceptance." },
    { question: "Will there be certificates?", answer: "Yes, participants receive a certificate of completion acknowledging their participation in the executive education program." },
    { question: "Can companies sponsor participants?", answer: "Yes. Many organizations sponsor their managers and executives as part of their corporate training and capacity-building initiatives." },
    { question: "Can I partner with CEOs Bootcamp?", answer: "Yes, we welcome partnerships, venue support, and media collaboration. Use the contact page to reach out." }
  ];

  return (
    <div>
      <PageHero 
        heading="CEOs Bootcamp"
        subheading="A Liberia's summit for CEOs by CEOs"
        intro="CEOs Bootcamp is designed to help business leaders sharpen their thinking, strengthen their leadership capacity, improve their business models, and connect with other entrepreneurs and executives committed to growth."
        image={heroImage}
      />

      {/* What is CEOs Bootcamp */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader heading="What Is CEOs Bootcamp?" />
              <div className="text-slate text-lg leading-relaxed space-y-6">
                <p>
                  CEOs Bootcamp is a business growth and leadership development platform created for entrepreneurs, CEOs, founders, SME owners, executives, and emerging business leaders.
                </p>
                <p>
                  The bootcamp focuses on practical business education, strategic thinking, leadership discipline, communication, branding, and enterprise development. It gives participants a space to learn, connect, reflect, and build the mindset required to lead stronger organizations.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-4/3 rounded-4xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <SafeImage
                  src={communityImage}
                  alt="CEOs Bootcamp Community"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold/20 rounded-[2rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Host */}
      <section className="py-24 bg-charcoal border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/5] max-w-md mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <SafeImage
                  src={hostImage}
                  alt="Featured Host"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader subheading="Host & Lead Facilitator" heading="Wilcom Duncan" />
              <p className="text-slate text-lg leading-relaxed mb-6">
                As the lead facilitator and host, Wilcom brings years of executive experience to the Bootcamp. His sessions focus deeply on breaking down complex business models into actionable execution strategies.
              </p>
              <p className="text-slate text-lg leading-relaxed mb-8">
                With a strong background in media strategy, enterprise leadership, and SME development, he works with participants to find clarity and build the discipline required to scale their operations successfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section className="py-24 bg-charcoal border-y border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Who Should Attend?" centered />
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {["CEOs", "Founders", "Entrepreneurs", "SME owners", "Startup operators", "Corporate managers", "C-Suite executives", "Emerging business leaders", "Business students and professionals preparing for leadership"].map((item, i) => (
              <div key={i} className="px-6 py-3 bg-midnight border border-gold/20 rounded-full text-ivory text-sm font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Participants Learn */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="What Participants Learn" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningCards.map((card, i) => (
              <div key={i} className="p-8 border border-slate/10 rounded-xl bg-charcoal/50 hover:border-gold/30 transition-colors">
                <h4 className="font-serif text-xl font-bold text-gold mb-3">{card.title}</h4>
                <p className="text-slate">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Bootcamp */}
      {upcomingBootcamp && (
        <section id="upcoming" className="relative overflow-hidden border-y border-emerald-400/20 bg-[#05070D] py-24">
          <div className="absolute inset-0 bg-grid-white opacity-10" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent" />
          <div className="pointer-events-none absolute left-[-10rem] top-20 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-[-12rem] right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[120px]" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <div className="mb-5 inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Coming Soon
                </div>
                <SectionHeader
                  subheading="Upcoming Executive Bootcamp"
                  heading={upcomingBootcamp.title}
                  description={upcomingBootcamp.overview}
                  className="mb-8"
                />
                <div className="mb-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="block text-xs uppercase tracking-[0.18em] text-emerald-300">Date</span>
                    <span className="mt-1 block font-semibold text-ivory">{upcomingBootcamp.date || "Coming soon"}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="block text-xs uppercase tracking-[0.18em] text-emerald-300">Location</span>
                    <span className="mt-1 block font-semibold text-ivory">{upcomingBootcamp.location || "To be confirmed"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Button asChild size="lg">
                    <Link href={`/ceos-bootcamp/${upcomingBootcamp.slug}`}>Apply for Upcoming Bootcamp</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-emerald-400/50 text-emerald-200 hover:border-emerald-300 hover:bg-emerald-400/10">
                    <Link href="/contact?type=bootcamp">Register Interest</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr]">
                <div className="relative min-h-[28rem] overflow-hidden rounded-3xl border border-emerald-400/25 shadow-2xl shadow-black/40">
                  <SafeImage
                    src={heroImage}
                    alt={`${upcomingBootcamp.title} promotional hero`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#05070D]/70 via-transparent to-emerald-400/10" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#05070D]/75 px-4 py-3 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Executive Education</p>
                    <p className="mt-1 font-serif text-2xl font-bold text-ivory">CEOs Bootcamp 4.0</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold/20">
                    <SafeImage
                      src={upcomingCardImage}
                      alt={`${upcomingBootcamp.title} event thumbnail`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-emerald-400/25">
                    <SafeImage
                      src={upcomingMobileImage}
                      alt={`${upcomingBootcamp.title} social promo preview`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-emerald-400/20 sm:col-span-2">
                  <SafeImage
                    src={upcomingPosterImage}
                    alt={`${upcomingBootcamp.title} alternate promotional poster`}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Past Bootcamps */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Past Bootcamps" />
          <div className="space-y-8 max-w-4xl mx-auto">
            {pastBootcamps.map((bootcamp, i) => (
              <BootcampCard key={bootcamp.id} bootcamp={bootcamp} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Audience */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="The Bootcamp Experience" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-xl relative">
               <SafeImage src={bootcampImages[2] || "/images/bootcamp/ceos-bootcamp-audience.jpg"} alt="Audience" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-xl relative">
               <SafeImage src={bootcampImages[3] || "/images/bootcamp/strategic-foresight-2024-flyer.jpg"} alt="Flyer" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-xl relative">
               <SafeImage src={bootcampImages[4] || "/images/bootcamp/ceos-bootcamp-speaker-spotlight.jpg"} alt="Speaker Spotlight" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-charcoal border-y border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Participant Experience" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {["The bootcamp helped me rethink my business model and leadership approach.",
              "A practical experience for entrepreneurs who want clarity, discipline, and growth.",
              "CEOs Bootcamp created a powerful room for networking, learning, and business reflection."].map((quote, i) => (
                <div key={i} className="p-8 bg-midnight border border-slate/20 rounded-xl relative">
                  <span className="text-gold font-serif text-4xl absolute top-4 left-4 opacity-20">"</span>
                  <p className="text-slate italic relative z-10 mt-4">{quote}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Frequently Asked Questions" centered />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <CTASection 
        heading="Ready to Lead Better?"
        text="Join the next CEOs Bootcamp cohort and build the discipline required for growth."
        primaryBtnText="Apply for Upcoming Bootcamp"
        primaryBtnLink="/contact"
        application={upcomingBootcamp ? {
          activityTitle: upcomingBootcamp.title,
          activityId: upcomingBootcamp.id,
          activityType: "CEOs Bootcamp",
          source: "bootcamp",
        } : {
          activityTitle: "CEOs Bootcamp",
          activityType: "CEOs Bootcamp",
          source: "bootcamp",
        }}
      />
    </div>
  );
}
