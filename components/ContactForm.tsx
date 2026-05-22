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
  inquiryType: "speaking",
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
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setFeedback({
        type: "success",
        message: "Thank you. Your message has been received.",
      });
      setFormData(initialForm);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-charcoal border border-slate/10 p-8 rounded-xl relative overflow-hidden">
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
                ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border border-red-400/30 bg-red-500/10 text-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Full Name</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Email Address</label>
            <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" placeholder="john@example.com" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Phone / WhatsApp</label>
            <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" placeholder="+231..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory">Organization</label>
            <input name="organization" value={formData.organization} onChange={handleChange} type="text" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors" placeholder="Company Name" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-ivory">Inquiry Type</label>
          <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors appearance-none">
            <option value="speaking">Speaking Engagement</option>
            <option value="training">Business Training</option>
            <option value="partnership">CEOs Bootcamp Partnership</option>
            <option value="media">Media / Interview Request</option>
            <option value="consultation">Business Consultation</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-ivory">Message</label>
          <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Tell us more about your request..."></textarea>
        </div>
        
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
