import Footer from '@/global/components/layout/Footer'
import Header from '@/global/components/layout/Header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
