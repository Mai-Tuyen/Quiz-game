'use client'

import { motion } from 'framer-motion'

export default function FireworksAnimation() {
  return (
    <div className='pointer-events-none fixed inset-0 z-50 overflow-hidden'>
      {/* Animated background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'
      />
      {/* Animated sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute h-2 w-2 rounded-full bg-yellow-400'
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            scale: 0,
            rotate: 0
          }}
          animate={{
            y: -10,
            scale: [0, 1, 0],
            rotate: 360,
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: 'easeOut'
          }}
        />
      ))}
      {/* Floating celebration emojis */}
      {['🎉', '🎊', '⭐', '🌟', '✨', '💫', '🏆', '👏'].map((emoji, i) => (
        <motion.div
          key={emoji + i}
          className='absolute text-4xl'
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0,
            scale: 0
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0, 1.5, 1, 0],
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 3,
            ease: 'easeOut'
          }}
        >
          {emoji}
        </motion.div>
      ))}
      {/* Radial burst effect */}
      <motion.div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 8, 12],
          opacity: [1, 0.3, 0]
        }}
        transition={{
          duration: 2,
          ease: 'easeOut'
        }}
      >
        <div className='h-32 w-32 rounded-full border-4 border-yellow-400' />
      </motion.div>
      {/* Secondary burst */}
      <motion.div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 6, 10],
          opacity: [1, 0.5, 0]
        }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: 'easeOut'
        }}
      >
        <div className='h-24 w-24 rounded-full border-2 border-white' />
      </motion.div>
    </div>
  )
}
