import Footer from '@/global/components/layout/Footer'
import Header from '@/global/components/layout/Header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
