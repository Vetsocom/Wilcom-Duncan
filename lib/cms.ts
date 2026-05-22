import fs from 'fs/promises';
import path from 'path';

// Helper to get the absolute path to the content directory
const getContentPath = (filename: string) => path.join(process.cwd(), 'content', filename);

// --- Profile ---
export async function getProfile() {
  const filePath = getContentPath('profile.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function updateProfile(data: any) {
  const filePath = getContentPath('profile.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return data;
}

// --- Projects ---
export async function getProjects() {
  const filePath = getContentPath('projects.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((p: any) => p.slug === slug);
}

export async function getProjectById(id: string) {
  const projects = await getProjects();
  return projects.find((p: any) => p.id === id);
}

export async function saveProjects(projects: any[]) {
  const filePath = getContentPath('projects.json');
  await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
  return projects;
}

// --- Bootcamps ---
export async function getBootcamps() {
  const filePath = getContentPath('bootcamps.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function getBootcampBySlug(slug: string) {
  const bootcamps = await getBootcamps();
  return bootcamps.find((b: any) => b.slug === slug);
}

export async function getBootcampById(id: string) {
  const bootcamps = await getBootcamps();
  return bootcamps.find((b: any) => b.id === id);
}

export async function saveBootcamps(bootcamps: any[]) {
  const filePath = getContentPath('bootcamps.json');
  await fs.writeFile(filePath, JSON.stringify(bootcamps, null, 2));
  return bootcamps;
}

// --- Blog ---
export async function getBlogPosts() {
  const filePath = getContentPath('blog.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((p: any) => p.slug === slug);
}

export async function getBlogPostById(id: string) {
  const posts = await getBlogPosts();
  return posts.find((p: any) => p.id === id);
}

export async function saveBlogPosts(posts: any[]) {
  const filePath = getContentPath('blog.json');
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
  return posts;
}

// --- Calendar ---
export async function getCalendarActivities() {
  const filePath = getContentPath('calendar.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function getCalendarActivityById(id: string) {
  const activities = await getCalendarActivities();
  return activities.find((a: any) => a.id === id);
}

export async function saveCalendarActivities(activities: any[]) {
  const filePath = getContentPath('calendar.json');
  await fs.writeFile(filePath, JSON.stringify(activities, null, 2));
  return activities;
}

// --- Settings ---
export async function getSettings() {
  const filePath = getContentPath('settings.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function updateSettings(data: any) {
  const filePath = getContentPath('settings.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return data;
}
