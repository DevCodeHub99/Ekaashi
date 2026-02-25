'use client'

import { RefreshCw } from 'lucide-react'
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  enabled?: boolean
}

export default function PullToRefresh({ onRefresh, children, enabled = true }: PullToRefreshProps) {
  const { isPulling, pullDistance, isRefreshing, shouldTriggerRefresh } = usePullToRefresh({
    onRefresh,
    threshold: 80,
    enabled
  })

  const opacity = Math.min(pullDistance / 80, 1)
  const rotation = (pullDistance / 80) * 360

  return (
    <div className="relative">
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-transform duration-200"
        style={{
          transform: `translateY(${Math.min(pullDistance - 40, 60)}px)`,
          opacity: opacity
        }}
      >
        <div className="bg-white rounded-full shadow-lg p-3 border border-gray-200">
          <RefreshCw
            className={`h-6 w-6 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.1s'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: isPulling || isRefreshing ? `translateY(${Math.min(pullDistance * 0.3, 40)}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}
