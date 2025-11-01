import { QuizesOfCategory } from '@/features/category'
import { Params } from '@/global/type'

export default async function CategoryPage({ params }: { params: Params }) {
  const { category_slug } = await params
  return <QuizesOfCategory categorySlug={category_slug} />
}
