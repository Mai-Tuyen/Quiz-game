'use client'
import { Mutation, MutationCache, QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'

type Register = {
  mutationMeta: {
    errorMessage?: string
    successMessage?: string
    invalidateQueries?: QueryKey
  }
}

const handleThrowOnError = (error: any) => {
  if (error.code === 'PGRST116') {
    redirect('/not-found')
  }
  return true
}

// Default
// staleTime: 0
// gc: 5 phút (5 * 1000* 60)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      throwOnError: (error) => handleThrowOnError(error),
      retry: false
    }
  },
  mutationCache: new MutationCache({
    onSuccess: (data: any, variables: any, context: any, mutation: any) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation?.meta?.successMessage as string)
      }
      if (mutation.meta?.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: mutation.meta.invalidateQueries })
      }
    },
    onError: (error: any, variables: any, context: any, mutation: any) => {
      if (error?.status === 401) {
        redirect('/login')
      }
      toast.error(error?.message || (mutation?.meta?.errorMessage as string))
    }
  })
})

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
