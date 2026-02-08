import { LoginPage as LoginPageComponent } from '@/features/auth'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageComponent />
    </Suspense>
  )
}
