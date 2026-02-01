import { AttemptWithDetails } from '@/features/result/type'
import { createClient } from '@/global/lib/supabase/client'

export async function getAttemptWithResultsAPI(attemptId: string): Promise<AttemptWithDetails | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(
      `
      *,
      quiz:quizzes(
        *,
        category:categories(*),
        questions(*)
      ),
      user_answers(
        *,
        question:questions(*)
      )
    `
    )
    .eq('id', attemptId)
    .eq('is_completed', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching attempt results:', error)
    throw new Error(`Failed to fetch results: ${error.message}`)
  }

  // Sort questions and answers by order
  data.quiz.questions.sort((a: any, b: any) => a.question_order - b.question_order)
  data.user_answers.sort((a: any, b: any) => a.question.question_order - b.question.question_order)

  return data
}
