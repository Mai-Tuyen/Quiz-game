import { CategoryList } from '@/features/category'
export const metadata = {
  title: 'Quiz Categories | Quiz Game',
  description: 'Explore our collection of quiz categories including Programming, Science, Geography, History, and more!'
}
export default async function Home() {
  return <CategoryList />
}
