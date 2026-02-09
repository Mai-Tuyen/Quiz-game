import type { Metadata } from 'next'
import { CategoryList } from '@/features/category'
import { generateSEOMetadata } from '@/global/lib/utils'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export const metadata: Metadata = generateSEOMetadata({
  title: 'ZoloQuiz | Know more daily',
  description:
    'Explore our collection of quiz categories including Programming, Science, Geography, History, and more!',
  url: baseUrl,
  thumbnailUrl: `${baseUrl}/images/logo.png`
})

export default async function Home() {
  return <CategoryList />
}
