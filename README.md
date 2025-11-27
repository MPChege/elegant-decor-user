# Elegant Tiles & Décor Centre Ltd - Website

> **2025–2026 Frontend Master Build**  
> A cinematic, high-performance, ultra-premium website for an award-winning interior design company.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)

---

## 🎯 Vision

An **immersive digital showroom** that fuses modern minimalism, 3D motion design, and AI personalization — creating a website that feels alive, tactile, and emotionally rich.

> *"This doesn't just show design — it feels like design."*

---

## ⚡ Tech Stack

### Core Framework
- **Next.js 15** (React 19, TypeScript)
- **App Router** + Server Actions + Edge Functions

### UI & Styling
- **TailwindCSS v4** with custom burgundy/cream theme
- **ShadCN/UI** components
- **Framer Motion** for micro-interactions
- **GSAP** for scroll-based storytelling
- **Lucide React** icons
- **Radix UI** for accessibility

### Backend & Database
- **Supabase** (Auth, Database, Storage)
- **Realtime DB** sync
- Edge Functions for performance

### Performance
- **Vercel Edge** deployment
- **next/image** optimization
- Lazy loading & code splitting
- **Lighthouse Score Target: 95+**

---

## 🎨 Brand System

### Color Palette

#### Light Mode
- **Background**: Warm cream/beige `hsl(35, 25%, 94%)`
- **Foreground**: Deep burgundy `hsl(350, 50%, 28%)`
- **Primary**: Vibrant red `hsl(352, 68%, 50%)`
- **Secondary**: Rich burgundy `hsl(350, 45%, 35%)`
- **Accent**: Bright red `hsl(355, 65%, 55%)`

#### Dark Mode
- **Background**: Deep burgundy black `hsl(350, 30%, 12%)`
- Maintains primary accent colors

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

---

## 📁 Project Structure

```
elegant-tiles-decor/
├── app/                    # Next.js App Router pages
│   ├── (routes)/
│   │   ├── page.tsx       # Home page
│   │   ├── services/      # Services page
│   │   ├── work/          # Portfolio/projects
│   │   ├── products/      # Product catalog
│   │   ├── journal/       # Blog/articles
│   │   ├── about/         # About us
│   │   ├── contact/       # Contact form
│   │   └── approach/      # Our approach
│   ├── admin/             # Admin dashboard
│   ├── ai/                # AI features
│   │   ├── moodboard/     # AI Moodboard Builder
│   │   └── assistant/     # Virtual Design Assistant
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # ShadCN UI components
│   ├── layout/            # Layout components
│   ├── animations/        # Animation components
│   └── mobile/            # Mobile-specific components
├── lib/
│   ├── brand.ts           # Brand system config
│   ├── utils.ts           # Utility functions
│   ├── supabase.ts        # Supabase client
│   └── database.types.ts  # TypeScript types
├── features/              # Feature modules
├── public/                # Static assets
└── tailwind.config.ts     # Tailwind configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd elegant-tiles-decor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🗄️ Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the schema from `lib/supabase-schema.sql`
3. Set up storage buckets:
   - `products`
   - `projects`
   - `blog`
4. Configure authentication providers
5. Add environment variables to `.env.local`:

```env
# ⚠️ IMPORTANT: Never commit actual API keys to version control!
# Get these values from your Supabase project settings (Settings → API)

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Security Note**: 
- The `NEXT_PUBLIC_*` variables are safe to expose in client-side code
- The `SUPABASE_SERVICE_ROLE_KEY` is **SECRET** and must never be exposed publicly
- Always use `.env.local` (which is gitignored) for local development
- For production (Vercel), add these as environment variables in your deployment settings

---

## 🧠 AI Features

### 1. AI Moodboard Builder (`/ai/moodboard`)
- Upload inspiration images
- AI generates color palettes
- Matches with product catalog
- Download and save palettes

### 2. Virtual Design Assistant - Amira (`/ai/assistant`)
- Real-time chat interface
- Personalized design recommendations
- Product suggestions
- Design Q&A

### 3. AI Portfolio Tagging (Admin)
- Auto-tags uploaded project images
- Improves search and filtering
- Metadata generation

---

## 📱 Mobile Experience

### Features
- **Sticky Bottom CTA Bar** - Quick access to contact actions
- **Swipe Gestures** - Intuitive navigation
- **Haptic Feedback** - Enhanced tactile experience
- **Adaptive Layouts** - Optimized for all screen sizes
- **Bottom Navigation** - Mobile-friendly menu

---

## 🎭 Animations

### Framer Motion
- Page transitions
- Micro-interactions
- Hover states
- Scroll reveals

### Components
- `ScrollReveal` - Viewport-based animations
- `ParallaxSection` - Parallax scrolling
- `StaggerChildren` - Staggered animations
- `LuxuryLayout` - Ambient backgrounds

---

## 🛡️ Admin Dashboard (`/admin`)

### Features
- **Analytics Dashboard** - Views, inquiries, metrics
- **Content Management** - CRUD for all entities
- **Product Management** - Inventory and details
- **Project Portfolio** - Gallery management
- **Blog Management** - Article publishing
- **Inquiry Management** - Customer inquiries
- **Audit Logs** - Activity tracking

---

## 🎯 Performance Optimizations

- **Image Optimization**: next/image with WebP
- **Code Splitting**: Dynamic imports
- **Edge Caching**: Vercel Edge Functions
- **Lazy Loading**: Components and routes
- **Font Optimization**: Variable fonts
- **Bundle Analysis**: Optimized dependencies

---

## ♿ Accessibility

- **ARIA Labels**: Semantic HTML
- **Keyboard Navigation**: Full support
- **Reduced Motion**: Respects user preferences
- **Screen Reader**: Optimized content
- **Color Contrast**: WCAG AA compliant

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 🎨 Customization

### Brand Colors
Edit `tailwind.config.ts` and `app/globals.css` to customize the color scheme.

### Typography
Update font imports in `app/layout.tsx`.

### Brand System
Modify `lib/brand.ts` for comprehensive brand configuration.

---

## 📄 Pages

1. **Home** (`/`) - Hero, services, featured work
2. **Services** (`/services`) - Service offerings
3. **Our Work** (`/work`) - Project portfolio
4. **Products** (`/products`) - Product catalog
5. **Journal** (`/journal`) - Blog articles
6. **About** (`/about`) - Company story
7. **Contact** (`/contact`) - Contact form
8. **Approach** (`/approach`) - Our process
9. **Admin** (`/admin`) - Dashboard (protected)
10. **AI Tools** (`/ai/*`) - AI features

---

## 🤝 Contributing

This is a proprietary project for Elegant Tiles & Décor Centre Ltd.

---

## 📝 License

© 2025 Elegant Tiles & Décor Centre Ltd. All rights reserved.

---

## 🏆 Goals

- ✅ **Award-Grade Design** - Awwwards-worthy
- ✅ **Performance** - Lighthouse 95+
- ✅ **Accessibility** - WCAG AA
- ✅ **User Experience** - Intuitive and delightful
- ✅ **Innovation** - AI-powered features

---

## 🎉 Built With Love

Crafted with attention to every pixel, optimized for performance, and designed to inspire.

**Elegant Tiles & Décor Centre Ltd** - Where elegance meets design.
