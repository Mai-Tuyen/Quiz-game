import { getQuizStartInfoAPI, getQuizWithQuestionsAPI } from '@/features/quiz/api'
import { useQuery } from '@tanstack/react-query'

export const useGetQuizWithQuestionsQuery = (slug: string) => {
  return useQuery({
    queryKey: ['quiz-questions', slug],
    queryFn: () => getQuizWithQuestionsAPI(slug)
  })
}

export const useGetQuizStartInfoQuery = (slug: string) => {
  return useQuery({
    queryKey: ['quiz-start-info', slug],
    queryFn: () => getQuizStartInfoAPI(slug)
  })
}
