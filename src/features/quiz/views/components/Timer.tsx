'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/global/lib/utils'

interface TimerProps {
  timeRemaining: number // in seconds
  totalTime: number // in seconds
  onTimeUp: () => void
}

export default function Timer({ timeRemaining, totalTime, onTimeUp }: TimerProps) {
  const [currentTime, setCurrentTime] = useState(timeRemaining)

  useEffect(() => {
    setCurrentTime(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (currentTime <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTime, onTimeUp])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (currentTime / totalTime) * 100
  const isLowTime = progressPercentage <= 10 // Last 10% of time
  const isCriticalTime = progressPercentage <= 5 // Last 5% of time

  const getTimerColor = () => {
    if (isCriticalTime) return 'text-red-600'
    if (isLowTime) return 'text-amber-600'
    return 'text-green-600'
  }
  const getBackgroundColor = () => {
    if (isCriticalTime) return 'bg-red-50 border-red-200'
    if (isLowTime) return 'bg-amber-50 border-amber-200'
    return 'bg-green-50 border-green-200'
  }

  return (
    <span className={cn('flex items-center gap-2 rounded-md px-2 py-1 text-sm', getBackgroundColor(), getTimerColor())}>
      <div className={cn('rounded-lg p-2', getBackgroundColor(), getTimerColor())}>
        <svg className='size-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </div>
      <span className='text-sm font-bold text-gray-600'>{formatTime(currentTime)}</span>
    </span>
  )
}
