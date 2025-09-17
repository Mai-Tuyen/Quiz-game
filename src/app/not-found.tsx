import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-blue-900 via-purple-900 to-pink-700 p-4 text-white'>
      <div className='max-w-md space-y-6 text-center'>
        <div className='animate-gradient-y bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text py-8 text-9xl font-bold text-transparent'>
          404
        </div>
        <h2 className='text-3xl font-semibold'>Oops! Page Not Found</h2>
        <div className='space-y-3'>
          <Link
            href='/'
            prefetch={false}
            replace={true}
            className='mt-4 inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/20'
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
    </div>
  )
}
