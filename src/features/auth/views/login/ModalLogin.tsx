'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/global/components/ui/dialog'
import { Button } from '@/global/components/ui/button'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { createClient } from '@/global/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export function LoginModal() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next')
  const [open, setOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}`,
          scopes: 'https://www.googleapis.com/auth/userinfo.email'
        }
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    router.back()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='border border-white/20 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:max-w-md sm:p-6'>
        <DialogHeader className='space-y-2 text-center sm:space-y-3'>
          <DialogTitle className='flex flex-col items-center justify-center gap-2 bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>
            <Image src='/images/logo.png' alt='Logo' width={30} height={30} className='sm:h-10 sm:w-10' />
            Welcome to Zolo Quiz
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-3 py-3 sm:gap-4 sm:py-4'>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className='h-11 w-full cursor-pointer border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg sm:h-12 sm:text-base'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 sm:h-5 sm:w-5' />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2 sm:gap-3'>
                <FcGoogle className='h-4 w-4 sm:h-5 sm:w-5' />
                <span>Continue with Google</span>
              </div>
            )}
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white/80 px-2 text-slate-500'>Secure Authentication</span>
            </div>
          </div>

          <p className='px-3 text-center text-[10px] text-slate-500 sm:px-4 sm:text-xs'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
