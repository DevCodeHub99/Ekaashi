# Ekaashi Jewelry Store - Architecture Documentation

## Project Overview
Modern e-commerce platform built with Next.js 14+, TypeScript, Prisma, and MongoDB.

## Technology Stack

### Core
- **Framework**: Next.js 14.1.4 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components

### Key Libraries
- **Image Management**: Cloudinary, Sharp
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **State Management**: React Context API
- **Validation**: Zod

## Project Structure

```
jewelry-store/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/
│   ├── robots.txt                 # SEO robots file
│   └── sitemap.xml                # SEO sitemap
├── scripts/
│   ├── init-db.js                 # Database initialization
│   ├── reset-and-seed.js          # Reset and seed database
│   ├── seed-all-categories.js     # Seed categories
│   ├── seed-categories.js         # Seed categories
│   ├── seed-color-variants.js     # Seed product variants
│   └── seed-instagram.js          # Seed Instagram posts
└── src/
    ├── app/                       # Next.js App Router
    │   ├── (admin)/              # Admin route group
    │   │   ├── admin/            # Admin pages
    │   │   └── layout.tsx        # Admin layout with sidebar
    │   ├── api/                  # API routes
    │   │   ├── admin/            # Admin API endpoints
    │   │   ├── auth/             # Authentication endpoints
    │   │   ├── cart/             # Cart management
    │   │   ├── categories/       # Category endpoints
    │   │   ├── products/         # Product endpoints
    │   │   ├── orders/           # Order management
    │   │   └── wishlist/         # Wishlist endpoints
    │   ├── auth/                 # Authentication pages
    │   ├── product/[slug]/       # Dynamic product pages
    │   ├── category/[slug]/      # Dynamic category pages
    │   ├── cart/                 # Shopping cart page
    │   ├── checkout/             # Checkout page
    │   ├── wishlist/             # Wishlist page
    │   ├── orders/               # Order history
    │   ├── profile/              # User profile
    │   ├── about/                # About page
    │   ├── contact/              # Contact page
    │   ├── deals/                # Deals page
    │   ├── new-arrivals/         # New arrivals page
    │   ├── products/             # All products page
    │   ├── layout.tsx            # Root layout
    │   ├── page.tsx              # Homepage
    │   ├── globals.css           # Global styles
    │   ├── robots.ts             # Dynamic robots.txt
    │   └── sitemap.ts            # Dynamic sitemap
    ├── components/
    │   ├── admin/                # Admin-specific components
    │   │   └── ProductVariants.tsx
    │   ├── home/                 # Homepage components
    │   │   ├── CategoryGrid.tsx
    │   │   └── InstagramFeed.tsx
    │   ├── layout/               # Layout components
    │   │   ├── header.tsx        # Main header with navigation
    │   │   ├── footer.tsx        # Footer
    │   │   └── CategoryNav.tsx   # Category navigation
    │   ├── products/             # Product-related components
    │   │   └── ProductGrid.tsx
    │   ├── providers/            # Context providers
    │   │   └── session-provider.tsx
    │   ├── seo/                  # SEO components
    │   │   └── structured-data.tsx
    │   └── ui/                   # Reusable UI components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── image-upload.tsx
    │       ├── image-zoom.tsx
    │       ├── product-card.tsx
    │       ├── product-image.tsx
    │       ├── search-modal.tsx
    │       └── toast.tsx
    ├── contexts/                 # React Context
    │   └── cart-context.tsx      # Shopping cart state
    ├── lib/                      # Utility libraries
    │   ├── auth.ts               # NextAuth configuration
    │   ├── cache.ts              # Caching utilities
    │   ├── cloudinary.ts         # Cloudinary integration
    │   ├── email-templates.ts    # Email templates
    │   ├── monitoring.ts         # Monitoring utilities
    │   ├── prisma.ts             # Prisma client
    │   ├── rate-limit.ts         # Rate limiting
    │   ├── session.ts            # Session management
    │   └── utils.ts              # General utilities
    └── types/                    # TypeScript types
        └── next-auth.d.ts        # NextAuth type extensions
```

## Architecture Patterns

### 1. App Router (Next.js 14+)
- **File-based routing**: Pages defined by folder structure
- **Server Components**: Default for better performance
- **Client Components**: Marked with 'use client' directive
- **Route Groups**: `(admin)` for layout isolation
- **Dynamic Routes**: `[slug]` for dynamic pages

### 2. API Routes
- **RESTful design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Route handlers**: Located in `app/api/*/route.ts`
- **Middleware**: Authentication, rate limiting
- **Error handling**: Consistent error responses

### 3. Database Layer
- **Prisma ORM**: Type-safe database access
- **MongoDB**: NoSQL database for flexibility
- **Models**: User, Product, Category, Order, Cart, Wishlist, etc.
- **Relations**: Proper foreign keys and relations

### 4. State Management
- **Server State**: React Server Components
- **Client State**: React Context API (Cart, Toast)
- **Form State**: React Hook Form
- **URL State**: Next.js router

### 5. Authentication
- **NextAuth.js**: Industry-standard authentication
- **Credentials Provider**: Email/password login
- **Session Management**: JWT tokens
- **Role-based Access**: ADMIN, CUSTOMER roles

### 6. Component Architecture
```
Component Hierarchy:
├── Layout Components (Header, Footer)
├── Page Components (Server Components)
├── Feature Components (Client Components)
└── UI Components (Reusable)
```

### 7. Styling Strategy
- **Tailwind CSS**: Utility-first CSS
- **Mobile-first**: Responsive design
- **Design System**: Consistent colors, spacing
- **Custom Components**: Radix UI primitives

## Key Features

### Customer Features
- ✅ Product browsing with filters
- ✅ Product search with real-time results
- ✅ Shopping cart with persistence
- ✅ Wishlist functionality
- ✅ User authentication
- ✅ Order management
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ SEO optimization
- ✅ Image zoom functionality

### Admin Features
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Order management
- ✅ Banner management
- ✅ Instagram feed management
- ✅ Abandoned cart tracking
- ✅ Collapsible sidebar navigation

## Best Practices Implemented

### 1. Code Organization
- ✅ Feature-based folder structure
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Type safety with TypeScript

### 2. Performance
- ✅ Server-side rendering (SSR)
- ✅ Static generation where possible
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting
- ✅ Lazy loading

### 3. Security
- ✅ Authentication & authorization
- ✅ Input validation
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF protection

### 4. SEO
- ✅ Meta tags
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Semantic HTML

### 5. User Experience
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Optimistic updates
- ✅ Smooth animations

## API Endpoints

### Public Endpoints
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `GET /api/products/search` - Search products
- `GET /api/categories` - List categories
- `GET /api/banners` - Get banners
- `GET /api/instagram` - Get Instagram posts

### Authenticated Endpoints
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart` - Update cart
- `DELETE /api/cart` - Remove from cart
- `POST /api/wishlist` - Add to wishlist
- `GET /api/wishlist` - Get wishlist
- `DELETE /api/wishlist` - Remove from wishlist
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Admin Endpoints
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/[id]` - Update order status

## Database Schema

### Core Models
- **User**: Customer and admin accounts
- **Product**: Product catalog
- **ProductVariant**: Product variations (color, size)
- **Category**: Product categories
- **Order**: Customer orders
- **OrderItem**: Order line items
- **CartItem**: Shopping cart items
- **WishlistItem**: Wishlist items
- **Banner**: Homepage banners
- **InstagramPost**: Instagram feed
- **AbandonedCart**: Abandoned cart tracking

## Environment Variables

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## Development Workflow

### Setup
```bash
npm install
npx prisma generate
npm run dev
```

### Database Operations
```bash
# Initialize database
node scripts/init-db.js

# Reset and seed
node scripts/reset-and-seed.js

# Seed specific data
node scripts/seed-categories.js
node scripts/seed-instagram.js
```

### Build & Deploy
```bash
npm run build
npm start
```

## Future Improvements

### Recommended Enhancements
1. **Testing**: Add unit and integration tests (Jest, React Testing Library)
2. **Error Tracking**: Integrate Sentry or similar
3. **Analytics**: Add Google Analytics or Mixpanel
4. **Payment Gateway**: Integrate Stripe or Razorpay
5. **Email Service**: Add transactional emails (SendGrid, Resend)
6. **Caching**: Implement Redis for better performance
7. **CDN**: Use Vercel Edge or Cloudflare
8. **Monitoring**: Add performance monitoring
9. **Internationalization**: Add multi-language support
10. **Progressive Web App**: Add PWA features

## Deployment

### Recommended Platforms
- **Vercel**: Optimal for Next.js (recommended)
- **Netlify**: Alternative option
- **AWS**: For enterprise deployments
- **Railway**: Simple deployment option

### Database Hosting
- **MongoDB Atlas**: Cloud-hosted MongoDB (current)
- **Vercel Postgres**: Alternative option

## Maintenance

### Regular Tasks
- Monitor error logs
- Update dependencies monthly
- Backup database weekly
- Review performance metrics
- Update content (products, banners)
- Check abandoned carts
- Review and fulfill orders

## Support & Documentation

### Resources
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org
- Tailwind Docs: https://tailwindcss.com/docs

### Contact
- Developer: [Your Name]
- Email: [Your Email]
- Repository: [GitHub URL]

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
