import fs from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db';
import { BlogPost } from '@/models/BlogPost';
import { Bootcamp } from '@/models/Bootcamp';
import { CalendarActivity } from '@/models/CalendarActivity';
import { Profile } from '@/models/Profile';
import { Project } from '@/models/Project';
import { Settings } from '@/models/Settings';

// Helper to get the absolute path to the content directory
const getContentPath = (filename: string) => path.join(process.cwd(), 'content', filename);

async function readJson(filename: string) {
  const filePath = getContentPath(filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJson(filename: string, data: any) {
  const filePath = getContentPath(filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return data;
}

async function withDatabase<T>(operation: () => Promise<T>) {
  await connectDB();
  return operation();
}

function serializeDocument(document: any) {
  if (!document) return document;
  const { _id, __v, createdAt, updatedAt, ...rest } = document;
  return rest;
}

function imageUrl(value: any): string {
  if (typeof value === 'string') return value.trim();
  if (!value || typeof value !== 'object') return '';
  return imageUrl(
    value.secureUrl ||
      value.image ||
      value.imageUrl ||
      value.featuredImage ||
      value.heroImage ||
      value.url
  );
}

function imageArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(imageUrl).filter(Boolean);
  }
  const resolved = imageUrl(value);
  return resolved ? [resolved] : [];
}

const ceosBootcamp4Images = [
  '/images/bootcamp/upcoming/ceos-bootcamp-4-side-profile.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-side-profile-alt.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-coming-soon-executive.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-coming-soon-woman.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-mobile-preview.jpg',
];

function normalizeBlogPost(post: any) {
  return {
    ...post,
    image: imageUrl(post.image || post.featuredImage || post.imageUrl || post.secureUrl),
  };
}

function normalizeProject(project: any) {
  return {
    ...project,
    year: Number(project.year) || new Date().getFullYear(),
    images: imageArray(project.images || project.gallery || project.heroImage || project.image),
    videos: Array.isArray(project.videos) ? project.videos : [],
    topics: Array.isArray(project.topics) ? project.topics : [],
    outcomes: Array.isArray(project.outcomes) ? project.outcomes : [],
  };
}

function normalizeBootcamp(bootcamp: any) {
  const isBootcamp4 = bootcamp.slug === 'ceos-bootcamp-4' || bootcamp.id === 'ceos-bootcamp-4';

  return {
    ...bootcamp,
    title: isBootcamp4 ? 'CEOs Bootcamp 4.0' : bootcamp.title,
    slug: isBootcamp4 ? 'ceos-bootcamp-4' : bootcamp.slug,
    status: isBootcamp4 ? 'upcoming' : bootcamp.status,
    registrationOpen: isBootcamp4 ? true : Boolean(bootcamp.registrationOpen),
    images: isBootcamp4
      ? ceosBootcamp4Images
      : imageArray(bootcamp.images || bootcamp.gallery || bootcamp.heroImage || bootcamp.image),
    videos: Array.isArray(bootcamp.videos) ? bootcamp.videos : [],
    objectives: Array.isArray(bootcamp.objectives) ? bootcamp.objectives : [],
    topics: Array.isArray(bootcamp.topics) ? bootcamp.topics : [],
    speakers: Array.isArray(bootcamp.speakers) ? bootcamp.speakers : [],
    testimonials: Array.isArray(bootcamp.testimonials) ? bootcamp.testimonials : [],
    published: bootcamp.published !== false,
  };
}

function normalizeProfile(profile: any) {
  const images = profile?.images || {};
  return {
    ...profile,
    images: {
      hero: imageUrl(images.hero || profile?.heroImage),
      about: imageUrl(images.about || profile?.aboutImage),
      speakerProfile: imageUrl(images.speakerProfile || images.speaker || profile?.speakerProfileImage),
      contact: imageUrl(images.contact || profile?.contactImage),
      author: imageUrl(images.author || profile?.authorImage),
    },
  };
}

function normalizeCalendarActivity(activity: any) {
  return {
    ...activity,
    image: imageUrl(activity.image || activity.imageUrl || activity.featuredImage),
    applicationOpen: Boolean(activity.applicationOpen),
  };
}

// --- Profile ---
export async function getProfile() {
  try {
    const profile = await withDatabase(() => Profile.findOne({ key: 'main' }).lean());
    if (profile) return normalizeProfile(serializeDocument(profile));
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return normalizeProfile(await readJson('profile.json'));
}

export async function updateProfile(data: any) {
  const normalized = normalizeProfile(data);
  try {
    const updated = await withDatabase(() =>
      Profile.findOneAndUpdate(
        { key: 'main' },
        { ...normalized, key: 'main' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean()
    );
    return normalizeProfile(serializeDocument(updated));
  } catch {
    return writeJson('profile.json', normalized);
  }
}

// --- Projects ---
export async function getProjects() {
  try {
    const projects = await withDatabase(() => Project.find({}).sort({ year: 1, createdAt: 1 }).lean());
    if (projects.length) return projects.map((project) => normalizeProject(serializeDocument(project)));
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return (await readJson('projects.json')).map(normalizeProject);
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
  const normalized = projects.map(normalizeProject);
  try {
    await withDatabase(async () => {
      await Project.deleteMany({});
      if (normalized.length) await Project.insertMany(normalized, { ordered: true });
    });
    return normalized;
  } catch {
    return writeJson('projects.json', normalized);
  }
}

// --- Bootcamps ---
export async function getBootcamps() {
  try {
    const bootcamps = await withDatabase(() => Bootcamp.find({}).sort({ createdAt: 1 }).lean());
    if (bootcamps.length) return bootcamps.map((bootcamp) => normalizeBootcamp(serializeDocument(bootcamp)));
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return (await readJson('bootcamps.json')).map(normalizeBootcamp);
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
  const normalized = bootcamps.map(normalizeBootcamp);
  try {
    await withDatabase(async () => {
      await Bootcamp.deleteMany({});
      if (normalized.length) await Bootcamp.insertMany(normalized, { ordered: true });
    });
    return normalized;
  } catch {
    return writeJson('bootcamps.json', normalized);
  }
}

// --- Blog ---
export async function getBlogPosts() {
  try {
    const posts = await withDatabase(() => BlogPost.find({}).sort({ createdAt: -1 }).lean());
    if (posts.length) return posts.map((post) => normalizeBlogPost(serializeDocument(post)));
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return (await readJson('blog.json')).map(normalizeBlogPost);
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
  const normalized = posts.map(normalizeBlogPost);
  try {
    await withDatabase(async () => {
      await BlogPost.deleteMany({});
      if (normalized.length) await BlogPost.insertMany(normalized, { ordered: true });
    });
    return normalized;
  } catch {
    return writeJson('blog.json', normalized);
  }
}

// --- Calendar ---
export async function getCalendarActivities() {
  try {
    const activities = await withDatabase(() => CalendarActivity.find({}).sort({ date: 1, createdAt: 1 }).lean());
    if (activities.length) return activities.map((activity) => normalizeCalendarActivity(serializeDocument(activity)));
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return (await readJson('calendar.json')).map(normalizeCalendarActivity);
}

export async function getCalendarActivityById(id: string) {
  const activities = await getCalendarActivities();
  return activities.find((a: any) => a.id === id);
}

export async function saveCalendarActivities(activities: any[]) {
  const normalized = activities.map(normalizeCalendarActivity);
  try {
    await withDatabase(async () => {
      await CalendarActivity.deleteMany({});
      if (normalized.length) await CalendarActivity.insertMany(normalized, { ordered: true });
    });
    return normalized;
  } catch {
    return writeJson('calendar.json', normalized);
  }
}

// --- Settings ---
export async function getSettings() {
  try {
    const settings = await withDatabase(() => Settings.findOne({ key: 'main' }).lean());
    if (settings) return serializeDocument(settings);
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return readJson('settings.json');
}

export async function updateSettings(data: any) {
  try {
    const updated = await withDatabase(() =>
      Settings.findOneAndUpdate(
        { key: 'main' },
        { ...data, key: 'main' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean()
    );
    return serializeDocument(updated);
  } catch {
    return writeJson('settings.json', data);
  }
}
