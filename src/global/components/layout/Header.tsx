'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/global/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/global/components/ui/sheet'
import { storage } from '@/global/lib/storage'
import { cn } from '@/global/lib/utils'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { Menu, X } from 'lucide-react'
export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const [isAtTop, setIsAtTop] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    storage.remove('user')
    router.push('/')
  }

  return (
    <header className='sticky top-0 z-50 border-b border-gray-200 bg-white shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80'>
      <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between'>
          {/* Logo - Mobile First */}
          <div className='relative shrink-0'>
            <Link
              href='/'
              className={cn(
                'flex items-center space-x-2',
                isAtTop && pathname === '/'
                  ? 'absolute bottom-[-80px] w-[240px] rounded-full bg-white/95 p-2 backdrop-blur-lg duration-300 hover:scale-105 sm:w-[260px]'
                  : ''
              )}
            >
              {isAtTop && pathname === '/' ? (
                <Image src='/images/logo.png' alt='Logo' width={80} height={80} className='sm:h-[100px] sm:w-[100px]' />
              ) : (
                <Image src='/images/logo.png' alt='Logo' width={30} height={30} />
              )}
              <div className='flex flex-col'>
                <span className='text-primary text-lg font-bold sm:text-xl dark:text-white'>ZoloQuiz</span>
                {isAtTop && pathname === '/' && (
                  <span className='text-primary text-xs font-bold dark:text-white'>Know more daily</span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden shrink-0 items-center space-x-6 md:flex'>
            {user ? (
              <DropdownMenu modal={false}>
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
                  <DropdownMenuItem onClick={() => router.push('/my-quizzes')} className='cursor-pointer'>
                    <span className='hover:text-primary text-sm font-medium text-gray-600 transition-colors'>
                      My quizzes
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
                    <span className='text-sm font-medium text-red-600 transition-colors hover:text-red-700'>
                      Sign Out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href='/auth/login'
                className='text-primary rounded-md border border-gray-500 px-4 py-1 font-bold shadow-md transition-all duration-300 hover:scale-105'
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className='md:hidden'>
              <button
                className='rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                aria-label='Open menu'
              >
                <Menu className='h-6 w-6' />
              </button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[280px] sm:w-[340px]'>
              <SheetHeader>
                <SheetTitle className='flex items-center space-x-2'>
                  <Image src='/images/logo.png' alt='Logo' width={40} height={40} />
                  <span className='text-primary text-xl font-bold dark:text-white'>ZoloQuiz</span>
                </SheetTitle>
              </SheetHeader>

              <nav className='mt-8 flex flex-col space-y-4'>
                {user ? (
                  <>
                    <div className='mb-6 flex items-center space-x-3 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-700'>
                      <Image
                        src={user.user_metadata?.avatar_url}
                        alt='User Avatar'
                        width={48}
                        height={48}
                        className='rounded-full border-2 border-blue-600'
                      />
                      <div className='flex flex-col overflow-hidden'>
                        <span className='truncate text-sm font-semibold text-gray-900 dark:text-white'>
                          {user.user_metadata?.full_name || 'User'}
                        </span>
                        <span className='truncate text-xs text-gray-600 dark:text-gray-300'>{user.email}</span>
                      </div>
                    </div>

                    <Link
                      href='/'
                      onClick={() => setMobileMenuOpen(false)}
                      className='flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    >
                      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                        />
                      </svg>
                      <span className='text-base font-medium'>Home</span>
                    </Link>

                    <Link
                      href='/my-quizzes'
                      onClick={() => setMobileMenuOpen(false)}
                      className='flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    >
                      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      <span className='text-base font-medium'>My Quizzes</span>
                    </Link>

                    <div className='my-4 border-t border-gray-200 dark:border-gray-700' />

                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className='flex items-center space-x-3 rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20'
                    >
                      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                        />
                      </svg>
                      <span className='text-base font-medium'>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href='/'
                      onClick={() => setMobileMenuOpen(false)}
                      className='flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    >
                      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                        />
                      </svg>
                      <span className='text-base font-medium'>Home</span>
                    </Link>

                    <Link
                      href='/auth/login'
                      onClick={() => setMobileMenuOpen(false)}
                      className='flex items-center space-x-3 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg'
                    >
                      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                        />
                      </svg>
                      <span className='text-base font-medium'>Login</span>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
