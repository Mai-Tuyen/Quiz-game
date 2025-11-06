'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { storage } from '@/global/lib/storage'
import { LoginModal } from '@/features/auth/views/login/ModalLogin'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/global/components/ui/dropdown-menu'
import { cn } from '@/global/lib/utils'
import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const [isAtTop, setIsAtTop] = useState(true)
  const pathname = usePathname()

  useLayoutEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      storage.set('user', session?.user ?? null)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      // check animation header just on home page
      setIsAtTop(window.scrollY <= 0 && pathname === '/')
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className='sticky top-0 z-10 border-b border-gray-200 bg-white shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80'>
      <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between'>
          <div className='relative w-full'>
            <Link
              href='/'
              className={cn(
                'flex items-center space-x-2',
                isAtTop
                  ? 'absolute bottom-[-80px] w-[260px] rounded-full bg-white/95 p-2 backdrop-blur-lg duration-300 hover:scale-105'
                  : ''
              )}
            >
              {isAtTop ? (
                <Image src='/images/logo.png' alt='Logo' width={100} height={100} />
              ) : (
                <Image src='/images/logo.png' alt='Logo' width={30} height={30} />
              )}
              <div className='flex flex-col'>
                <span className='text-primary text-xl font-bold dark:text-white'>ZoloQuiz</span>
                {isAtTop && <span className='text-primary text-xs font-bold dark:text-white'>Know more daily</span>}
              </div>
            </Link>
          </div>
          <nav className='hidden shrink-0 items-center space-x-6 md:flex'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer'>
                  <div className='flex items-center space-x-2 rounded-full border border-gray-200 p-1 px-2'>
                    <Image
                      src={user.user_metadata?.avatar_url}
                      alt='User Avatar'
                      width={32}
                      height={32}
                      className='border-gradient-to-r rounded-full border-2 from-blue-600 to-purple-600'
                    />
                    <span className='shrink-0 text-sm text-gray-600 dark:text-gray-300'>
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
                    <span className='text-sm font-medium text-gray-600 transition-colors hover:text-red-600'>
                      Sign Out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href='/auth/login'
                className='text-primary rounded-md border-1 border-gray-500 px-4 py-1 font-bold shadow-md transition-all duration-300 hover:scale-105'
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
