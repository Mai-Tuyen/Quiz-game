"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UserAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_options: any;
  is_correct: boolean;
  answered_at: string;
  question: {
    id: string;
    question_text: string;
    question_type: string;
    question_order: number;
    points: number;
    explanation: string;
    question_data: any;
  };
}

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  time_limit: number;
  difficulty_level: number;
  category: {
    id: string;
    name: string;
    slug: string;
    icon_url: string;
  };
}

interface QuestionReviewMatrixProps {
  userAnswers: UserAnswer[];
  quiz: Quiz;
}

export default function QuestionReviewMatrix({
  userAnswers,
  quiz,
}: QuestionReviewMatrixProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<UserAnswer | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getQuestionStatus = (userAnswer: UserAnswer) => {
    if (!userAnswer.selected_options) return "skipped";
    return userAnswer.is_correct ? "correct" : "incorrect";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-500 text-white border-green-500 hover:bg-green-600";
      case "incorrect":
        return "bg-red-500 text-white border-red-500 hover:bg-red-600";
      case "skipped":
        return "bg-gray-400 text-white border-gray-400 hover:bg-gray-500";
      default:
        return "bg-gray-200 text-gray-600 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "incorrect":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "skipped":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const openQuestionDetail = (userAnswer: UserAnswer) => {
    setSelectedQuestion(userAnswer);
    setShowDetailModal(true);
  };

  const renderAnswerSummary = (userAnswer: UserAnswer) => {
    const { question } = userAnswer;
    const userSelection = userAnswer.selected_options
      ? JSON.parse(userAnswer.selected_options)
      : null;

    switch (question.question_type) {
      case "single_choice":
        const selectedOption = question.question_data.options.find(
          (opt: any) => opt.id === userSelection
        );
        return selectedOption ? selectedOption.text : "No answer selected";

      case "multiple_choice":
        if (!userSelection || !Array.isArray(userSelection))
          return "No answers selected";
        const selectedOptions = question.question_data.options.filter(
          (opt: any) => userSelection.includes(opt.id)
        );
        return (
          selectedOptions.map((opt: any) => opt.text).join(", ") ||
          "No answers selected"
        );

      case "sequence":
        if (!userSelection || !Array.isArray(userSelection))
          return "No sequence provided";
        return userSelection
          .map((item: any, index: number) => `${index + 1}. ${item.text}`)
          .join(" → ");

      case "drag_word":
        if (question.question_data.sentence_template) {
          // Fill-in-the-blank
          if (!userSelection?.answers) return "No answers provided";
          return userSelection.answers
            .map((ans: any) => `${ans.blank_id}: ${ans.word_text}`)
            .join(", ");
        } else if (question.question_data.drag_zones) {
          // Categorization
          if (!userSelection?.zone_assignments)
            return "No categorization provided";
          const assignments = userSelection.zone_assignments;
          const zones = question.question_data.drag_zones;
          return zones
            .map((zone: any) => {
              const zoneItems = assignments
                .filter((assignment: any) => assignment.zone_id === zone.id)
                .map((assignment: any) => {
                  const item = question.question_data.draggable_items.find(
                    (item: any) => item.id === assignment.item_id
                  );
                  return item ? item.text : assignment.item_id;
                });
              return `${zone.label}: ${zoneItems.join(", ") || "None"}`;
            })
            .join(" | ");
        }
        return "No answer provided";

      default:
        return "Unknown question type";
    }
  };

  const correctCount = userAnswers.filter((ans) => ans.is_correct).length;
  const incorrectCount = userAnswers.filter(
    (ans) => !ans.is_correct && ans.selected_options
  ).length;
  const skippedCount = userAnswers.filter(
    (ans) => !ans.selected_options
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Question Review
        </h2>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Correct ({correctCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Incorrect ({incorrectCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Skipped ({skippedCount})</span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Question Matrix</h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
          {userAnswers.map((userAnswer, index) => {
            const status = getQuestionStatus(userAnswer);
            const styles = getStatusStyles(status);
            const icon = getStatusIcon(status);

            return (
              <motion.button
                key={userAnswer.question.id}
                onClick={() => openQuestionDetail(userAnswer)}
                className={`relative w-12 h-12 rounded-lg border-2 font-semibold text-sm transition-all duration-200 ${styles}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xs font-bold">{index + 1}</span>
                  {icon && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-current flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Review List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Review</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {userAnswers.map((userAnswer, index) => {
            const status = getQuestionStatus(userAnswer);

            return (
              <motion.div
                key={userAnswer.question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className={`p-4 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  status === "correct"
                    ? "border-green-500 bg-green-50"
                    : status === "incorrect"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-400 bg-gray-50"
                }`}
                onClick={() => openQuestionDetail(userAnswer)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-700">
                        Q{index + 1}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === "correct"
                            ? "bg-green-100 text-green-800"
                            : status === "incorrect"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status === "correct"
                          ? "Correct"
                          : status === "incorrect"
                          ? "Incorrect"
                          : "Skipped"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {userAnswer.question.points}{" "}
                        {userAnswer.question.points === 1 ? "point" : "points"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {userAnswer.question.question_text}
                    </p>
                    <p className="text-xs text-gray-500">
                      Your answer: {renderAnswerSummary(userAnswer)}
                    </p>
                  </div>
                  <div className="ml-4">{getStatusIcon(status)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Question Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Question{" "}
                    {userAnswers.findIndex(
                      (ans) => ans.question.id === selectedQuestion.question.id
                    ) + 1}{" "}
                    Details
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedQuestion.is_correct
                          ? "bg-green-100 text-green-800"
                          : selectedQuestion.selected_options
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedQuestion.is_correct
                        ? "✓ Correct"
                        : selectedQuestion.selected_options
                        ? "✗ Incorrect"
                        : "- Skipped"}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedQuestion.question.points}{" "}
                      {selectedQuestion.question.points === 1
                        ? "Point"
                        : "Points"}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedQuestion.question.question_text}
                  </h4>
                </div>

                {/* Your Answer */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    Your Answer:
                  </h5>
                  <div
                    className={`p-4 rounded-lg border ${
                      selectedQuestion.is_correct
                        ? "border-green-200 bg-green-50"
                        : selectedQuestion.selected_options
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <p className="text-gray-700">
                      {renderAnswerSummary(selectedQuestion)}
                    </p>
                  </div>
                </div>

                {/* Correct Answer (if incorrect) */}
                {!selectedQuestion.is_correct &&
                  selectedQuestion.selected_options && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Correct Answer:
                      </h5>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-gray-700">
                          {/* Render correct answer based on question type */}
                          {selectedQuestion.question.question_type ===
                            "single_choice" &&
                            selectedQuestion.question.question_data.options
                              .filter((opt: any) => opt.is_correct)
                              .map((opt: any) => opt.text)
                              .join(", ")}
                          {/* Add other question types as needed */}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Explanation */}
                {selectedQuestion.question.explanation && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-2">
                      Explanation:
                    </h5>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-gray-700">
                        {selectedQuestion.question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
