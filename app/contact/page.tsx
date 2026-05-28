import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Handshake, Mail, Mic2, MonitorPlay, Presentation, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/Button";
import { constructMetadata } from "@/lib/seo";
import { getProfile, getSettings } from "@/lib/cms";

export const metadata: Metadata = constructMetadata({
  title: "Contact Wilcom Duncan | Schedule a Consultation",
  description:
    "Schedule a consultation or send an inquiry for executive training, speaking engagements, media requests, and CEOs Bootcamp partnerships.",
});

export const dynamic = "force-dynamic";

type CmsProfile = {
  images?: Record<string, string>;
};

type CmsSettings = {
  schedulingLink?: string;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
};

const inquiryTypes = [
  { title: "Executive Consultation", icon: BriefcaseBusiness },
  { title: "Speaking Engagement", icon: Mic2 },
  { title: "Corporate Training", icon: Presentation },
  { title: "CEOs Bootcamp Partnership", icon: Handshake },
  { title: "Media / Interview Request", icon: MonitorPlay },
  { title: "Business Development Support", icon: Users },
];

export default async function ContactPage() {
  const [profile, settings] = await Promise.all([
    getProfile() as Promise<CmsProfile>,
    getSettings() as Promise<CmsSettings>,
  ]);
  const contactImage = profile.images?.contact || "/images/blog-2.jpg";
  const contactEmail = settings.contactEmail || "wilcomduncan@gmail.com";
  const phone = settings.phone || settings.whatsapp || "+231 77 030 2296";
  const phoneLink = phone.replace(/[^\d+]/g, "");
  const schedulingLink =
    settings.schedulingLink && !settings.schedulingLink.includes("replace-with-client-link")
      ? settings.schedulingLink
      : null;

  return (
    <div>
      <PageHero
        heading="Schedule a Consultation or Send a Direct Inquiry"
        subheading="Executive Engagements"
        intro="For speaking engagements, executive training, business consultation, media requests, and CEOs Bootcamp partnerships."
        image={contactImage}
      />

      <section id="schedule" className="bg-midnight py-20 sm:py-24">
        <div className="site-container">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="premium-card flex flex-col p-7 sm:p-9">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Priority Booking</p>
              <h2 className="mb-4 font-serif text-3xl font-bold text-white">Schedule a Consultation</h2>
              <p className="mb-8 grow text-base leading-8 text-slate">
                For corporate clients, founders, and institutions ready to book a session, use the scheduling link to choose an available time.
              </p>
              {schedulingLink ? (
                <Button asChild size="lg">
                  <a href={schedulingLink} target="_blank" rel="noopener noreferrer">
                    Schedule on Calendly
                  </a>
                </Button>
              ) : (
                <div className="rounded-full border border-white/15 px-6 py-4 text-center text-sm text-white/60">
                  Scheduling link coming soon.
                </div>
              )}
            </article>

            <article className="premium-card flex flex-col p-7 sm:p-9">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Direct Inquiry</p>
              <h2 className="mb-4 font-serif text-3xl font-bold text-white">Send a Message</h2>
              <p className="mb-8 grow text-base leading-8 text-slate">
                For partnerships, media requests, sponsorships, or general inquiries, send a direct message to the team.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link href="#inquiry-form">Send an Inquiry</Link>
              </Button>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-charcoal py-20">
        <div className="site-container">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Areas of Inquiry</p>
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Choose the Conversation That Fits</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inquiryTypes.map(({ title, icon: Icon }) => (
              <div key={title} className="premium-card flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                  <Icon size={19} className="text-white" />
                </span>
                <p className="font-medium leading-6 text-white">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry-form" className="bg-midnight py-20 sm:py-24">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.18fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Direct Contact</p>
              <h2 className="mb-5 font-serif text-3xl font-bold text-white sm:text-4xl">Send a Detailed Inquiry</h2>
              <p className="mb-10 text-base leading-8 text-slate">
                Share your brief, event, organization, or business need. The form remains available for engagements that need context before scheduling.
              </p>
              <div className="premium-card space-y-5 p-6 text-sm text-slate">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-1 shrink-0 text-white" />
                  <div>
                    <p className="mb-1 text-white">Email</p>
                    <a href={`mailto:${contactEmail}`} className="transition hover:text-white">{contactEmail}</a>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="mb-1 text-white">Phone / WhatsApp</p>
                  <a href={`tel:${phoneLink}`} className="transition hover:text-white">{phone}</a>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="mb-1 text-white">Location</p>
                  <p>Monrovia, Liberia</p>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-charcoal py-20">
        <div className="site-container text-center">
          <h2 className="mx-auto mb-5 max-w-3xl font-serif text-3xl font-bold text-white sm:text-4xl">
            Ready to Bring Wilcom Into the Room?
          </h2>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-8 text-slate">
            Start with a scheduled consultation or send a direct inquiry for a tailored engagement.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {schedulingLink ? (
              <Button asChild size="lg">
                <a href={schedulingLink} target="_blank" rel="noopener noreferrer">Schedule Consultation</a>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="#schedule">Schedule Consultation</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <Link href="#inquiry-form">Send Inquiry</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
