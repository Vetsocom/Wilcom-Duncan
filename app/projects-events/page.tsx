import { PageHero } from "@/components/PageHero";
import { ProjectsEventsIndex } from "@/components/ProjectsEventsIndex";
import { getProjects } from "@/lib/cms";
import type { ProjectEvent } from "@/data/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsEventsPage() {
  const projects = (await getProjects()) as ProjectEvent[];

  return (
    <div>
      <PageHero
        heading="Projects & Events"
        subheading="A yearly archive of Wilcom Duncan's work"
        intro="This page highlights the events, projects, bootcamps, trainings, interviews, conferences, and business development programs Wilcom Duncan has been involved in. Visitors can explore activities by year, read full event details, view photos and videos, and apply for upcoming programs."
      />

      <section className="bg-midnight py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsEventsIndex projects={projects} />
        </div>
      </section>
    </div>
  );
}
