import { QuizCardSkeleton } from '@/features/quiz'
import { Suspense } from 'react'

export default function Loading() {
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header Skeleton */}
        <div className='mb-12 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='h-16 w-16 animate-pulse rounded-full bg-gray-200' />
          </div>
          <div className='mb-4 flex justify-center'>
            <div className='h-10 w-64 animate-pulse rounded-lg bg-gray-200' />
          </div>
          <div className='flex justify-center'>
            <div className='h-6 w-96 animate-pulse rounded bg-gray-200' />
          </div>
        </div>

        {/* Quizzes Grid Skeleton */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <QuizCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
