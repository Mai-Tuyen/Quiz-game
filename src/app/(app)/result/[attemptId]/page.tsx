import { QuizResultPage } from '@/features/result'
import { Params } from '@/global/type'

export default async function ResultPage({ params }: { params: Params }) {
  const { attemptId } = await params
  return <QuizResultPage attemptId={attemptId} />
}
