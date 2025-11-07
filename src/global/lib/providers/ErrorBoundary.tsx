'use client'
import ErrorFallback from '@/global/components/error/ErrorFallback'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

export default function ErrorBoundaryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={ErrorFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
