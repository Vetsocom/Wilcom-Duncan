import { NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/cms';
import { createNotification } from '@/lib/notifications';

export async function GET() {
  try {
    const data = await getProjects();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    const projects = await getProjects();
    newProject.id = `p${Date.now()}`;
    projects.push(newProject);
    await saveProjects(projects);
    await createNotification({
      title: 'Project created',
      message: `${newProject.title || 'A new project'} was added to the website.`,
      type: 'content',
      priority: 'normal',
      link: '/admin/projects',
      relatedId: newProject.id,
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
