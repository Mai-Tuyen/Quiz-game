import { createClient } from '@/utils/supabase/server'
import CategoryCard from '@/components/CategoryCard'
import Link from 'next/link'
import TypeQuote from '@/components/home/TypeQuote'
import FullPageClient from '@/components/common/FullPageClient'
import Footer from '@/app/Layout/Footer'

export const metadata = {
  title: 'Quiz Categories | Quiz Game',
  description: 'Explore our collection of quiz categories including Programming, Science, Geography, History, and more!'
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon_url: string
  created_at: string
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export default async function Home() {
  const categories = await getCategories()

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <FullPageClient>
        {/* Hero Section with Fixed Background - Full Screen */}
        <section id='hero' className='relative flex h-screen w-full items-center justify-center overflow-hidden'>
          {/* Fixed Background Image */}
          <div
            className='absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat'
            style={{
              backgroundImage: "url('/images/bg-quiz-image.jpg')"
            }}
          >
            {/* Overlay for better text readability */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70' />
          </div>

          {/* Hero Content */}
          <div className='relative z-10 mx-auto max-w-4xl px-4 text-center'>
            <h1 className='mb-8 text-5xl font-bold text-balance text-white md:text-6xl'>Knowledge is freedom</h1>
            <div className='flex min-h-[80px] items-center justify-center text-2xl font-light text-white/90 md:text-3xl'>
              <TypeQuote quotes={['The only true wisdom is in knowing you know nothing.']} />
            </div>
          </div>
          {/* Scroll Indicator */}
          <div className='absolute bottom-20 left-1/2 -translate-x-1/2 transform animate-bounce'>
            <div className='flex flex-col items-center text-white/80'>
              <span className='mb-2 text-sm font-medium'>Scroll to explore</span>
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main id='content' className='flex h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-7xl'>
            {/* Categories Grid */}
            {categories.length > 0 && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Call to Action */}
        <div className='flex h-full w-full items-center justify-center px-4 py-8'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white'>
            <h2 className='mb-4 text-2xl font-bold md:text-3xl'>Ready to Test Your Knowledge?</h2>
            <p className='mx-auto mb-6 max-w-2xl text-blue-100'>Pick a category above and start your quiz journey</p>
            <div className='flex flex-wrap justify-center gap-3'>
              <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>History</span>
              <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Geography</span>
              <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Science</span>
              <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Math</span>
              <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Programming</span>
              <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>And More!</span>
            </div>
          </div>
        </div>
      </FullPageClient>
    </div>
  )
}
