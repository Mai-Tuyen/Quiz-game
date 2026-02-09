import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSEOMetadata({
  title,
  description,
  url,
  thumbnailUrl
}: {
  title: string
  description: string
  url: string
  thumbnailUrl: string
}) {
  return {
    title: title,
    description: description,
    openGraph: {
      type: 'website',
      url: url,
      title: title,
      description: description,
      images: [{ url: thumbnailUrl, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [{ url: thumbnailUrl }]
    }
  }
}
