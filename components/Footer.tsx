import Link from "next/link";
import { profile } from "@/data/profile";
import { getSettings } from "@/lib/cms";
import { SocialLinks } from "./SocialLinks";

type FooterSettings = {
  contactEmail?: string;
  phone?: string;
  footerText?: string;
};

export async function Footer() {
  const settings = (await getSettings()) as FooterSettings;
  const email = settings.contactEmail || "wilcomduncan@gmail.com";
  const phone = settings.phone || "+231 77 030 2296";
  const phoneLink = phone.replace(/[^\d+]/g, "");

  return (
    <footer className="bg-charcoal border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold text-ivory mb-4 block">
              Wilcom Duncan
            </Link>
            <p className="text-slate max-w-md text-sm leading-relaxed mb-6">
              SME Development Consultant, business trainer, speaker, and media executive helping entrepreneurs and organizations build with structure, discipline, and long-term value.
            </p>
            <SocialLinks links={profile.socialLinks} />
          </div>
          
          <div>
            <h4 className="text-ivory font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/projects-events" className="hover:text-white transition-colors">Projects & Events</Link></li>
              <li><Link href="/ceos-bootcamp" className="hover:text-white transition-colors">CEOs Bootcamp</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ivory font-semibold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate">
              <li>{profile.location}</li>
              <li>Email: <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a></li>
              <li>Phone: <a href={`tel:${phoneLink}`} className="hover:text-white transition-colors">{phone}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate">
          <p>{settings.footerText || `Copyright ${new Date().getFullYear()} Wilcom Duncan. All rights reserved.`}</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
