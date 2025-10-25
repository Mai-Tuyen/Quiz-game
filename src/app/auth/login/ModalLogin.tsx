'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { createClient } from '@/utils/supabase/client'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  nextUrl?: string
}

export function LoginModal({ open, onOpenChange, title, nextUrl = '/' }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl sm:max-w-md'>
        <DialogHeader className='space-y-3 text-center'>
          <DialogTitle className='flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent'>
            <Image src='/images/logo.png' alt='Logo' width={30} height={30} />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-4'>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className='h-12 w-full cursor-pointer border border-slate-200 bg-white font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600' />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <FcGoogle className='h-5 w-5' />
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

          <p className='px-4 text-center text-xs text-slate-500'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
