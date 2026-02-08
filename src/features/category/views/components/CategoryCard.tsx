import Link from 'next/link'
import { Category } from '@/features/category/type'

interface CategoryCardProps {
  category: Category
  quizCount?: number
}

export default function CategoryCard({ category, quizCount }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className='group block'>
      <div className='box-shadow-3d rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-xl sm:p-5 md:p-6 dark:border-gray-700 dark:bg-gray-800'>
        {/* Icon - Mobile First Responsive */}
        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-3xl transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16 md:text-4xl dark:from-blue-900/20 dark:to-indigo-900/20'>
          {category.icon_url}
        </div>

        {/* Title - Mobile First Responsive */}
        <h3 className='mb-2 text-center text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-xl dark:text-white dark:group-hover:text-blue-400'>
          {category.name}
        </h3>

        {/* Description - Mobile First Responsive */}
        <p className='mb-3 line-clamp-2 min-h-[45px] text-center text-xs leading-relaxed text-gray-600 sm:mb-4 sm:text-sm dark:text-gray-300'>
          {category.description}
        </p>
      </div>
    </Link>
  )
}
