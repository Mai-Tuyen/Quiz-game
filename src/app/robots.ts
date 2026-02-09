import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/categories/'],
        disallow: ['/auth/', '/my-quizzes', '/result/', '/quizzes/', '/api/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
