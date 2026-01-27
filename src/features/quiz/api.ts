import { Quiz, QuizStartInfo } from '@/features/quiz/type'
import { QuizAttempt } from '@/global/lib/database/attempts'
import { createClient } from '@/global/lib/supabase/client'
import dayjs from 'dayjs'

export async function getQuizzesByCategoryAPI(categorySlug: string): Promise<Quiz[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      *,
      category:categories!inner(*),
      questions(count)
    `
    )
    .eq('category.slug', categorySlug)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  // Transform the data to include question count
  return (data || []).map((quiz) => ({
    ...quiz,
    question_count: quiz.questions?.[0]?.count || 0
  }))
}

export async function getQuizWithQuestionsAPI(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      *,
      category:categories(*),
      questions: questions(id, quiz_id, question_text, question_type, question_order, question_data)
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }

  // Sort questions by order
  const sortedQuestions = (data.questions || []).sort((a: any, b: any) => a.question_order - b.question_order)

  return {
    ...data,
    questions: sortedQuestions,
    question_count: sortedQuestions.length
  }
}

export async function getQuizStartInfoAPI(slug: string): Promise<QuizStartInfo> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      *,
      category:categories(*),
      question_count: questions(count)
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    throw error
  }

  // Transform the data to include question count
  return {
    ...data,
    question_count: data.question_count?.[0]?.count || 0
  }
}

export async function getCurrentQuizAttemptAPI(quizId: string): Promise<Partial<QuizAttempt>> {
  const supabase = createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`id, start_time, is_completed`)
    .eq('quiz_id', quizId)
    .eq('user_id', session?.user?.id)
    .eq('is_completed', false)
    .limit(1)
  // .single()

  if (error) {
    throw error
  }

  return data?.[0] || null
}

export async function createQuizAttemptAPI(quizId: string, userId: string): Promise<string> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      start_time: dayjs().toISOString(),
      is_completed: false
    })
    .select('id')
    .single()

  if (error) {
    throw error
  }
  return data.id
}

export async function getAllAnswerOfQuizAttemptAPI(attemptId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from('user_answers').select('*').eq('attempt_id', attemptId)
  if (error) {
    throw error
  }
  return data
}

export async function upsertUserAnswerAPI(id: string, attemptId: string, questionId: string, selectedOptions: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_answers')
    .upsert({
      id: id,
      attempt_id: attemptId,
      question_id: questionId,
      selected_options: selectedOptions
    })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

export async function submitQuizAttemptAPI(attemptId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('submit_quiz_attempt_transaction', {
    p_attempt_id: attemptId
  })

  if (error) {
    throw error
  }

  if (!data?.success) {
    throw new Error('Failed to submit quiz attempt')
  }

  return {
    attempt: data.attempt,
    results: data.results,
    deletedAnswersCount: data.deleted_answers_count
  }
}