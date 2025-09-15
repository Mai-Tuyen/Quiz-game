"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Quiz } from "@/lib/database/quizzes";

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const difficultyColors = {
  1: "bg-green-100 text-green-800 border-green-200",
  2: "bg-blue-100 text-blue-800 border-blue-200",
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-orange-100 text-orange-800 border-orange-200",
  5: "bg-red-100 text-red-800 border-red-200",
};

const difficultyLabels = {
  1: "Beginner",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Expert",
};

export default function QuizCard({ quiz, index }: QuizCardProps) {
  const difficultyClass =
    difficultyColors[quiz.difficulty_level as keyof typeof difficultyColors] ||
    difficultyColors[3];
  const difficultyLabel =
    difficultyLabels[quiz.difficulty_level as keyof typeof difficultyLabels] ||
    "Medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link href={`/quizzes/${quiz.slug}`} className="block">
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Header with gradient */}
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative overflow-hidden"
            whileHover={{
              background:
                "linear-gradient(to right, #3B82F6, #8B5CF6, #EC4899)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-white text-3xl font-bold opacity-20"
                whileHover={{ scale: 1.1, opacity: 0.3 }}
                transition={{ duration: 0.2 }}
              >
                {quiz.category?.icon_url || "📝"}
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <motion.h3
              className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {quiz.title}
            </motion.h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {quiz.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-100 p-2 rounded-lg">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {quiz.question_count} Questions
                </span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-100 p-2 rounded-lg">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {quiz.time_limit} min
                </span>
              </motion.div>
            </div>

            {/* Difficulty Badge */}
            <motion.div
              className="flex justify-between items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyClass}`}
              >
                {difficultyLabel}
              </div>

              <motion.div
                className="flex items-center text-blue-600 text-sm font-medium"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Start Quiz
                <motion.svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
