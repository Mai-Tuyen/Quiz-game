import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/global/globals.css'
import Header from '@/global/components/layout/Header'
import Footer from '@/global/components/layout/Footer'
import TanstackQueryProvider from '@/global/lib/providers/TanstackqueryProvider'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'ZolQuiz - Quiz Game',
  description: 'ZolQuiz is a quiz game that allows you to test your knowledge in various categories.'
}
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanstackQueryProvider>
          <Header />
          {children}
          <Footer />
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
