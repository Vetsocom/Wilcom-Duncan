import { Metadata } from "next";
import { HeroEditorial } from "@/components/HeroEditorial";
import { SectionHeader } from "@/components/SectionHeader";
import { ExpertiseCard } from "@/components/ExpertiseCard";
import { ProjectEventCard } from "@/components/ProjectEventCard";
import { CalendarActivities } from "@/components/CalendarActivities";
import { BlogCard } from "@/components/BlogCard";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import Link from "next/link";
import { getBlogPosts, getBootcamps, getCalendarActivities, getProfile, getProjects, getSettings } from "@/lib/cms";
import type { ProjectEvent } from "@/data/projects";
import type { CalendarActivity } from "@/data/calendarActivities";
import type { BlogPost } from "@/data/blog";
import type { Bootcamp } from "@/data/bootcamps";
import { SafeImage } from "@/components/SafeImage";

export const metadata: Metadata = {
  title: "Wilcom Duncan | SME Development Consultant & Executive Business Trainer",
  description:
    "Official website of Wilcom Duncan, Liberian SME Development Consultant, entrepreneur, speaker, media executive, and founder of CEOs Bootcamp.",
};

export const dynamic = "force-dynamic";

type CmsProfile = {
  bio: string;
  heroParagraph: string;
  aboutPreviewText: string;
  impactStats: { value: string; label: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  expertiseAreas: { title: string; description: string }[];
  images?: Record<string, string>;
};

type CmsSettings = {
  schedulingLink?: string;
};

export default async function Home() {
  const [profile, projects, calendarActivities, blogPosts, bootcamps, settings] = await Promise.all([
    getProfile() as Promise<CmsProfile>,
    getProjects() as Promise<ProjectEvent[]>,
    getCalendarActivities() as Promise<CalendarActivity[]>,
    getBlogPosts() as Promise<BlogPost[]>,
    getBootcamps() as Promise<Bootcamp[]>,
    getSettings() as Promise<CmsSettings>,
  ]);
  const featuredProjects = projects.slice(0, 3);
  const featuredBlogs = blogPosts.slice(0, 3);
  const profileImages = profile.images || {};
  const featuredBootcampImage =
    bootcamps.find((bootcamp) => bootcamp.status === "upcoming")?.images?.[0] ||
    bootcamps[0]?.images?.[0] ||
    "/images/bootcamp/ceos-bootcamp-hero-speaker.jpg";

  return (
    <div>
      <HeroEditorial imageSrc={profileImages.hero} intro={profile.heroParagraph} />

      {/* About Preview */}
      <section className="py-24 bg-midnight relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-4/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <SafeImage
                  src={profileImages.about || "/images/blog-3.jpg"}
                  alt="Wilcom Duncan portrait"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border border-white/15 rounded-3xl -z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader 
                heading="From Business Insight to Executive Action"
              />
              <p className="text-slate text-lg md:text-xl leading-relaxed mb-8">
                {profile.aboutPreviewText}
              </p>
              <Button asChild size="lg">
                <Link href="/about">Learn More About Wilcom</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-charcoal border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subheading="Impact at a Glance"
            heading="Built Around Business Growth, Leadership, and Execution"
            description="Across bootcamps, business sessions, media conversations, and executive engagements, Wilcom's work is centered on helping leaders think clearly, communicate value, and build stronger organizations."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {profile.impactStats.map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="premium-card min-h-48 p-7 hover:border-white/25">
                <p className="mb-5 font-serif text-5xl font-bold text-white">{stat.value}</p>
                <p className="text-sm leading-7 text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="py-24 bg-charcoal border-y border-slate/10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader 
            heading="Areas of Expertise"
            description="Wilcom's work cuts across business, leadership, media, communication, and entrepreneurship development."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.expertiseAreas.map((area, index) => (
              <ExpertiseCard key={index} index={index} title={area.title} description={area.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects & Events */}
      <section className="py-24 bg-midnight relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeader 
              heading="Projects, Events, Trainings, and Public Engagements"
              description="Wilcom Duncan has been involved in business bootcamps, executive conversations, media interviews, leadership trainings, entrepreneurship programs, and public speaking engagements designed to support entrepreneurs, SMEs, CEOs, and emerging leaders."
              className="mb-0 max-w-3xl"
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/projects-events">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectEventCard key={project.id} index={index} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* CEOs Bootcamp Feature */}
      <section className="py-24 bg-charcoal relative overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-[600px] bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader 
                subheading="Executive Platform"
                heading="CEOs Bootcamp"
                description="A practical leadership and business growth platform for CEOs, founders, entrepreneurs, and decision-makers."
              />
              <p className="text-slate text-lg mb-8 leading-relaxed">
                CEOs Bootcamp is designed to help business leaders sharpen their thinking, improve their business models, strengthen leadership discipline, and connect with other entrepreneurs who are serious about growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/ceos-bootcamp">Explore CEOs Bootcamp</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/ceos-bootcamp#upcoming">Apply for Upcoming Bootcamp</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square md:aspect-4/3 rounded-2xl overflow-hidden bg-linear-to-br from-midnight to-slate/20 border border-slate/10 flex items-center justify-center relative z-10">
                <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
                <SafeImage
                  src={featuredBootcampImage}
                  alt="CEOs Bootcamp"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border border-white/15 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Activities Preview */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionHeader 
              heading="Monthly Activities"
              description="Explore Wilcom Duncan's upcoming trainings, bootcamps, speaking engagements, workshops, and public activities. Visitors can click on highlighted dates to view activity details and apply or register directly."
              centered
            />
          </div>
          <CalendarActivities activities={calendarActivities} schedulingLink={settings.schedulingLink} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-charcoal border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subheading="Social Proof"
            heading="What Leaders and Participants Say"
            description="Real voices from entrepreneurs, executives, and participants who have experienced Wilcom's business development sessions and CEOs Bootcamp programs."
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {profile.testimonials.map((testimonial) => (
              <figure key={`${testimonial.name}-${testimonial.role}`} className="premium-card flex h-full flex-col p-8">
                <p aria-hidden="true" className="mb-5 font-serif text-5xl leading-none text-white/40">&ldquo;</p>
                <blockquote className="grow font-serif text-xl leading-9 text-white">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-white/10 pt-5">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-300">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-charcoal border-t border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeader 
              heading="Insights on Business, Leadership, Branding, and Growth"
              description="Read Wilcom Duncan's thoughts on entrepreneurship, SME development, business communication, leadership, branding, and the practical mindset required to build sustainable businesses."
              className="mb-0 max-w-3xl"
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/blog">View All Articles</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((post, index) => (
              <BlogCard key={post.id} index={index} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection 
        heading="Ready to Bring Wilcom Into the Room?"
        text="Book a consultation, invite Wilcom to speak, or partner with CEOs Bootcamp to create a business learning experience built around clarity, execution, and growth."
        primaryBtnText="Schedule Consultation"
        primaryBtnLink="/contact#schedule"
        secondaryBtnText="Send Inquiry"
        secondaryBtnLink="/contact#inquiry-form"
        imageSrc="/images/blog-2.jpg"
      />
    </div>
  );
}
