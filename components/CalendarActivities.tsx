"use client";

import { useState } from "react";
import { CalendarActivity } from "@/data/calendarActivities";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./Button";
import { AnimatePresence, motion } from "framer-motion";
import { ApplicationFormModal } from "./ApplicationFormModal";

interface CalendarActivitiesProps {
  activities: CalendarActivity[];
}

export function CalendarActivities({ activities }: CalendarActivitiesProps) {
  // Simplified mock calendar just for the demo.
  // In a real app, you'd use a date library like date-fns
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CalendarActivity | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Mock days array
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Find activities for a day
  const getActivitiesForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(a => a.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    const dayActivities = getActivitiesForDay(day);
    if (dayActivities.length > 0) {
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  const handleApplyClick = (activity: CalendarActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(false);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-charcoal border border-slate/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate/10">
          <h3 className="font-serif text-2xl font-bold text-ivory">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 border border-slate/20 rounded-md hover:bg-slate/10 transition-colors text-ivory">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextMonth} className="p-2 border border-slate/20 rounded-md hover:bg-slate/10 transition-colors text-ivory">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-slate/60 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for visual offset, assuming May 2026 starts on Friday for demo */}
            {[...Array(5)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-md bg-transparent" />
            ))}
            
            {days.map(day => {
              const dayActivities = getActivitiesForDay(day);
              const hasActivity = dayActivities.length > 0;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={!hasActivity}
                  className={`
                    aspect-square rounded-md flex flex-col items-center justify-center relative border transition-all
                    ${hasActivity ? 'bg-gold/10 border-gold/30 hover:bg-gold/20 text-ivory cursor-pointer' : 'bg-transparent border-transparent text-slate/40 cursor-default'}
                  `}
                >
                  <span className={`text-lg font-medium ${hasActivity ? 'text-gold' : ''}`}>{day}</span>
                  {hasActivity && (
                    <div className="absolute bottom-2 flex gap-1">
                      {dayActivities.map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDay !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-charcoal border border-gold/20 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate/10">
                <h4 className="font-serif text-xl font-bold text-ivory">
                  {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
                </h4>
                <button onClick={() => setIsModalOpen(false)} className="text-slate hover:text-ivory transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {getActivitiesForDay(selectedDay).map((activity) => (
                  <div key={activity.id} className="bg-midnight/50 p-4 rounded-lg border border-slate/10">
                    <div className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">
                      {activity.type}
                    </div>
                    <h5 className="font-serif text-lg font-bold text-ivory mb-2">{activity.title}</h5>
                    <p className="text-slate text-sm mb-4">{activity.description}</p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-slate mb-4">
                      <span>{activity.time}</span>
                      <span>{activity.location}</span>
                    </div>
                    {activity.applicationOpen && (
                      <Button className="w-full" onClick={() => handleApplyClick(activity)}>
                        Apply / Register
                      </Button>
                    )}
                  </div>
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
    </div>
  );
}
