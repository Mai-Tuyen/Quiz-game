import { getCategoryBySlugAPI } from '@/features/category'
import MotionWrapper from '@/features/category/views/components/MotionWrapper'
import { getQuizzesByCategoryAPI, QuizCard } from '@/features/quiz'
import BackToHome from '@/global/components/BackToHome'
import SEO from '@/global/components/common/SEO'

export default async function CategoryQuizzesPage({ categorySlug }: { categorySlug: string }) {
  const [category, quizzes] = await Promise.all([
    getCategoryBySlugAPI(categorySlug),
    getQuizzesByCategoryAPI(categorySlug)
  ])

  const seoData = {
    title: `${category?.name} | ZoloQuiz`,
    description: category?.description || '',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/categories/${categorySlug}`,
    thumbnailUrl: category?.icon_url || ''
  }

  return (
    <>
      <SEO data={seoData} />
      <div className='min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30'>
        <MotionWrapper>
          <div className='mb-12 text-center'>
            <>
              <div className='mb-4 text-6xl transition-all duration-200 hover:scale-110 hover:rotate-5'>
                {category?.icon_url}
              </div>
              <h1 className='mb-4 text-4xl font-bold text-gray-900 transition-all duration-200 hover:scale-102'>
                {category?.name} Quizzes
              </h1>
              <p className='mx-auto max-w-2xl text-lg text-gray-600'>{category?.description}</p>
            </>
          </div>
          {/* Quizzes Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {quizzes?.map((quiz, index) => (
              <QuizCard key={quiz.id} quiz={quiz} index={index} />
            ))}
          </div>

          <BackToHome />
        </MotionWrapper>
      </div>
    </>
  )
}
