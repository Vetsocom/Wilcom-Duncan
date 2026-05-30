## Environment Changes

After changing `.env.local`, restart the Next.js dev server. Next.js reads server-side environment variables such as `MONGODB_URI`, `CONTACT_RECEIVER_EMAIL`, and `SMTP_*` when the server starts.
# Wilcom Duncan Solutions - Next.js 14 Project

A professional web application for Wilcom Duncan Solutions built with Next.js 14, React 18, and TypeScript. This project features a modern UI, email integration, and SEO optimization.

## Prerequisites

- Node.js version 18 or higher
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Wilcom-Duncan
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/wilcom-duncan?retryWrites=true&w=majority

# Contact Form Email Settings
CONTACT_RECEIVER_EMAIL=your-email@example.com

# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@example.com
SMTP_TO=your-email@example.com
```

**Environment Changes**

After changing `.env.local`, restart the Next.js dev server. Next.js reads server-side environment variables such as `MONGODB_URI`, `CONTACT_RECEIVER_EMAIL`, and `SMTP_*` when the server starts.

## Usage

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production

Build and run the production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
Wilcom-Duncan/
├── app/                    # Next.js 14 App Router pages
│   ├── api/                # API routes
│   ├── (marketing)/        # Marketing site pages
│   └── (admin)/            # Admin site pages (if applicable)
├── components/             # Reusable React components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── marketing/          # Marketing-specific components
│   └── admin/              # Admin-specific components
├── lib/                    # Utility functions
│   ├── mongodb.ts          # MongoDB connection
│   ├── email.ts            # Email sending utilities
│   ├── analytics.ts        # Analytics functions
│   └── auth.ts             # Authentication utilities
├── public/                 # Publicly accessible files
├── styles/                 # Global styles
├── .env.local              # Environment variables (not in git)
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React, shadcn/ui
- **Database**: MongoDB (via Mongoose)
- **Email**: Nodemailer (SMTP)
- **Forms**: React Hook Form, Zod (validation)
- **Analytics**: Google Analytics integration
- **SEO**: Open Graph, Twitter Cards, JSON-LD
- **Testing**: Jest, React Testing Library (optional)

## Key Features

### Marketing Site
- Home page with hero section
- Services pages
- Contact page with form submission
- SEO optimized (Open Graph, Twitter Cards, JSON-LD)

### Admin Dashboard
- Contact form submissions management
- Service listings management
- User authentication (if applicable)

## Development Commands

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run tests
npm test

# Run code formatting
npm run format

# Build for production
npm run build

# Start production server
npm start
```

## Testing

This project uses Jest and React Testing Library for unit testing.

```bash
# Run all tests
npm test

# Run tests with watch mode
npm test -- --watch
```

## Contributing

1. Create a feature branch:
   ```bash
   git checkout -b feature/awesome-feature
   ```

2. Make your changes

3. Run tests and formatting:
   ```bash
   npm test
   npm run format
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add awesome feature"
   ```

5. Push to the remote repository:
   ```bash
   git push origin feature/awesome-feature
   ```

## License

MIT License

---

Built with ❤️ for Wilcom Duncan Solutions
