import { motion } from 'framer-motion'
import React from 'react'

export default function QuizLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className='text-center'
      >
        <div className='mb-4 animate-bounce text-6xl'>📝</div>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>Loading Quiz...</h1>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
      </motion.div>
    </div>
  )
}
