import { Category } from '@/features/category/type'
import { createClient } from '@/global/lib/supabase/server'

export async function getCategoriesAPI(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getCategoryBySlugAPI(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null
    }
    console.error('Error fetching category:', error)
    throw new Error(`Failed to fetch category: ${error.message}`)
  }

  return data
}
