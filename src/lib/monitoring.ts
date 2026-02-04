// Performance monitoring and logging utilities

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private timers = new Map<string, number>()

  startTimer(name: string): void {
    this.timers.set(name, Date.now())
  }

  endTimer(name: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(name)
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`)
      return 0
    }

    const duration = Date.now() - startTime
    this.timers.delete(name)

    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
      metadata
    })

    // Log slow operations (> 1 second)
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration}ms`, metadata)
    }

    return duration
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getAverageTime(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name)
    if (relevantMetrics.length === 0) return 0

    const total = relevantMetrics.reduce((sum, m) => sum + m.duration, 0)
    return total / relevantMetrics.length
  }

  clearMetrics(): void {
    this.metrics = []
  }

  // Get metrics summary
  getSummary(): Record<string, { count: number; avgTime: number; maxTime: number }> {
    const summary: Record<string, { count: number; avgTime: number; maxTime: number }> = {}

    for (const metric of this.metrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, avgTime: 0, maxTime: 0 }
      }

      summary[metric.name].count++
      summary[metric.name].maxTime = Math.max(summary[metric.name].maxTime, metric.duration)
    }

    // Calculate averages
    for (const name in summary) {
      summary[name].avgTime = this.getAverageTime(name)
    }

    return summary
  }
}

export const monitor = new PerformanceMonitor()

// Database query monitoring wrapper
export async function monitorQuery<T>(
  name: string,
  query: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  monitor.startTimer(`db:${name}`)
  try {
    const result = await query()
    monitor.endTimer(`db:${name}`, metadata)
    return result
  } catch (error) {
    monitor.endTimer(`db:${name}`, { ...metadata, error: true })
    throw error
  }
}

// API route monitoring wrapper
export function monitorAPI(name: string) {
  return function(handler: Function) {
    return async function(...args: any[]) {
      monitor.startTimer(`api:${name}`)
      try {
        const result = await handler(...args)
        monitor.endTimer(`api:${name}`, { success: true })
        return result
      } catch (error) {
        monitor.endTimer(`api:${name}`, { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
        throw error
      }
    }
  }
}

// Error logging
export function logError(error: Error, context?: Record<string, any>): void {
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  })

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context })
  }
}

// Health check utility
export function getHealthStatus() {
  const summary = monitor.getSummary()
  const now = Date.now()
  const fiveMinutesAgo = now - 5 * 60 * 1000

  // Get recent metrics (last 5 minutes)
  const recentMetrics = monitor.getMetrics().filter(m => m.timestamp > fiveMinutesAgo)

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    recentActivity: {
      totalRequests: recentMetrics.length,
      averageResponseTime: recentMetrics.length > 0 
        ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
        : 0,
      slowRequests: recentMetrics.filter(m => m.duration > 1000).length
    },
    performanceSummary: summary
  }
}

// Cleanup old metrics (keep only last hour)
if (typeof window === 'undefined') {
  setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    monitor['metrics'] = monitor.getMetrics().filter(m => m.timestamp > oneHourAgo)
  }, 10 * 60 * 1000) // Cleanup every 10 minutes
}