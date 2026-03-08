// Simple rate limiting for API routes
// In production, use Redis-based rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // If no entry or window has expired, create new entry
    if (!entry || now > entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    // If within limit, increment and allow
    if (entry.count < this.maxRequests) {
      entry.count++
      return true
    }

    // Rate limit exceeded
    return false
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return Date.now() + this.windowMs
    }
    return entry.resetTime
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Create rate limiters for different endpoints
export const apiRateLimit = new RateLimiter(100, 15 * 60 * 1000) // 100 requests per 15 minutes
export const authRateLimit = new RateLimiter(5, 15 * 60 * 1000)  // 5 auth attempts per 15 minutes
export const uploadRateLimit = new RateLimiter(10, 60 * 1000)    // 10 uploads per minute
export const profileRateLimit = new RateLimiter(10, 15 * 60 * 1000) // 10 profile updates per 15 minutes
export const passwordRateLimit = new RateLimiter(3, 15 * 60 * 1000) // 3 password changes per 15 minutes
export const wishlistRateLimit = new RateLimiter(50, 15 * 60 * 1000) // 50 wishlist ops per 15 minutes

// Cleanup expired entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    apiRateLimit.cleanup()
    authRateLimit.cleanup()
    uploadRateLimit.cleanup()
    profileRateLimit.cleanup()
    passwordRateLimit.cleanup()
    wishlistRateLimit.cleanup()
  }, 5 * 60 * 1000)
}

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Rate limit middleware
export function withRateLimit(
  rateLimiter: RateLimiter,
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async function(request: Request, ...args: any[]): Promise<Response> {
    const id = getClientIP(request)
    
    if (!rateLimiter.isAllowed(id)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimiter.getResetTime(id) - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimiter['maxRequests'].toString(),
            'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(id).toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimiter.getResetTime(id) / 1000).toString(),
            'Retry-After': Math.ceil((rateLimiter.getResetTime(id) - Date.now()) / 1000).toString()
          }
        }
      )
    }

    return handler(request, ...args)
  }
}