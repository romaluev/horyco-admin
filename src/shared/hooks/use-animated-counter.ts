'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterOptions {
  duration?: number
  enabled?: boolean
  easing?: (t: number) => number
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useAnimatedCounter(
  targetValue: number,
  options: AnimatedCounterOptions = {}
) {
  const { duration = 500, enabled = true, easing = easeOutCubic } = options

  const [displayValue, setDisplayValue] = useState(enabled ? 0 : targetValue)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousValue = useRef(targetValue)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(targetValue)
      return
    }

    const startValue = previousValue.current
    const diff = targetValue - startValue

    if (diff === 0) return

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setIsAnimating(true)
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      const current = startValue + diff * easedProgress
      setDisplayValue(Math.round(current))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        previousValue.current = targetValue
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      previousValue.current = targetValue
    }
  }, [targetValue, duration, enabled, easing])

  return { displayValue, isAnimating }
}
