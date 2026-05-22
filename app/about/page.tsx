import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ExpertiseCard } from "@/components/ExpertiseCard";
import { CTASection } from "@/components/CTASection";
import { profile } from "@/data/profile";
import { constructMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata: Metadata = constructMetadata({
  title: "About Wilcom Duncan | Business Development Consultant",
});

export default function AboutPage() {
  return (
    <div>
      <PageHero 
        heading="About Wilcom Duncan"
        subheading="Entrepreneur. SME Development Consultant. Speaker. Trainer. Media Executive."
        intro="Wilcom Duncan is a Liberian entrepreneur, SME Development Consultant, business trainer, speaker, and media executive known for his work in business development, executive education, corporate communication, media, and entrepreneurship training."
      />

      {/* Biography */}
      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-4/5 max-w-md mx-auto rounded-4xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <Image
                  src="/images/blog-2.jpg"
                  alt="Wilcom Duncan Biography"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/5 rounded-full blur-[100px] pointer-events-none -z-10" />
              <div className="absolute -bottom-6 -left-2 lg:-left-6 w-full max-w-md h-full border border-gold/20 rounded-[2rem] -z-10" />
            </div>
            
            <div>
              <SectionHeader heading="Who Is Wilcom Duncan?" />
              <div className="prose prose-invert prose-lg max-w-none text-slate">
                <p>
                  Wilcom Duncan is a business development professional and public-facing entrepreneur whose work centers on SME growth, executive education, corporate branding, business communication, and media strategy.
                </p>
                <p>
                  Through platforms connected to Reecom Media, CEOs Chat, CEOs Bootcamp, and leadership development initiatives, he continues to contribute to conversations and programs that help entrepreneurs, founders, and executives become more strategic, more visible, and more prepared for growth.
                </p>
                <p>
                  Wilcom's approach is practical and business-focused. He believes that successful entrepreneurs need more than ideas. They need structure, leadership discipline, clear communication, strong branding, and a business model that delivers real value to the people they serve.
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
            <Image
              src="/images/blog-1.jpg"
              alt="Wilcom Duncan Leadership Philosophy"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-slate text-lg leading-relaxed mb-12">
            Wilcom believes that leadership is not only about position. It is about clarity, responsibility, communication, discipline, and the ability to create value for others.
          </p>
          <div className="bg-charcoal border border-gold/20 p-8 md:p-12 rounded-2xl relative">
            <span className="text-gold font-serif text-6xl absolute top-4 left-6 opacity-30">"</span>
            <p className="font-serif text-2xl md:text-3xl text-ivory leading-snug relative z-10">
              Great businesses are not built by ideas alone. They are built by people who can think clearly, communicate value, and execute with discipline.
            </p>
            <span className="text-gold font-serif text-6xl absolute bottom-0 right-6 opacity-30 rotate-180">"</span>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
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
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative shadow-xl hover:scale-[1.02] transition-transform">
                 <Image src="/images/bootcamp/ceos-bootcamp-hero-speaker.jpg" alt="Wilcom speaking" fill className="object-cover" />
               </div>
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative mt-8 shadow-xl hover:scale-[1.02] transition-transform">
                 <Image src="/images/bootcamp/global-entrepreneur-week-session.jpg" alt="Wilcom speaking" fill className="object-cover" />
               </div>
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative -mt-8 shadow-xl hover:scale-[1.02] transition-transform">
                 <Image src="/images/bootcamp/ceos-bootcamp-hero-speaker.jpg" alt="Conference Banner" fill className="object-cover" />
               </div>
               <div className="aspect-square rounded-4xl overflow-hidden border border-white/10 relative shadow-xl hover:scale-[1.02] transition-transform">
                 <Image src="/images/bootcamp/global-entrepreneur-week-session.jpg" alt="Global Entrepreneur Week" fill className="object-cover" />
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
