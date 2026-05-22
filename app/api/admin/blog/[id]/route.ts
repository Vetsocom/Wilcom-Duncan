import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts } from '@/lib/cms';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const posts = await getBlogPosts();
    const post = posts.find((p: any) => p.id === id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const posts = await getBlogPosts();
    const index = posts.findIndex((p: any) => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    posts[index] = { ...posts[index], ...updates };
    await saveBlogPosts(posts);
    return NextResponse.json(posts[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const posts = await getBlogPosts();
    const filtered = posts.filter((p: any) => p.id !== id);
    if (filtered.length === posts.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await saveBlogPosts(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
