// Fetch with automatic retry and exponential backoff

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  onRetry?: (attempt: number, error: Error) => void
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  onRetry: () => {}
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
  const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1)
  return Math.min(delay, options.maxDelay)
}

export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const opts = { ...defaultOptions, ...options }
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
    try {
      const response = await fetch(url, init)
      
      // If response is ok, return it
      if (response.ok) {
        return response
      }
      
      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        return response
      }
      
      // Server error (5xx) - retry
      throw new Error(`Server error: ${response.status}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // If this was the last attempt, throw the error
      if (attempt > opts.maxRetries) {
        throw lastError
      }
      
      // Calculate delay and notify
      const delay = calculateDelay(attempt, opts)
      opts.onRetry(attempt, lastError)
      
      // Wait before retrying
      await sleep(delay)
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Max retries exceeded')
}

// Convenience wrapper for JSON responses
export async function fetchJsonWithRetry<T = any>(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, init, options)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}
