import { NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/cms';

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
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
