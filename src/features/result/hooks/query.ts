import { getAttemptWithResultsAPI } from '@/features/result/api'
import { useQuery } from '@tanstack/react-query'

export const useGetAttemptWithResultsQuery = (attemptId: string) => {
  return useQuery({
    queryKey: ['attempt-with-results', attemptId],
    queryFn: () => getAttemptWithResultsAPI(attemptId)
  })
}
