import { QuizStartInfo } from '@/features/quiz'
import { useGetQuizInfoQuery } from '@/features/quiz/hooks/query'

export default function QuizInfoPage({ params }: { params: { slug: string } }) {
  return <QuizStartInfo slug={params.slug} />
}
