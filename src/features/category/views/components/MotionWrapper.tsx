'use client'
import { motion } from 'framer-motion'
import React from 'react'
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

export default function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='container mx-auto px-4 py-8'>
      {children}
    </motion.div>
  )
}
