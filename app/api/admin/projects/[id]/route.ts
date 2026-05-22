import { NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/cms';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projects = await getProjects();
    const project = projects.find((p: any) => p.id === id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const projects = await getProjects();
    const index = projects.findIndex((p: any) => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    projects[index] = { ...projects[index], ...updates };
    await saveProjects(projects);
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projects = await getProjects();
    const filtered = projects.filter((p: any) => p.id !== id);
    if (filtered.length === projects.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await saveProjects(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
