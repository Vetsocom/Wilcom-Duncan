"use client";

import { useState } from "react";
import { Button } from "./Button";

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  inquiryType: "executive-consultation",
  message: "",
  website: "",
};

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to send message right now. Please try again.");
      }

      setFeedback({
        type: "success",
        message: result.message || "Thank you. Your message has been received.",
      });
      setFormData(initialForm);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("CONTACT_FORM_ERROR:", error);
      }

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send message right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="premium-card relative overflow-hidden p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {feedback && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border border-white/25 bg-white/[0.08] text-white"
                : "border border-red-400/30 bg-red-500/10 text-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Full Name</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white transition-colors focus:border-white focus:outline-none" placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Email Address</label>
            <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white transition-colors focus:border-white focus:outline-none" placeholder="name@company.com" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Phone / WhatsApp</label>
            <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white transition-colors focus:border-white focus:outline-none" placeholder="+231..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Organization</label>
            <input name="organization" value={formData.organization} onChange={handleChange} type="text" className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white transition-colors focus:border-white focus:outline-none" placeholder="Company name" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-ivory">Inquiry Type</label>
          <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full appearance-none rounded-xl border border-white/15 bg-black px-4 py-3 text-white transition-colors focus:border-white focus:outline-none">
            <option value="executive-consultation">Executive Consultation</option>
            <option value="speaking-engagement">Speaking Engagement</option>
            <option value="corporate-training">Corporate Training</option>
            <option value="ceos-bootcamp-partnership">CEOs Bootcamp Partnership</option>
            <option value="media-interview-request">Media / Interview Request</option>
            <option value="business-development-support">Business Development Support</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-ivory">Message</label>
          <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full resize-none rounded-xl border border-white/15 bg-black px-4 py-3 text-white transition-colors focus:border-white focus:outline-none" placeholder="Tell us about the engagement, timing, and intended audience."></textarea>
        </div>
        
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
