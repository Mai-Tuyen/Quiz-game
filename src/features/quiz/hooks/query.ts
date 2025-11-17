import {
  createQuizAttemptAPI,
  getAllAnswerOfQuizAttemptAPI,
  getCurrentQuizAttemptAPI,
  getQuizStartInfoAPI,
  getQuizWithQuestionsAPI,
  upsertUserAnswerAPI
} from '@/features/quiz/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useGetCurrentQuizAttemptQuery = (quizId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['current-quiz-attempt', quizId],
    queryFn: () => getCurrentQuizAttemptAPI(quizId),
    enabled: enabled
  })
}

export const useCreateQuizAttemptMutation = () => {
  return useMutation({
    mutationFn: ({ quizId, userId }: { quizId: string; userId: string }) => createQuizAttemptAPI(quizId, userId)
  })
}

export const useGetAllAnswerOfQuizAttemptQuery = (attemptId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['all-answer-of-quiz-attempt', attemptId],
    queryFn: () => getAllAnswerOfQuizAttemptAPI(attemptId),
    enabled: enabled
  })
}

export const useUpsertUserAnswerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      attemptId,
      questionId,
      selectedOptions
    }: {
      id: string
      attemptId: string
      questionId: string
      selectedOptions: any
    }) => upsertUserAnswerAPI(id, attemptId, questionId, selectedOptions),
    onMutate: async (variables) => {
      // Snapshot the previous value for rollback
      const previousAnswers = queryClient.getQueryData(['all-answer-of-quiz-attempt', variables.attemptId]) as any[]
      const newData = previousAnswers?.map((item: any) =>
        item.id === variables.id ? { ...item, selected_options: variables.selectedOptions } : item
      )
      queryClient.setQueryData(['all-answer-of-quiz-attempt', variables.attemptId], newData)
      return { previousAnswers }
    },
    onError: (err, variables, context) => {
      // Rollback to previous data on error
      if (context?.previousAnswers) {
        queryClient.setQueryData(['all-answer-of-quiz-attempt', variables.attemptId], context.previousAnswers)
      }
    },
    onSuccess: (result, variables) => {
      // Update with the actual server response to ensure consistency
      const allAnswers = queryClient.getQueryData(['all-answer-of-quiz-attempt', variables.attemptId]) as any[]
      const newData = allAnswers?.map((item: any) => (item.id === variables.id ? result : item))
      queryClient.setQueryData(['all-answer-of-quiz-attempt', variables.attemptId], newData)
    }
  })
}
