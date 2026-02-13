'use client'

import React, { useTransition } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useTranslations } from 'use-intl'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/global/components/ui/dropdown-menu'
import { setLocale } from '@/global/lib/actions/locale'

const LanguageSelector = () => {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const handleLanguageChange = (value: string) => {
    startTransition(async () => {
      await setLocale(value)
      router.refresh()
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='flex w-[70px] cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-none transition-all duration-300 outline-none hover:scale-105 focus:ring-0'>
        <div className='flex items-center gap-2'>
          <Image
            src={locale === 'vi' ? '/flags/vietnam.png' : '/flags/uk.png'}
            alt={locale === 'vi' ? 'Vietnamese' : 'English'}
            width={20}
            height={20}
            className='rounded-sm'
          />
          <span>{locale === 'vi' ? 'VI' : 'EN'}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleLanguageChange('vi')} className='cursor-pointer'>
          <div className='flex items-center gap-2'>
            <Image src={'/flags/vietnam.png'} alt='Vietnamese' width={20} height={20} className='rounded-sm' />
            <span>{t('Lang.vi')}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('en')} className='cursor-pointer'>
          <div className='flex items-center gap-2'>
            <Image src={'/flags/uk.png'} alt='English' width={20} height={20} className='rounded-sm' />
            <span>{t('Lang.en')}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector
