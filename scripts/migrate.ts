import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../content');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

async function migrate() {
  try {
    const { profile } = await import('../data/profile.js');
    fs.writeFileSync(path.join(contentDir, 'profile.json'), JSON.stringify(profile, null, 2));

    const { projects } = await import('../data/projects.js');
    fs.writeFileSync(path.join(contentDir, 'projects.json'), JSON.stringify(projects, null, 2));

    const { bootcamps } = await import('../data/bootcamps.js');
    fs.writeFileSync(path.join(contentDir, 'bootcamps.json'), JSON.stringify(bootcamps, null, 2));

    const { blogPosts } = await import('../data/blog.js');
    fs.writeFileSync(path.join(contentDir, 'blog.json'), JSON.stringify(blogPosts, null, 2));

    const { calendarActivities } = await import('../data/calendarActivities.js');
    fs.writeFileSync(path.join(contentDir, 'calendar.json'), JSON.stringify(calendarActivities, null, 2));

    const settings = {
      siteTitle: "Wilcom Duncan | Official Website",
      siteDescription: "SME Development Consultant, Entrepreneur, and Media Executive.",
      seoKeywords: "Wilcom Duncan, Consultant, Media, Liberia, CEOs Bootcamp",
      contactEmail: "admin@example.com",
      phone: "+231 00 000 000",
      whatsapp: "+231 00 000 000",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
      defaultMetaImage: "/images/og-image.jpg",
      footerText: "© 2026 Wilcom Duncan. All rights reserved."
    };
    fs.writeFileSync(path.join(contentDir, 'settings.json'), JSON.stringify(settings, null, 2));

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
