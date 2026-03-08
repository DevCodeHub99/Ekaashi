import { useEffect } from 'react'

/**
 * Hook to announce messages to screen readers
 */
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }

  return { announce }
}

/**
 * Hook to trap focus within a modal/dialog
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element when modal opens
    firstElement?.focus()

    container.addEventListener('keydown', handleTabKey as EventListener)
    
    return () => {
      container.removeEventListener('keydown', handleTabKey as EventListener)
    }
  }, [isActive, containerRef])
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return prefersReducedMotion
}

/**
 * Hook to manage keyboard navigation for lists
 */
export function useKeyboardNavigation(
  itemCount: number,
  onSelect: (index: number) => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return

    let currentIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          currentIndex = Math.min(currentIndex + 1, itemCount - 1)
          onSelect(currentIndex)
          break
        case 'ArrowUp':
          e.preventDefault()
          currentIndex = Math.max(currentIndex - 1, 0)
          onSelect(currentIndex)
          break
        case 'Home':
          e.preventDefault()
          currentIndex = 0
          onSelect(currentIndex)
          break
        case 'End':
          e.preventDefault()
          currentIndex = itemCount - 1
          onSelect(currentIndex)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [itemCount, onSelect, isActive])
}
