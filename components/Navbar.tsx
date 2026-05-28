"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects & Events", href: "/projects-events" },
  { name: "CEOs Bootcamp", href: "/ceos-bootcamp" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/12 bg-black/85 backdrop-blur-xl">
      <div className="site-container">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center font-serif text-2xl font-bold tracking-wide text-ivory sm:text-[1.7rem]"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-white">W.</span>
            <span className="ml-1">Duncan</span>
          </Link>
          
          <nav className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-6 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative text-sm font-medium transition-colors hover:text-white",
                        isActive ? "text-white" : "text-slate-300"
                      )}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="default" size="sm">
              <Link href="/contact#schedule">Schedule Consultation</Link>
            </Button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-ivory transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <div className="site-container space-y-3 pb-6 pt-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-base font-medium transition",
                      isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/[0.06] hover:text-ivory"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/contact#schedule" onClick={() => setIsOpen(false)}>Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
