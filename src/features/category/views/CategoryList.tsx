import { getCategoriesAPI } from '@/features/category/api'
import CategoriesGridAnimated from '@/features/category/views/components/CategoriesGridAnimated'
import FullPageClient from '@/global/components/common/FullPageClient'
import TypeQuote from '@/global/components/common/TypeQuote'

// Client wrapper component for mobile detection
function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop: Use FullPageClient */}
      <div className='hidden lg:block'>
        <FullPageClient>{children}</FullPageClient>
      </div>
      {/* Mobile: Regular scrolling without FullPageClient */}
      <div className='lg:hidden'>{children}</div>
    </>
  )
}

export default async function CategoryList() {
  const categories = await getCategoriesAPI()

  const content = (
    <>
      {/* Hero Section with Fixed Background - Full Screen - Mobile First */}
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

        {/* Hero Content - Mobile First Responsive */}
        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6'>
          <h1 className='mb-6 text-3xl font-bold text-balance text-white sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl'>
            Knowledge is freedom
          </h1>
          <div className='flex min-h-[60px] items-center justify-center text-lg font-light text-white/90 sm:min-h-[80px] sm:text-xl md:text-2xl lg:text-3xl'>
            <TypeQuote quotes={['The only true wisdom is in knowing you know nothing.']} />
          </div>
        </div>
        {/* Scroll Indicator - Hidden on small mobile */}
        <div className='absolute bottom-12 left-1/2 hidden -translate-x-1/2 transform animate-bounce sm:bottom-20 sm:flex lg:flex'>
          <div className='flex flex-col items-center text-white/80'>
            <span className='mb-2 text-xs font-medium sm:text-sm'>Scroll to explore</span>
            <svg className='h-5 w-5 sm:h-6 sm:w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content - Mobile First Responsive */}
      <main id='content' className='flex w-full items-center justify-center px-4 py-8 sm:px-6 md:h-screen lg:px-8'>
        <div className='mx-auto w-full max-w-7xl'>
          {/* Categories Grid - animation starts when main content is in view */}
          <CategoriesGridAnimated categories={categories} />
        </div>
      </main>

      {/* Call to Action - Mobile First Responsive */}
      <div className='flex h-full w-full items-center justify-center px-4 py-6 sm:py-8'>
        <div className='flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sm:rounded-2xl sm:p-8 lg:p-10'>
          <h2 className='mb-3 text-center text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl'>
            Ready to Test Your Knowledge?
          </h2>
          <p className='mx-auto mb-4 max-w-2xl text-center text-sm text-blue-100 sm:mb-6 sm:text-base'>
            Pick a category above and start your quiz journey
          </p>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
            <span className='rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm'>
              History
            </span>
            <span className='rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm'>
              Geography
            </span>
            <span className='rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm'>
              Science
            </span>
            <span className='rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm'>
              Math
            </span>
            <span className='rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm'>
              Programming
            </span>
            <span className='rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm'>
              And More!
            </span>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <ResponsiveWrapper>{content}</ResponsiveWrapper>
    </div>
  )
}
