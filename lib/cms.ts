import fs from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db';
import { BlogPost } from '@/models/BlogPost';
import { Bootcamp } from '@/models/Bootcamp';
import { CalendarActivity } from '@/models/CalendarActivity';
import { Profile } from '@/models/Profile';
import { Project } from '@/models/Project';
import { Settings } from '@/models/Settings';

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

type CmsSpeaker = { name: string; title?: string; image?: string; bio?: string };

function defaultSpeakerImage(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('janice')) return '/images/speaker1.0.jpg';
  if (normalized.includes('mamudu') || normalized.includes('darbo')) {
    return '/images/bootcamp/global-entrepreneur-week-session.jpg';
  }
  if (normalized.includes('wilcom') || normalized.includes('duncan')) {
    return '/images/bootcamp/ceos-bootcamp-hero-speaker.jpg';
  }
  return '/images/bootcamp/ceos-bootcamp-speaker-spotlight.jpg';
}

function normalizeSpeakers(value: any): CmsSpeaker[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((speaker): CmsSpeaker | null => {
      if (typeof speaker === 'string') {
        const name = speaker.trim();
        return name ? { name, image: defaultSpeakerImage(name) } : null;
      }

      if (!speaker || typeof speaker !== 'object') return null;

      const name = String(speaker.name || '').trim();
      if (!name) return null;

      return {
        name,
        title: typeof speaker.title === 'string' ? speaker.title.trim() : '',
        image: imageUrl(speaker.image || speaker.photo || speaker.imageUrl) || defaultSpeakerImage(name),
        bio: typeof speaker.bio === 'string' ? speaker.bio.trim() : '',
      };
    })
    .filter((speaker): speaker is CmsSpeaker => Boolean(speaker));
}

const ceosBootcamp4Images = [
  '/images/bootcamp/upcoming/ceos-bootcamp-4-side-profile.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-side-profile-alt.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-coming-soon-executive.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-coming-soon-woman.jpg',
  '/images/bootcamp/upcoming/ceos-bootcamp-4-mobile-preview.jpg',
];

const defaultHeroParagraph =
  'SME Development Consultant and Executive Business Trainer helping founders, corporate teams, and enterprises build with clarity, structure, and long-term value.';

const defaultAboutPreviewText =
  "Wilcom's work goes beyond motivation. He helps business leaders examine how their companies create value, communicate with the market, position their brands, and prepare for sustainable growth. His sessions are practical, direct, and built for entrepreneurs and executives who want to move from ideas to execution.";

const defaultImpactStats = [
  { value: '5+', label: 'Bootcamp & Executive Learning Experiences' },
  { value: '100+', label: 'Entrepreneurs and Emerging Leaders Reached' },
  { value: '10+', label: 'Business, Media, and Leadership Engagements' },
  { value: '1', label: 'Mission: Building Value-Driven Business Leaders' },
];

const defaultTestimonials = [
  {
    quote: 'The session helped me rethink how my business creates value and how I communicate that value to customers.',
    name: 'CEOs Bootcamp Participant',
    role: 'Entrepreneur',
  },
  {
    quote: 'Wilcom brings clarity, structure, and practical business thinking into the room. His approach is direct and useful for founders.',
    name: 'Business Training Participant',
    role: 'Founder',
  },
  {
    quote: 'CEOs Bootcamp created a serious space for learning, networking, and honest reflection about business growth.',
    name: 'CEOs Bootcamp Attendee',
    role: 'SME Owner',
  },
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
    speakers: normalizeSpeakers(bootcamp.speakers),
    testimonials: Array.isArray(bootcamp.testimonials) ? bootcamp.testimonials : [],
    published: bootcamp.published !== false,
  };
}

function normalizeProfile(profile: any) {
  const images = profile?.images || {};
  return {
    ...profile,
    heroParagraph: profile?.heroParagraph || defaultHeroParagraph,
    aboutPreviewText: profile?.aboutPreviewText || defaultAboutPreviewText,
    impactStats:
      Array.isArray(profile?.impactStats) && profile.impactStats.length
        ? profile.impactStats
        : defaultImpactStats,
    impactStatsNote:
      profile?.impactStatsNote || 'Replace these numbers with verified client-approved impact figures.',
    testimonials:
      Array.isArray(profile?.testimonials) && profile.testimonials.length
        ? profile.testimonials
        : defaultTestimonials,
    testimonialsNote:
      profile?.testimonialsNote || 'Replace with verified testimonials provided by the client.',
    images: {
      hero: imageUrl(images.hero || profile?.heroImage),
      about: imageUrl(images.about || profile?.aboutImage),
      speakerProfile: imageUrl(images.speakerProfile || images.speaker || profile?.speakerProfileImage),
      contact: imageUrl(images.contact || profile?.contactImage),
      author: imageUrl(images.author || profile?.authorImage),
    },
  };
}

function normalizeSettings(settings: any) {
  return {
    ...settings,
    siteUrl: settings?.siteUrl || 'https://wilcomduncan.com',
    schedulingLink: settings?.schedulingLink || 'https://calendly.com/wilcomduncan',
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
    if (settings) return normalizeSettings(serializeDocument(settings));
  } catch {
    // Fall back to bundled content when MongoDB is unavailable or not seeded.
  }
  return normalizeSettings(await readJson('settings.json'));
}

export async function updateSettings(data: any) {
  const normalized = normalizeSettings(data);
  try {
    const updated = await withDatabase(() =>
      Settings.findOneAndUpdate(
        { key: 'main' },
        { ...normalized, key: 'main' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean()
    );
    return normalizeSettings(serializeDocument(updated));
  } catch {
    return writeJson('settings.json', normalized);
  }
}
