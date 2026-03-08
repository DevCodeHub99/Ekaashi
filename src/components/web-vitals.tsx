'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric)
    }

    // Send to your analytics service
    // Example: sendToAnalytics(metric)
  })

  return null
}

// Helper to send metrics to your analytics
export function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric)
  const url = '/api/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}
