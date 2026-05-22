import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function FacebookIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8h2.2V4.7c-.4-.1-1.7-.2-3.1-.2-3.1 0-5.1 1.9-5.1 5.4V12H5v3.7h3V24h3.8v-8.3h3l.5-3.7h-3.5v-1.7c0-1.1.3-2.3 2.2-2.3Z" />
    </svg>
  );
}

function InstagramIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.8 8.9H3.2V21h3.6V8.9ZM5 7.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2ZM21 21h-3.6v-6.5c0-1.7-.7-2.8-2.1-2.8-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1V21H9.4V8.9H13v1.7c.6-.9 1.7-2 3.7-2 2.7 0 4.3 1.8 4.3 5.5V21Z" />
    </svg>
  );
}

function YoutubeIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2a31.3 31.3 0 0 0-.5 4.8c0 1.7.2 3.4.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.4.5-3.1.5-4.8s-.2-3.4-.5-4.8ZM10 16.4V9.6l6 3.4-6 3.4Z" />
    </svg>
  );
}

interface SocialLinksProps {
  links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  className?: string;
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      {links.facebook && (
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10">
          <FacebookIcon size={20} />
          <span className="sr-only">Facebook</span>
        </a>
      )}
      {links.instagram && (
        <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10">
          <InstagramIcon size={20} />
          <span className="sr-only">Instagram</span>
        </a>
      )}
      {links.linkedin && (
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10">
          <LinkedinIcon size={20} />
          <span className="sr-only">LinkedIn</span>
        </a>
      )}
      {links.youtube && (
        <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10">
          <YoutubeIcon size={20} />
          <span className="sr-only">YouTube</span>
        </a>
      )}
    </div>
  );
}
