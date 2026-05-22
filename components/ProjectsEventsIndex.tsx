"use client";

import { useState } from "react";
import type { ProjectEvent } from "@/data/projects";
import { ProjectEventCard } from "@/components/ProjectEventCard";
import { TimelineYearGroup } from "@/components/TimelineYearGroup";

type ProjectsEventsIndexProps = {
  projects: ProjectEvent[];
};

export function ProjectsEventsIndex({ projects }: ProjectsEventsIndexProps) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];
  const years = ["All", ...Array.from(new Set(projects.map((project) => project.year.toString())))]
    .sort((a, b) => b.localeCompare(a));

  const filteredProjects = projects
    .filter((project) => {
      const matchCategory = filterCategory === "All" || project.category === filterCategory;
      const matchYear = filterYear === "All" || project.year.toString() === filterYear;
      return matchCategory && matchYear;
    })
    .sort((a, b) => a.year - b.year);

  const groupedProjects = filteredProjects.reduce((acc, project) => {
    if (!acc[project.year]) acc[project.year] = [];
    acc[project.year].push(project);
    return acc;
  }, {} as Record<number, ProjectEvent[]>);

  const displayedYears = Object.keys(groupedProjects).map(Number).sort((a, b) => a - b);

  return (
    <>
      <div className="mb-16 flex flex-col items-start justify-between gap-8 rounded-xl border border-slate/10 bg-charcoal p-6 md:flex-row md:items-center">
        <div className="w-full flex-1">
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gold">Filter by Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filterCategory === category
                    ? "bg-gold text-midnight"
                    : "border border-slate/20 bg-midnight text-slate hover:border-gold/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full shrink-0 md:w-auto">
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gold">Filter by Year</label>
          <select
            value={filterYear}
            onChange={(event) => setFilterYear(event.target.value)}
            className="w-full appearance-none rounded-md border border-slate/20 bg-midnight px-4 py-2.5 text-ivory focus:border-gold focus:outline-none md:w-48"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        {displayedYears.length > 0 ? (
          <div className="space-y-24">
            {displayedYears.map((year) => (
              <TimelineYearGroup key={year} year={year}>
                <div className="grid grid-cols-1 gap-6 pl-8 md:grid-cols-2 md:pl-0">
                  {groupedProjects[year].map((project, index) => (
                    <ProjectEventCard key={project.id} index={index} project={project} />
                  ))}
                </div>
              </TimelineYearGroup>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate/10 bg-charcoal py-24 text-center">
            <p className="text-lg text-slate">No projects or events found matching your criteria.</p>
            <button
              onClick={() => {
                setFilterCategory("All");
                setFilterYear("All");
              }}
              className="mt-4 text-gold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
