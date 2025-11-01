import { useQuery } from '@tanstack/react-query'
import { getCategoriesAPI } from '../api'

export const useGetCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAPI
  })
}
