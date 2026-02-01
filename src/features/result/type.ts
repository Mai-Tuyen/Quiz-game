import { QuizAttempt } from '@/features/quiz/type'

export interface AttemptWithDetails extends QuizAttempt {
  quiz: {
    id: string
    title: string
    slug: string
    description: string
    time_limit: number
    difficulty_level: number
    category: {
      id: string
      name: string
      slug: string
      icon_url: string
    }
  }
  user_answers: (UserAnswer & {
    question: {
      id: string
      question_text: string
      question_type: string
      question_order: number
      points: number
      explanation: string
      question_data: any
    }
  })[]
}

type UserAnswer = {
  id: string
  attempt_id: string
  question_id: string
  selected_options: any
  is_correct: boolean
  answered_at: string
}
