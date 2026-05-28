import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ExpertiseCard } from "@/components/ExpertiseCard";
import { CTASection } from "@/components/CTASection";
import { getProfile } from "@/lib/cms";
import { constructMetadata } from "@/lib/seo";
import { SafeImage } from "@/components/SafeImage";

export const metadata: Metadata = constructMetadata({
  title: "About Wilcom Duncan | Business Development Consultant",
});

export const dynamic = "force-dynamic";

type CmsProfile = {
  bio: string;
  expertiseAreas: { title: string; description: string }[];
  platforms: string[];
  speakingTopics: string[];
  images?: Record<string, string>;
};

export default async function AboutPage() {
  const profile = (await getProfile()) as CmsProfile;
  const profileImages = profile.images || {};

  return (
    <div>
      <PageHero 
        heading="About Wilcom Duncan"
        subheading="Entrepreneur. SME Development Consultant. Speaker. Trainer. Media Executive."
        intro="Empowering organizations, training executives, and structuring SMEs for sustainable growth across Africa."
      />

      {/* Biography */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-4/5 max-w-md mx-auto rounded-4xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <SafeImage
                  src={profileImages.about || "/images/blog-2.jpg"}
                  alt="Wilcom Duncan Biography"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-6 -left-2 -z-10 h-full w-full max-w-md rounded-[2rem] border border-white/20 lg:-left-6" />
            </div>
            
            <div>
              <SectionHeader heading="Who Is Wilcom Duncan?" />
              <div className="prose prose-invert prose-lg max-w-none text-slate">
                <p>
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Focus */}
      <section className="py-24 bg-charcoal border-y border-slate/10 relative">
        <div className="absolute inset-0 bg-grid-white opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader heading="Professional Focus" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.expertiseAreas.map((area, index) => (
              <ExpertiseCard key={index} index={index} title={area.title} description={area.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-24 bg-midnight relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl relative z-10">
          <SectionHeader heading="Leadership Philosophy" centered />
          <div className="aspect-video max-w-3xl mx-auto rounded-4xl overflow-hidden border border-white/10 shadow-2xl mb-12 relative">
            <SafeImage
              src="/images/blog-1.jpg"
              alt="Wilcom Duncan Leadership Philosophy"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-slate text-lg leading-relaxed mb-12">
            Wilcom believes that leadership is not only about position. It is about clarity, responsibility, communication, discipline, and the ability to create value for others.
          </p>
          <div className="relative rounded-2xl border border-white/15 bg-white/[0.04] p-8 md:p-12">
            <span className="absolute left-6 top-4 font-serif text-6xl text-white opacity-20">"</span>
            <p className="font-serif text-2xl md:text-3xl text-ivory leading-snug relative z-10">
              Great businesses are not built by ideas alone. They are built by people who can think clearly, communicate value, and execute with discipline.
            </p>
            <span className="absolute bottom-0 right-6 rotate-180 font-serif text-6xl text-white opacity-20">"</span>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[120px] pointer-events-none" />
      </section>

      {/* Platforms and Affiliations */}
      <section className="py-24 bg-charcoal border-t border-slate/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader heading="Platforms and Professional Engagements" centered />
          <div className="flex flex-wrap justify-center gap-4">
            {profile.platforms.map((platform, index) => (
              <div key={index} className="bg-midnight border border-slate/20 px-6 py-3 rounded-full text-ivory font-medium">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaker Profile */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader heading="Speaker, Trainer, and Business Facilitator" />
              <p className="text-slate text-lg leading-relaxed mb-8">
                Wilcom Duncan is available for speaking engagements, business trainings, entrepreneurship programs, leadership events, media conversations, and corporate development sessions.
              </p>
              <ul className="space-y-4 mb-8">
                {profile.speakingTopics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 text-ivory">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative shadow-xl hover:scale-[1.02] transition-transform">
                 <SafeImage src={profileImages.speakerProfile || profileImages.speaker || "/images/bootcamp/ceos-bootcamp-hero-speaker.jpg"} alt="Wilcom speaking" fill className="object-cover" />
               </div>
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative mt-8 shadow-xl hover:scale-[1.02] transition-transform">
                 <SafeImage src={profileImages.hero || "/images/bootcamp/global-entrepreneur-week-session.jpg"} alt="Wilcom speaking" fill className="object-cover" />
               </div>
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative -mt-8 shadow-xl hover:scale-[1.02] transition-transform">
                 <SafeImage src={profileImages.author || "/images/bootcamp/ceos-bootcamp-hero-speaker.jpg"} alt="Conference Banner" fill className="object-cover" />
               </div>
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative shadow-xl hover:scale-[1.02] transition-transform">
                 <SafeImage src={profileImages.contact || "/images/bootcamp/global-entrepreneur-week-session.jpg"} alt="Global Entrepreneur Week" fill className="object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        heading="Invite Wilcom to Speak"
        text="Bring practical business development, communication, branding, or leadership training to your team or organization."
        primaryBtnText="Contact Wilcom"
        primaryBtnLink="/contact?type=speaking"
      />
    </div>
  );
}
