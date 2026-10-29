# Arman Ali – Graphic Designer Portfolio

A modern single-page portfolio website for **Arman Ali**, built with **Next.js (App Router)**, **Tailwind CSS v4**, **Framer Motion**, **Supabase**, and **Cloudinary**, ready for 1-click deployment on **Vercel**.

---

## 🎨 Brand Design & Color Palette

Curated dark-mode palette tailored for visual impact and typography hierarchy:

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Light** | `#DBD8E3` | Primary text, highlights, glowing elements |
| **Mid** | `#5C5470` | Secondary accents, borders, interactive states |
| **Dark** | `#352F44` | Secondary section background, subtle containers |
| **Deep** | `#2A2438` | Primary dark background, base surfaces |

---

## 🚀 Key Features

1. **Interactive Hero Section**:
   - Interactive canvas particle system.
   - Parallax Venom / creative design portrait reveal behind Arman's studio portrait.
   - Dynamic typewriter role rotator with quick call-to-action buttons.
2. **About Me**:
   - Animated bio with live count-up stats (`2+ Years Exp`, `50+ Projects`, `100% Satisfaction`).
   - Interactive skill proficiency bars (Photoshop, Illustrator, Canva, Banner & Signage, AI Design).
3. **Services (8 Core Specialties)**:
   - Logo & Brand Identity, Business Card Design, Banner & Signage, Flyer & Brochure, Social Media Creatives, AI-Assisted Design (Gemini / ChatGPT), Packaging, and Print Production.
4. **Interactive Portfolio Gallery**:
   - Filter tabs: *All, Business Cards, Banners, Menus, AI Art, Profile, Flyers*.
   - Responsive multi-column layout with smooth Framer Motion layout animations.
   - Built-in full-screen image lightbox modal with high-res preview and item descriptions.
5. **Timeline & Resume**:
   - Dual-column interactive timeline showcasing work experience (Sign Banner Printing, Freelance) and education (Diploma in Graphic Design, Matriculation in Computer Science).
6. **Testimonials**:
   - Animated slide carousel with client reviews, 5-star ratings, and navigation controls.
7. **Supabase-Powered Contact Form**:
   - Real-time client form validation with react-hot-toast notifications.
   - Automatic fallback to demo mode if credentials are not configured yet.
8. **Admin Panel** at `/admin`: login-protected CMS that edits every section, uploads images and shows contact messages (see below).
9. **SEO & Performance**:
   - OpenGraph metadata, Google Fonts (`Inter` + `Space Grotesk`), optimized responsive Next.js images.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Custom Properties
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Database / Backend**: Supabase
- **Media CDN**: Cloudinary / Local Optimized Images
- **Hosting**: Vercel

---

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` or edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** The site runs immediately out-of-the-box even without Supabase keys! In demo mode, contact submissions log cleanly to the console.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Admin Panel (`/admin`)

Everything on the site (name, hero text and images, about, stats, skills, services, portfolio projects and categories, resume and CV, testimonials, contact details, social links, SEO) can be edited at **`/admin`**. The panel also has an **Inbox** for contact form messages.

Until a section is saved from the admin panel, the site shows the built-in default content from `src/lib/content/defaults.ts`.

### One-time setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (the free plan is enough).
2. **Run the schema:** open *SQL Editor*, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click *Run*. This creates the tables, security rules and the `media` storage bucket.
3. **Add your keys** to `.env.local` (*Project Settings → API*):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. **Create your admin login:** *Authentication → Users → Add user*. Enter your email and a strong password, and tick **Auto Confirm User**.
5. **Make that user an admin.** Run this in the SQL Editor, using your own email:
   ```sql
   insert into public.admin_users (email) values ('you@example.com');
   ```
6. **Recommended:** turn off public sign-ups (*Authentication → Sign In / Providers → Allow new users to sign up*). Strangers still could not edit anything without being in `admin_users`, but this keeps the user list clean.
7. Restart `npm run dev` and open [http://localhost:3000/admin](http://localhost:3000/admin).

### How it works

- Each section is stored as one JSON row in the `site_content` table.
- Saving runs a server action as the signed-in user, so Supabase row-level security decides who may write. After a save, the cached homepage refreshes right away (`updateTag`).
- Uploaded images and the CV go to the public `media` storage bucket.
- Shortcut: **Ctrl/Cmd + S** saves the section you are editing.

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In the **Environment Variables** section, paste the values from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_SITE_URL` (set to your custom domain or `https://your-project.vercel.app`)
4. Click **Deploy**! 🚀
