import { Category } from '@/features/category'

export type Quiz = {
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
  questions: Question[]
}
export type Question = {
  id: string
  question_text: string
  question_type: 'single_choice' | 'multiple_choice' | 'sequence' | 'drag_word'
  question_order: number
  points: number
  explanation: string
  question_data: any
}

export type QuizStartInfo = {
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
  image_url: string
  category: Category
  question_count: number
}
export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  start_time: string
  end_time: string | null
  score: number
  max_score: number
  is_completed: boolean
  time_taken: number // in seconds
}
