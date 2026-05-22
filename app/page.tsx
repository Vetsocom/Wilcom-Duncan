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
import { getBlogPosts, getCalendarActivities, getProfile, getProjects } from "@/lib/cms";
import type { ProjectEvent } from "@/data/projects";
import type { CalendarActivity } from "@/data/calendarActivities";
import type { BlogPost } from "@/data/blog";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Wilcom Duncan | SME Development Consultant, Speaker & Media Executive",
};

type CmsProfile = {
  bio: string;
  expertiseAreas: { title: string; description: string }[];
  images?: Record<string, string>;
};

export default async function Home() {
  const [profile, projects, calendarActivities, blogPosts] = await Promise.all([
    getProfile() as Promise<CmsProfile>,
    getProjects() as Promise<ProjectEvent[]>,
    getCalendarActivities() as Promise<CalendarActivity[]>,
    getBlogPosts() as Promise<BlogPost[]>,
  ]);
  const featuredProjects = projects.slice(0, 3);
  const featuredBlogs = blogPosts.slice(0, 3);
  const profileImages = profile.images || {};

  return (
    <div>
      <HeroEditorial />

      {/* About Preview */}
      <section className="py-24 bg-midnight relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-4/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <Image
                  src={profileImages.about || "/images/blog-3.jpg"}
                  alt="Wilcom Duncan portrait"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border border-gold/20 rounded-3xl -z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader 
                heading="A Voice for Business Growth, Leadership, and Enterprise Development"
              />
              <p className="text-slate text-lg md:text-xl leading-relaxed mb-8">
                {profile.bio}
              </p>
              <Button asChild size="lg">
                <Link href="/about">Learn More About Wilcom</Link>
              </Button>
            </div>
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
      <section className="py-24 bg-charcoal relative overflow-hidden border-y border-gold/10">
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
                <span className="text-slate/40 font-serif opacity-50">
                <Image
                  src="/images/bootcamp/ceos-bootcamp-hero-speaker.jpg"
                  alt="CEOs Bootcamp"
                  fill
                  className="object-cover"
                />
                </span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border border-gold/20 rounded-2xl -z-10" />
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
          <CalendarActivities activities={calendarActivities} />
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
        heading="Book Wilcom for Speaking, Training, Partnership, or Consultation"
        text="Whether you are planning a business training, leadership event, media conversation, entrepreneurship program, or corporate development session, Wilcom Duncan brings practical insight, strong communication, and business-focused strategy to the room."
        primaryBtnText="Contact Wilcom"
        primaryBtnLink="/contact"
        secondaryBtnText="Partner with CEOs Bootcamp"
        secondaryBtnLink="/contact?type=partnership"
        imageSrc="/images/blog-2.jpg"
      />
    </div>
  );
}
