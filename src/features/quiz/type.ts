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
