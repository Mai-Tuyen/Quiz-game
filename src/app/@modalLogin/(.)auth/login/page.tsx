import { LoginModal } from '@/features/auth'
import { Suspense } from 'react'

export default function LoginModalPage() {
  return (
    <Suspense fallback={null}>
      <LoginModal />
    </Suspense>
  )
}
