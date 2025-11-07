import { QuizStartInfo } from '@/features/quiz'
import { Params } from '@/global/type'

export default async function QuizInfoPage({ params }: { params: Params }) {
  const { slug } = await params
  return <QuizStartInfo slug={slug} />
}
