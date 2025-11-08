import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='bg-background flex min-h-screen flex-col items-center justify-center p-4'>
      <div className='max-w-md space-y-8 text-center'>
        <div className='space-y-4'>
          <div className='text-primary py-8 text-9xl font-bold'>404</div>
          <h2 className='text-foreground text-3xl font-semibold'>Oops! Page Not Found</h2>
          <p className='text-muted-foreground'>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href='/'
          prefetch={false}
          replace={true}
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
