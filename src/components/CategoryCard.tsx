import Link from 'next/link'
import { Category } from '@/lib/database/categories'

interface CategoryCardProps {
  category: Category
  quizCount?: number
}

export default function CategoryCard({ category, quizCount }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className='group block'>
      <div className='box-shadow-3d rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'>
        {/* Icon */}
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-4xl transition-transform duration-300 group-hover:scale-110 dark:from-blue-900/20 dark:to-indigo-900/20'>
          {category.icon_url}
        </div>

        {/* Title */}
        <h3 className='mb-2 text-center text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
          {category.name}
        </h3>

        {/* Description */}
        <p className='mb-4 line-clamp-2 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
          {category.description}
        </p>
      </div>
    </Link>
  )
}
