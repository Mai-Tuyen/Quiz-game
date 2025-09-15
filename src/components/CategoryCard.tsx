import Link from "next/link";
import { Category } from "@/lib/database/categories";

interface CategoryCardProps {
  category: Category;
  quizCount?: number;
}

export default function CategoryCard({
  category,
  quizCount,
}: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-4xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full group-hover:scale-110 transition-transform duration-300">
          {category.icon_url}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed mb-4 line-clamp-3">
          {category.description}
        </p>

        {/* Quiz Count */}
        {quizCount !== undefined && (
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {quizCount} {quizCount === 1 ? "Quiz" : "Quizzes"}
            </span>
          </div>
        )}

        {/* Hover indicator */}
        <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            Explore Quizzes →
          </span>
        </div>
      </div>
    </Link>
  );
}
