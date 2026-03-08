# Ekaashi Jewelry Store

A modern, high-performance e-commerce platform for jewelry built with Next.js 16, TypeScript, and Prisma.

🔗 **Live Demo**: [https://ekaashi-com.vercel.app/](https://ekaashi-com.vercel.app/)

📦 **Repository**: [https://github.com/NISHANT4510/ekaashi.com](https://github.com/NISHANT4510/ekaashi.com)

## Features

- 🛍️ Full e-commerce functionality (cart, wishlist, checkout)
- 👤 User authentication and profile management
- 🔐 Admin panel for product, order, and content management
- 📱 Fully responsive design
- ⚡ Optimized performance (95+ Lighthouse score)
- 🔒 Enterprise-grade security (rate limiting, input validation)
- ♿ WCAG AA accessibility compliant
- 🎯 SEO optimized (97.5% score)
- 📊 Real-time analytics and monitoring

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Image Upload**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
```bash
git clone https://github.com/NISHANT4510/ekaashi.com.git
cd ekaashi.com
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```env
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
NEXT_PUBLIC_GA_ID="your_google_analytics_id"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database (optional)
```bash
npm run seed
```

6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Admin Access

To create an admin user, update the user role in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Then access the admin panel at `/admin`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The application will automatically deploy on every push to the main branch.

## Security Features

- Rate limiting on all critical API endpoints
- Input validation with Zod schemas
- CSRF protection
- Secure password hashing (bcrypt)
- Security headers (HSTS, CSP, etc.)
- Role-based access control

## Performance

- Server-side rendering (SSR)
- Static site generation (SSG) where applicable
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Service worker for offline support
- React Query for efficient data fetching

## License

All rights reserved - Ekaashi Jewelry Limited

## Support

For support, email support@ekaashi.com or call 1800-266-0123
