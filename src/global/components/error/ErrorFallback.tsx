'use client'

import Link from 'next/link'
import { FallbackProps } from 'react-error-boundary'

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-blue-900 via-purple-900 to-pink-700 p-4 text-white'>
      <div className='max-w-md space-y-6 text-center'>
        <h2 className='text-3xl font-semibold'>Something Went Wrong</h2>
        {error && <p className='text-sm text-red-200'>{error.message || 'An unexpected error occurred'}</p>}
      </div>
      <div className='mt-6 flex gap-4'>
        <button
          onClick={resetErrorBoundary}
          className='inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/20'
        >
          Try Again
        </button>
        <Link
          href='/'
          className='inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/20'
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
