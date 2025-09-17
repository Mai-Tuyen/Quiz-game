import { createClient } from '@/utils/supabase/server'
import CategoryCard from '@/components/CategoryCard'
import Link from 'next/link'

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

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      {/* Main Content */}
      <main className='px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          {/* Hero Section */}
          <div className='mb-12 text-center'>
            <h1 className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white'>Quiz Categories</h1>
            <p className='mx-auto mb-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
              Choose from a variety of quiz categories to test your knowledge and learn something new!
            </p>

            {/* Stats */}
            {categories.length > 0 && (
              <div className='inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
                <span className='mr-3 text-2xl'>🎯</span>
                <span className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                  {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Available
                </span>
              </div>
            )}
          </div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className='py-16 text-center'>
              <div className='mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-12 shadow-xl dark:border-gray-700 dark:bg-gray-800'>
                <div className='mb-6 text-8xl'>📚</div>
                <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>No Categories Found</h3>
                <p className='mb-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                  It looks like there are no quiz categories available yet. Make sure your database is set up with
                  sample data.
                </p>

                {/* Setup Instructions */}
                <div className='mb-6 rounded-lg bg-blue-50 p-4 text-left dark:bg-blue-900/20'>
                  <h4 className='mb-2 font-semibold text-blue-900 dark:text-blue-300'>📝 Setup Instructions:</h4>
                  <ol className='space-y-1 text-sm text-blue-800 dark:text-blue-400'>
                    <li>1. Check your .env.local file</li>
                    <li>2. Run the database setup script</li>
                    <li>3. Verify sample data was created</li>
                  </ol>
                </div>

                <div className='flex justify-center gap-3'>
                  <button
                    onClick={() => window.location.reload()}
                    className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
                  >
                    Refresh Page
                  </button>
                  <Link
                    href='/'
                    className='rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700'
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {categories.length > 0 && (
            <div className='mt-16 text-center'>
              <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white'>
                <h2 className='mb-4 text-2xl font-bold md:text-3xl'>Ready to Test Your Knowledge?</h2>
                <p className='mx-auto mb-6 max-w-2xl text-blue-100'>
                  Pick a category above and start your quiz journey. Challenge yourself with questions designed to test
                  and expand your knowledge!
                </p>
                <div className='flex flex-wrap justify-center gap-3'>
                  <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Multiple Choice</span>
                  <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Drag & Drop</span>
                  <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>Sequence Questions</span>
                  <span className='rounded-full bg-white/20 px-4 py-2 text-sm font-medium'>And More!</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
