import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { CTASection } from "@/components/CTASection";
import { constructMetadata } from "@/lib/seo";
import { Mic2, Users, Handshake, MonitorPlay, Briefcase } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Contact Wilcom Duncan | Speaking, Training & Partnership",
});

export default function ContactPage() {
  const contactOptions = [
    {
      title: "Book Wilcom for Speaking",
      description: "Invite Wilcom to speak at your business event, conference, entrepreneurship program, or leadership gathering.",
      icon: <Mic2 className="text-gold w-8 h-8 mb-4" />,
    },
    {
      title: "Request a Business Training",
      description: "Bring practical business development, communication, branding, or leadership training to your team or organization.",
      icon: <Users className="text-gold w-8 h-8 mb-4" />,
    },
    {
      title: "Partner with CEOs Bootcamp",
      description: "Collaborate with CEOs Bootcamp through sponsorship, partnership, venue support, media support, or participant sponsorship.",
      icon: <Handshake className="text-gold w-8 h-8 mb-4" />,
    },
    {
      title: "Media or Interview Request",
      description: "Invite Wilcom for interviews, podcasts, business conversations, panels, or media features.",
      icon: <MonitorPlay className="text-gold w-8 h-8 mb-4" />,
    },
    {
      title: "Business Consultation",
      description: "Request a consultation around SME development, business communication, brand positioning, or growth strategy.",
      icon: <Briefcase className="text-gold w-8 h-8 mb-4" />,
    },
  ];

  return (
    <div>
      <PageHero 
        heading="Let's Build, Train, Speak, or Partner"
        subheading="Get In Touch"
        intro="Connect with Wilcom Duncan for speaking engagements, business training, media conversations, CEOs Bootcamp partnerships, and consultation opportunities."
        image="/images/blog-2.jpg"
      />

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="font-serif text-3xl font-bold text-ivory mb-8">How We Can Work Together</h2>
                <div className="space-y-6">
                  {contactOptions.map((option, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-charcoal border border-slate/10 rounded-xl hover:border-gold/30 transition-colors">
                      <div className="shrink-0">{option.icon}</div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-ivory mb-2">{option.title}</h3>
                        <p className="text-slate text-sm leading-relaxed">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-charcoal/50 border border-gold/20 rounded-xl">
                <h3 className="font-serif text-xl font-bold text-ivory mb-4">Direct Contact Info</h3>
                <ul className="space-y-4 text-slate">
                  <li className="flex justify-between items-center border-b border-slate/10 pb-4">
                    <span className="font-medium text-ivory">Location</span>
                    <span>Monrovia, Liberia</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate/10 pb-4">
                    <span className="font-medium text-ivory">Email</span>
                    <a href="mailto:wilcomduncan@gmail.com" className="text-gold hover:underline">wilcomduncan@gmail.com</a>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-medium text-ivory">Phone / WhatsApp</span>
                    <a href="tel: +231 77 030 2296" className="text-gold hover:underline"> +231 77 030 2296</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="sticky top-28">
                <div className="mb-8">
                  <h2 className="font-serif text-3xl font-bold text-ivory mb-4">Send a Message</h2>
                  <p className="text-slate">Fill out the form below and our team will get back to you as soon as possible.</p>
                </div>
                <ContactForm />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <CTASection 
        heading="Let's Create Real Value"
        text="Whether it's a media appearance, business partnership, or executive training, we're ready to collaborate."
        primaryBtnText="Send an Email"
        primaryBtnLink="mailto:contact@wilcomduncan.com"
        imageSrc="/images/blog-3.jpg"
      />
    </div>
  );
}
