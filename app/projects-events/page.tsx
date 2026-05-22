"use client";

import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ProjectEventCard } from "@/components/ProjectEventCard";
import { TimelineYearGroup } from "@/components/TimelineYearGroup";
import { projects } from "@/data/projects";

// In a real app we'd use Metadata in a layout or a separate server component wrapper, 
// but since this needs 'use client' for filtering, we will omit the page-level metadata export here 
// and rely on the global default, or refactor to have a server page that imports a client component.
// For the sake of the demo, we'll keep it as a client component.

export default function ProjectsEventsPage() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  const categories = ["All", "Bootcamp", "Training", "Executive Bootcamp", "Executive Education", "Media Interviews", "Conferences"];
  
  // Extract unique years and sort descending
  const years = ["All", ...Array.from(new Set(projects.map(p => p.year.toString())))].sort((a, b) => b.localeCompare(a));

  // Filter and sort projects
  const filteredProjects = projects.filter(p => {
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchYear = filterYear === "All" || p.year.toString() === filterYear;
    return matchCategory && matchYear;
  }).sort((a, b) => b.year - a.year); // Sort newest to oldest for display, though requested oldest to newest. 
  // Wait, request said: "Order from oldest to newest". Let's reverse sort.
  
  const sortedFilteredProjects = [...filteredProjects].sort((a, b) => a.year - b.year);

  // Group by year
  const groupedProjects = sortedFilteredProjects.reduce((acc, project) => {
    if (!acc[project.year]) acc[project.year] = [];
    acc[project.year].push(project);
    return acc;
  }, {} as Record<number, typeof projects>);

  const displayedYears = Object.keys(groupedProjects).map(Number).sort((a, b) => a - b); // Oldest to newest

  return (
    <div>
      <PageHero 
        heading="Projects & Events"
        subheading="A yearly archive of Wilcom Duncan's work"
        intro="This page highlights the events, projects, bootcamps, trainings, interviews, conferences, and business development programs Wilcom Duncan has been involved in. Visitors can explore activities by year, read full event details, view photos and videos, and apply for upcoming programs."
      />

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="mb-16 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center bg-charcoal p-6 rounded-xl border border-slate/10">
            <div className="flex-1 w-full">
              <label className="text-xs text-gold uppercase tracking-wider font-semibold mb-3 block">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterCategory === cat 
                        ? 'bg-gold text-midnight' 
                        : 'bg-midnight border border-slate/20 text-slate hover:border-gold/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-auto shrink-0">
              <label className="text-xs text-gold uppercase tracking-wider font-semibold mb-3 block">Filter by Year</label>
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full md:w-48 bg-midnight border border-slate/20 rounded-md px-4 py-2.5 text-ivory focus:outline-none focus:border-gold appearance-none"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline View */}
          <div className="max-w-5xl mx-auto">
            {displayedYears.length > 0 ? (
              <div className="space-y-24">
                {displayedYears.map(year => (
                  <TimelineYearGroup key={year} year={year}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 md:pl-0">
                      {groupedProjects[year].map((project, index) => (
                        <ProjectEventCard key={project.id} index={index} project={project} />
                      ))}
                    </div>
                  </TimelineYearGroup>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-slate/10 rounded-xl bg-charcoal">
                <p className="text-slate text-lg">No projects or events found matching your criteria.</p>
                <button 
                  onClick={() => { setFilterCategory("All"); setFilterYear("All"); }}
                  className="mt-4 text-gold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
}
