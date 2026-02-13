'use client'
import { motion } from 'framer-motion'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function BackToHome() {
  const t = useTranslations()
  return (
    <div>
      <motion.div
        className='mt-16 text-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.a
          href='/'
          className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50'
          whileHover={{
            scale: 1.05,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            whileHover={{ x: -2 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </motion.svg>
          {t('Common.backToHome')}
        </motion.a>
      </motion.div>
    </div>
  )
}
