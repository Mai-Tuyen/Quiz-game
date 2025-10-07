'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { storage } from '@/utils/supabase/storage'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      storage.set('user', session?.user ?? null)  
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className='sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80'>
      <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-2xl'>🎯</span>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>Quiz Game</span>
          </Link>
          <nav className='hidden items-center space-x-6 md:flex'>
            {loading ? (
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
            ) : user ? (
              <div className='flex items-center space-x-2'>
                <Image
                  src={user.user_metadata?.avatar_url}
                  alt='User Avatar'
                  width={32}
                  height={32}
                  className='border-gradient-to-r rounded-full border-2 from-blue-600 to-purple-600'
                />
                <span className='text-sm text-gray-600 dark:text-gray-300'>
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className='text-sm font-medium text-gray-600 transition-colors hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400'
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href='/auth/login'
                className='text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
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
