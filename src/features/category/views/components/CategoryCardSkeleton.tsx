export default function CategoryCardSkeleton() {
  return (
    <div className='animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
      {/* Icon skeleton */}
      <div className='mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700'></div>

      {/* Title skeleton */}
      <div className='mx-auto mb-2 h-6 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700'></div>

      {/* Description skeleton */}
      <div className='mb-4 space-y-2'>
        <div className='h-4 w-full rounded bg-gray-200 dark:bg-gray-700'></div>
        <div className='mx-auto h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700'></div>
        <div className='mx-auto h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700'></div>
      </div>

      {/* Quiz count skeleton */}
      <div className='flex justify-center'>
        <div className='h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700'></div>
      </div>
    </div>
  )
}
