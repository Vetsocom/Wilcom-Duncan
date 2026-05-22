"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-slate/10 bg-charcoal rounded-xl overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:bg-slate/5 transition-colors hover:bg-slate/5"
          >
            <span className="font-serif text-lg font-bold text-ivory">{item.question}</span>
            <ChevronDown 
              className={`text-gold transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
              size={20} 
            />
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-6 pt-0 text-slate leading-relaxed border-t border-slate/10 mt-2">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
