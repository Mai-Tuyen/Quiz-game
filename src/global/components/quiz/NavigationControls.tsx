"use client";

import { motion } from "framer-motion";

interface NavigationControlsProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  isMarkedForReview: boolean;
  onMarkForReview: () => void;
}

export default function NavigationControls({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  isMarkedForReview,
  onMarkForReview,
}: NavigationControlsProps) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="flex items-center justify-between">
      {/* Previous Button */}
      <motion.button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isFirstQuestion
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        }`}
        whileHover={isFirstQuestion ? undefined : { scale: 1.02 }}
        whileTap={isFirstQuestion ? undefined : { scale: 0.98 }}
      >
        <svg
          className={`w-4 h-4 ${
            isFirstQuestion ? "text-gray-400" : "text-gray-600"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </motion.button>

      {/* Center Controls */}
      <div className="flex items-center gap-4">
        {/* Question Counter */}
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {currentIndex + 1} of {totalQuestions}
        </div>

        {/* Mark for Review Button */}
        <motion.button
          onClick={onMarkForReview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isMarkedForReview
              ? "bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isMarkedForReview ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Marked
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Mark for Review
            </>
          )}
        </motion.button>
      </div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        disabled={isLastQuestion}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isLastQuestion
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        whileHover={isLastQuestion ? undefined : { scale: 1.02 }}
        whileTap={isLastQuestion ? undefined : { scale: 0.98 }}
      >
        {isLastQuestion ? "Last Question" : "Next"}
        {!isLastQuestion && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
