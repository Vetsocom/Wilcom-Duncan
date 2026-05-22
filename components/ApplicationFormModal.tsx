"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

type ApplicationSource = "calendar" | "bootcamp" | "event" | "general";

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle?: string;
  activityId?: string;
  activityType?: string;
  source?: ApplicationSource;
}

const baseForm = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  reason: "",
  website: "",
};

export function ApplicationFormModal({
  isOpen,
  onClose,
  activityTitle,
  activityId,
  activityType,
  source = "general",
}: ApplicationFormModalProps) {
  const [formData, setFormData] = useState(baseForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
    }
  }, [isOpen, activityId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          activityTitle,
          activityId,
          activityType,
          source,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setFeedback({
        type: "success",
        message: "Application received. Our team will contact you with next steps.",
      });
      setFormData(baseForm);
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-midnight/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-charcoal border border-gold/20 rounded-xl shadow-2xl w-full max-w-xl my-8 z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate/10">
              <div>
                <h4 className="font-serif text-xl font-bold text-ivory">Apply / Register</h4>
                <p className="text-slate text-sm mt-1">{activityTitle || "General Application"}</p>
              </div>
              <button onClick={onClose} className="text-slate hover:text-ivory transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-ivory font-medium">Full Name</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-2 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-ivory font-medium">Email Address</label>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-2 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-ivory font-medium">Phone / WhatsApp</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-2 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-ivory font-medium">Role / Title</label>
                    <input name="role" value={formData.role} onChange={handleChange} type="text" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-2 text-ivory focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ivory font-medium">Organization / Business Name</label>
                  <input name="organization" value={formData.organization} onChange={handleChange} type="text" className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-2 text-ivory focus:outline-none focus:border-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ivory font-medium">Reason for interest</label>
                  <textarea required name="reason" value={formData.reason} onChange={handleChange} rows={4} className="w-full bg-midnight border border-slate/20 rounded-md px-4 py-2 text-ivory focus:outline-none focus:border-gold resize-none" />
                </div>
                <div className="pt-4 border-t border-slate/10 flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  {feedback?.type === "success" && (
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
                      Done
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
