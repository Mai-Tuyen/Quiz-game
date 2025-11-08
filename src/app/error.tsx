'use client'
import Link from 'next/link'
import React from 'react'

export default function Error() {
  return (
    <div className='bg-background flex min-h-screen flex-col items-center justify-center p-4'>
      <div className='max-w-md space-y-8 text-center'>
        <div className='space-y-4'>
          <div className='bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='text-destructive h-10 w-10'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='text-foreground text-3xl font-semibold'>Something Went Wrong</h2>
          <p className='text-muted-foreground'>
            We encountered an unexpected error. Please try again or return to the home page.
          </p>
        </div>
        <Link
          href='/'
          className='border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-lg border px-6 py-3 text-base font-medium shadow-sm transition-all duration-300'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mr-2 h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
