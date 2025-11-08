import {
  createQuizAttemptAPI,
  getCurrentQuizAttemptAPI,
  getQuizStartInfoAPI,
  getQuizWithQuestionsAPI
} from '@/features/quiz/api'
import { useMutation, useQuery } from '@tanstack/react-query'

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

export const useGetCurrentQuizAttemptQuery = (quizId: string) => {
  return useQuery({
    queryKey: ['current-quiz-attempt', quizId],
    queryFn: () => getCurrentQuizAttemptAPI(quizId)
  })
}

export const useCreateQuizAttemptMutation = () => {
  return useMutation({
    mutationFn: ({ quizId, userId }: { quizId: string; userId: string }) => createQuizAttemptAPI(quizId, userId)
  })
}
