import { createClient } from "@/utils/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  created_at: string;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    console.error("Error fetching category:", error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}

export async function getCategoryWithQuizCount(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      quizzes:quizzes(count)
    `
    )
    .eq("slug", slug)
    .eq("quizzes.is_published", true)
    .single();

  if (error) {
    console.error("Error fetching category with quiz count:", error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}
