"use client";

import { motion } from "framer-motion";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  question_order: number;
}

interface QuestionMatrixProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  markedForReview: Set<string>;
  onQuestionClick: (index: number) => void;
}

export default function QuestionMatrix({
  questions,
  currentQuestionIndex,
  answers,
  markedForReview,
  onQuestionClick,
}: QuestionMatrixProps) {
  const getQuestionStatus = (question: Question, index: number) => {
    const hasAnswer =
      answers[question.id] !== undefined && answers[question.id] !== null;
    const isMarked = markedForReview.has(question.id);
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) {
      return "current";
    } else if (isMarked) {
      return "marked";
    } else if (hasAnswer) {
      return "answered";
    } else {
      return "unanswered";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "current":
        return "bg-blue-500 text-white border-blue-500 ring-2 ring-blue-200";
      case "answered":
        return "bg-green-500 text-white border-green-500 hover:bg-green-600";
      case "marked":
        return "bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-500";
      case "unanswered":
        return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "answered":
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "marked":
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== null
  ).length;
  const markedCount = markedForReview.size;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h3 className="font-semibold text-gray-900 mb-3">Progress Overview</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Answered:</span>
            <span className="font-medium text-green-600">
              {answeredCount}/{questions.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Marked for Review:</span>
            <span className="font-medium text-yellow-600">{markedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-medium text-gray-600">
              {questions.length - answeredCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(answeredCount / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {Math.round((answeredCount / questions.length) * 100)}% Complete
          </div>
        </div>
      </motion.div>

      {/* Question Grid */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index);
            const styles = getStatusStyles(status);
            const icon = getStatusIcon(status);

            return (
              <motion.button
                key={question.id}
                onClick={() => onQuestionClick(index)}
                className={`relative w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all duration-200 ${styles}`}
                whileHover={{ scale: status !== "current" ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xs font-bold">{index + 1}</span>
                  {icon && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-current flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h4 className="font-medium text-gray-900 mb-3 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded border"></div>
            <span className="text-gray-600">Current Question</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded border"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
            <span className="text-gray-600">Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-600">Not Answered</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {currentQuestionIndex + 1}
          </div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-600">
            {questions.length}
          </div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </motion.div>
    </div>
  );
}
