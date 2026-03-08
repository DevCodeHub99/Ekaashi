import { z } from 'zod'

// Auth validations
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// User profile validations
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
})

// Wishlist validations
export const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
})

// Product validations
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
})

// Cart validations
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive().max(99, 'Maximum quantity is 99'),
  sessionId: z.string().optional(),
})

export const updateCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(0).max(99, 'Maximum quantity is 99'),
  sessionId: z.string().optional(),
})

// Order validations
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, 'Order must have at least one item'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().min(5).max(10),
    country: z.string().min(2),
    phone: z.string().min(10).max(15),
  }),
  paymentMethod: z.enum(['card', 'paypal', 'cod']),
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

// Search validation
export const searchSchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters').max(100),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
})

// Admin validations
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().max(500).optional(),
})

export const bannerSchema = z.object({
  title: z.string().min(3).max(100),
  subtitle: z.string().max(200).optional(),
  image: z.string().url('Invalid image URL'),
  link: z.string().url('Invalid link URL').optional(),
  active: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
})

// Type exports
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>
export type ProductInput = z.infer<typeof productSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartInput = z.infer<typeof updateCartSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BannerInput = z.infer<typeof bannerSchema>
