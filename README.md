# 💎 Ekaashi Jewelry Store

A modern, production-ready jewelry e-commerce platform built with **Next.js 14** and industry-standard practices. Features complete admin management, shopping cart, checkout, and 25 curated products across 5 categories.

## ✨ Features

### Customer Features
- 25 curated products across 5 jewelry categories
- Shopping cart with persistent storage
- Guest and registered user checkout
- Order tracking and history
- User authentication (NextAuth.js)
- Profile management

### Admin Dashboard
- Product management (CRUD operations)
- Order management and status updates
- Banner management for homepage
- Abandoned cart tracking
- Image upload via Cloudinary

### Technical Features
- Mobile-first responsive design
- Client-side data fetching (like Amazon/Shopify)
- SEO optimized with structured data
- Image optimization and CDN
- TypeScript for type safety
- Tailwind CSS for styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (optional, for image uploads)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Seed Database

Visit `/seed` page and click "Seed Database" button, or run:

```bash
curl -X POST http://localhost:3000/api/seed-mongodb
```

This creates:
- 1 admin user (admin@ekaashi.com / admin123)
- 5 categories
- 25 products with high-quality images
- 2 homepage banners

## 🌐 Live Demo

- **Website**: https://ekaashi-com.vercel.app
- **Admin Panel**: https://ekaashi-com.vercel.app/admin
- **Credentials**: admin@ekaashi.com / admin123

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Hosting**: Cloudinary
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🗂️ **Project Structure**

```
src/
├── app/                    # Next.js 16 App Router
│   ├── (admin)/           # Admin dashboard routes
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Order checkout
│   ├── orders/            # Order management
│   ├── product/           # Product pages
│   ├── profile/           # User profiles
│   └── ...                # Other pages
├── components/            # Reusable React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
└── types/                # TypeScript definitions
```

## 🔧 Environment Variables

Create `.env` file in the root directory:

```bash
# Database (Required)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"

# Authentication (Required)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Visit `/seed` to populate database

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📚 Documentation

- **CODEBASE_STANDARDS.md** - Architecture and best practices
- **INDUSTRY_STANDARD_SOLUTION.md** - Data fetching strategy
- **SEED_COMPLETE.md** - Database seeding details

## 🔒 Security

- Password hashing with bcryptjs (12 rounds)
- JWT-based session management
- Input validation on all forms
- Environment variable protection
- HTTPS enforcement in production

---

**Built with industry-standard practices • Production-ready • Fully responsive**