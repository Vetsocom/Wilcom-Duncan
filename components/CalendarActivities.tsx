"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, X } from "lucide-react";
import type { CalendarActivity } from "@/data/calendarActivities";
import { ApplicationFormModal } from "./ApplicationFormModal";
import { Button } from "./Button";

interface CalendarActivitiesProps {
  activities: CalendarActivity[];
  schedulingLink?: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateValue(date: string) {
  return new Date(`${date}T00:00:00`);
}

function initialMonth(activities: CalendarActivity[]) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = activities
    .filter((activity) => activity.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const firstActivity = [...activities].sort((a, b) => a.date.localeCompare(b.date))[0];

  return upcoming ? dateValue(upcoming.date) : firstActivity ? dateValue(firstActivity.date) : new Date();
}

function formatActivityDate(date: string) {
  return dateValue(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CalendarActivities({ activities, schedulingLink }: CalendarActivitiesProps) {
  const [currentDate, setCurrentDate] = useState(() => initialMonth(activities));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CalendarActivity | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const configuredSchedulingLink =
    schedulingLink && !schedulingLink.includes("replace-with-client-link") ? schedulingLink : null;
  const monthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const activitiesForMonth = useMemo(
    () => activities.filter((activity) => activity.date.startsWith(monthPrefix)),
    [activities, monthPrefix]
  );

  const upcomingActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = sorted.filter((activity) => activity.date >= today);
    return (upcoming.length ? upcoming : sorted).slice(0, 4);
  }, [activities, today]);

  const getActivitiesForDay = (day: number) => {
    const date = `${monthPrefix}-${String(day).padStart(2, "0")}`;
    return activitiesForMonth.filter((activity) => activity.date === date);
  };

  const selectedActivities = selectedDay === null ? [] : getActivitiesForDay(selectedDay);

  const moveMonth = (direction: -1 | 1) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    setSelectedDay(null);
  };

  const openApplication = (activity: CalendarActivity) => {
    setSelectedActivity(activity);
    setIsApplyModalOpen(true);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="premium-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                Monthly Calendar
              </p>
              <h3 className="font-serif text-2xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-7">
            <div className="mb-3 grid grid-cols-7 gap-1 sm:gap-2">
              {weekdayNames.map((day) => (
                <div key={day} className="py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: firstWeekday }, (_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const dayActivities = getActivitiesForDay(day);
                const hasActivity = dayActivities.length > 0;

                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => hasActivity && setSelectedDay(day)}
                    disabled={!hasActivity}
                    className={`relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-xl border text-sm transition sm:text-base ${
                      hasActivity
                        ? "border-white/35 bg-white/[0.1] text-white hover:border-white hover:bg-white/[0.16]"
                        : "border-white/[0.04] text-white/35"
                    }`}
                  >
                    {day}
                    {hasActivity && (
                      <span className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {!activitiesForMonth.length && (
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/65">
                No public activities listed for this month yet. Check upcoming programs or schedule a consultation.
              </div>
            )}
          </div>
        </div>

        <aside className="premium-card p-6 sm:p-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            Upcoming Activities
          </p>
          <h3 className="mb-6 font-serif text-3xl font-bold text-white">Plan Your Next Engagement</h3>
          <div className="space-y-4">
            {upcomingActivities.map((activity) => (
              <button
                type="button"
                key={activity.id}
                onClick={() => {
                  const date = dateValue(activity.date);
                  setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
                  setSelectedDay(date.getDate());
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-left transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  {activity.type}
                </span>
                <span className="mb-3 block font-serif text-lg font-semibold text-white">{activity.title}</span>
                <span className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{formatActivityDate(activity.date)}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{activity.time}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild size="sm">
              <Link href="/ceos-bootcamp#upcoming">Register Interest</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={configuredSchedulingLink || "/contact#schedule"}
                {...(configuredSchedulingLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                Schedule Consultation
              </a>
            </Button>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {selectedDay !== null && selectedActivities.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Close activity details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setSelectedDay(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 18 }}
              className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/15 bg-[#080808] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h4 className="font-serif text-xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
                </h4>
                <button type="button" onClick={() => setSelectedDay(null)} className="text-white/60 transition hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 p-6">
                {selectedActivities.map((activity) => (
                  <article key={activity.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{activity.type}</p>
                    <h5 className="mb-3 font-serif text-xl font-bold text-white">{activity.title}</h5>
                    <p className="mb-4 text-sm leading-7 text-white/65">{activity.description}</p>
                    <div className="mb-5 flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:gap-5">
                      <span className="inline-flex items-center gap-2"><Clock3 size={15} />{activity.time}</span>
                      <span className="inline-flex items-center gap-2"><MapPin size={15} />{activity.location}</span>
                    </div>
                    {activity.applicationOpen && (
                      <Button type="button" size="sm" onClick={() => openApplication(activity)}>
                        Apply / Register
                      </Button>
                    )}
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ApplicationFormModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        activityTitle={selectedActivity?.title}
        activityId={selectedActivity?.id}
        activityType={selectedActivity?.type}
        source="calendar"
      />
    </>
  );
}
