'use client'

import { Category } from '@/features/category/type'
import CategoryCard from '@/features/category/views/components/CategoryCard'
import { useFullPage } from '@/global/components/common/FullPageClient'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.12
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    filter: 'blur(12px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 90,
      damping: 14,
      mass: 0.75
    }
  }
}

const glowVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
}

interface CategoriesGridAnimatedProps {
  categories: Category[]
  /** Section index in full-page scroll (categories = 1). Used when inside FullPageClient. */
  sectionIndex?: number
}

export default function CategoriesGridAnimated({ categories, sectionIndex = 1 }: CategoriesGridAnimatedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fullPage = useFullPage()
  const inViewFallback = useInView(ref, { once: true, amount: 0.2 })
  // When inside FullPageClient: animate when this section is the active page. Otherwise use viewport inView.
  const isInView = fullPage ? fullPage.currentPage === sectionIndex : inViewFallback

  if (categories.length === 0) return null

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={glowVariants}
      className='relative'
    >
      {/* Subtle radial glow behind grid when in view */}
      <motion.div
        className='pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-br from-blue-400/10 via-transparent to-indigo-400/10 opacity-0 blur-2xl'
        initial={false}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      <motion.div
        variants={containerVariants}
        className='relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <CategoryCard category={category} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
