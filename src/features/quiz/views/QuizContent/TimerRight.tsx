'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface TimerProps {
  timeRemaining: number // in seconds
  totalTime: number // in seconds
  onTimeUp: () => void
}

export default function Timer({ timeRemaining, totalTime, onTimeUp }: TimerProps) {
  const [currentTime, setCurrentTime] = useState(timeRemaining)
  const t = useTranslations()
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

  const getProgressColor = () => {
    if (isCriticalTime) return 'bg-red-500'
    if (isLowTime) return 'bg-amber-500'
    return 'bg-green-500'
  }

  const getBackgroundColor = () => {
    if (isCriticalTime) return 'bg-red-50 border-red-200'
    if (isLowTime) return 'bg-amber-50 border-amber-200'
    return 'bg-green-50 border-green-200'
  }

  return (
    <motion.div
      className={`rounded-lg border p-4 ${getBackgroundColor()}`}
      animate={{
        scale: isCriticalTime ? [1, 1.02, 1] : 1
      }}
      transition={{
        duration: 1,
        repeat: isCriticalTime ? Infinity : 0,
        ease: 'easeInOut'
      }}
    >
      <div className='text-center'>
        {/* Timer Icon */}
        <motion.div
          className={`mx-auto mb-3 ${getTimerColor()}`}
          animate={{
            rotate: isCriticalTime ? [0, 5, -5, 0] : 0
          }}
          transition={{
            duration: 0.5,
            repeat: isCriticalTime ? Infinity : 0,
            ease: 'easeInOut'
          }}
        >
          <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </motion.div>

        {/* Circular Progress */}
        <div className='relative mx-auto mb-4 h-20 w-20'>
          <svg className='h-20 w-20 -rotate-90 transform' viewBox='0 0 36 36'>
            {/* Background circle */}
            <path
              className='text-gray-200'
              d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            />
            {/* Progress circle */}
            <motion.path
              className={getProgressColor().replace('bg-', 'text-')}
              d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeDasharray='100'
              initial={{ strokeDashoffset: 0 }}
              animate={{
                strokeDashoffset: 100 - progressPercentage
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </svg>
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className={`text-sm font-semibold ${getTimerColor()}`}>
              {' '}
              <motion.div
                className={`text-xl font-bold ${getTimerColor()}`}
                animate={{
                  scale: isCriticalTime ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 1,
                  repeat: isCriticalTime ? Infinity : 0,
                  ease: 'easeInOut'
                }}
              >
                {formatTime(currentTime)}
              </motion.div>
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className='mb-2 h-2 w-full rounded-full bg-gray-200'>
          <motion.div
            className={`h-2 rounded-full ${getProgressColor()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        {/* Total Time Info */}
        <div className='mt-2 text-xs text-gray-500'>
          {t('Common.totalTime')}: {formatTime(totalTime)}
        </div>
      </div>
    </motion.div>
  )
}
