import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts } from '@/lib/cms';
import { createNotification } from '@/lib/notifications';

export async function GET() {
  try {
    const data = await getBlogPosts();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPost = await request.json();
    const posts = await getBlogPosts();
    newPost.id = `blog${Date.now()}`;
    posts.push(newPost);
    await saveBlogPosts(posts);
    await createNotification({
      title: 'Blog post created',
      message: `${newPost.title || 'A new post'} was added to the website.`,
      type: 'content',
      priority: 'normal',
      link: '/admin/blog',
      relatedId: newPost.id,
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
