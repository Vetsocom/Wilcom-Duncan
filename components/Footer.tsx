import Link from "next/link";
import { profile } from "@/data/profile";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-slate/10 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold text-ivory mb-4 block">
              <span className="text-gold">Wilcom</span> Duncan
            </Link>
            <p className="text-slate max-w-md text-sm leading-relaxed mb-6">
              SME Development Consultant, business trainer, speaker, and media executive helping entrepreneurs and organizations build with structure, discipline, and long-term value.
            </p>
            <SocialLinks links={profile.socialLinks} />
          </div>
          
          <div>
            <h4 className="text-ivory font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate">
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/projects-events" className="hover:text-gold transition-colors">Projects & Events</Link></li>
              <li><Link href="/ceos-bootcamp" className="hover:text-gold transition-colors">CEOs Bootcamp</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ivory font-semibold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate">
              <li>{profile.location}</li>
              <li>Email: <a href="mailto:wilcomduncan@gmail.com" className="hover:text-gold transition-colors">wilcomduncan@gmail.com</a></li>
              <li>Phone: <a href="tel:+231770302296" className="hover:text-gold transition-colors">+231 77 030 2296</a> </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate">
          <p>© {new Date().getFullYear()} Wilcom Duncan. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
