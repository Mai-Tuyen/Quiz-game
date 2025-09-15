import { createClient } from "@/utils/supabase/server";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";

export const metadata = {
  title: "Quiz Categories | Quiz Game",
  description:
    "Explore our collection of quiz categories including Programming, Science, Geography, History, and more!",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  created_at: string;
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Categories
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Choose from a variety of quiz categories to test your knowledge
              and learn something new!
            </p>

            {/* Stats */}
            {categories.length > 0 && (
              <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                <span className="text-2xl mr-3">🎯</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                  {categories.length}{" "}
                  {categories.length === 1 ? "Category" : "Categories"}{" "}
                  Available
                </span>
              </div>
            )}
          </div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
                <div className="text-8xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Categories Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  It looks like there are no quiz categories available yet. Make
                  sure your database is set up with sample data.
                </p>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    📝 Setup Instructions:
                  </h4>
                  <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>1. Check your .env.local file</li>
                    <li>2. Run the database setup script</li>
                    <li>3. Verify sample data was created</li>
                  </ol>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Refresh Page
                  </button>
                  <Link
                    href="/"
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {categories.length > 0 && (
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Test Your Knowledge?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Pick a category above and start your quiz journey. Challenge
                  yourself with questions designed to test and expand your
                  knowledge!
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    Multiple Choice
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    Drag & Drop
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    Sequence Questions
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    And More!
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
