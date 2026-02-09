import { MetadataRoute } from 'next'
import { getCategoriesAPI } from '@/features/category/api'
import { createClient } from '@/global/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    }
  ]

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategoriesAPI()
    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.8
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return [...staticPages, ...categoryPages]
}
