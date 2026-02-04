// Generate a unique session ID for guest users
export function generateSessionId(): string {
  return 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// Get or create session ID from localStorage
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('ekaashi-session-id')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('ekaashi-session-id', sessionId)
  }
  return sessionId
}