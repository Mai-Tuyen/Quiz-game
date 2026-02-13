'use client'
import { Button } from '@/global/components/ui/button'
import { createClient } from '@/global/lib/supabase/client'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

export function LoginPage() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const t = useTranslations()

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
    <div className='mx-auto flex h-screen w-full items-center justify-center p-4 shadow-2xl sm:p-6'>
      <div className='w-full max-w-md rounded-lg border border-slate-200 bg-gray-50 p-5 shadow-2xl sm:p-6 md:p-8'>
        <div className='space-y-2 text-center sm:space-y-3'>
          <div className='flex flex-col items-center justify-center gap-2 bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>
            <Image src='/images/logo.png' alt='Logo' width={30} height={30} className='sm:h-10 sm:w-10' />
            {t('Auth.welcomeToZoloQuiz')}
          </div>
        </div>

        <div className='flex flex-col gap-3 py-4 sm:gap-4 sm:py-5'>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className='h-11 w-full cursor-pointer border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg sm:h-12 sm:text-base'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 sm:h-5 sm:w-5' />
                <span>{t('Auth.signingIn')}</span>
              </div>
            ) : (
              <div className='flex items-center gap-2 sm:gap-3'>
                <FcGoogle className='h-4 w-4 sm:h-5 sm:w-5' />
                <span>{t('Auth.continueWithGoogle')}</span>
              </div>
            )}
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white/80 px-2 text-slate-500'>{t('Auth.secureAuthentication')}</span>
            </div>
          </div>

          <p className='px-3 text-center text-[10px] text-slate-500 sm:px-4 sm:text-xs'>
            {t('Auth.termsAndPrivacy')}
          </p>
        </div>
      </div>
    </div>
  )
}
