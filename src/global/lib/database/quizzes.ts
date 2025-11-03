import { createClient } from '@/global/lib/supabase/client'

export interface Quiz {
  id: string
  title: string
  slug: string
  description: string
  category_id: string
  time_limit: number
  difficulty_level: number
  is_published: boolean
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    slug: string
    description: string
    icon_url: string
  }
  question_count?: number
  image_url?: string
}

export async function getQuizzesByCategory(categorySlug: string): Promise<Quiz[]> {
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
    console.error('Error fetching quizzes by category:', error)
    throw new Error(`Failed to fetch quizzes: ${error.message}`)
  }

  // Transform the data to include question count
  return (data || []).map((quiz) => ({
    ...quiz,
    question_count: quiz.questions?.[0]?.count || 0
  }))
}

export async function getAllQuizzes(): Promise<Quiz[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      *,
      category:categories(*),
      questions(count)
    `
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all quizzes:', error)
    throw new Error(`Failed to fetch quizzes: ${error.message}`)
  }

  // Transform the data to include question count
  return (data || []).map((quiz) => ({
    ...quiz,
    question_count: quiz.questions?.[0]?.count || 0
  }))
}

export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      *,
      category:categories(*),
      questions(count)
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null
    }
    console.error('Error fetching quiz:', error)
    throw new Error(`Failed to fetch quiz: ${error.message}`)
  }

  return {
    ...data,
    question_count: data.questions?.[0]?.count || 0
  }
}

export async function getQuizWithQuestions(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      *,
      category:categories(*),
      questions(*)
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching quiz with questions:', error)
    throw new Error(`Failed to fetch quiz: ${error.message}`)
  }

  // Sort questions by order
  const sortedQuestions = (data.questions || []).sort((a: any, b: any) => a.question_order - b.question_order)

  return {
    ...data,
    questions: sortedQuestions,
    question_count: sortedQuestions.length
  }
}
