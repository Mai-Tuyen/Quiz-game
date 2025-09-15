"use client";

import { motion } from "framer-motion";
import SingleChoiceQuestion from "./AnswerOptions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "./AnswerOptions/MultipleChoiceQuestion";
import SequenceQuestion from "./AnswerOptions/SequenceQuestion";
import DragWordQuestion from "./AnswerOptions/DragWordQuestion";

interface Question {
  id: string;
  question_text: string;
  question_type: "single_choice" | "multiple_choice" | "sequence" | "drag_word";
  question_order: number;
  points: number;
  explanation: string;
  question_data: any;
}

interface QuestionDisplayProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
  isMarkedForReview: boolean;
  onMarkForReview: () => void;
}

export default function QuestionDisplay({
  question,
  answer,
  onAnswerChange,
  isMarkedForReview,
  onMarkForReview,
}: QuestionDisplayProps) {
  const renderAnswerComponent = () => {
    switch (question.question_type) {
      case "single_choice":
        return (
          <SingleChoiceQuestion
            questionData={question.question_data}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        );
      case "multiple_choice":
        return (
          <MultipleChoiceQuestion
            questionData={question.question_data}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        );
      case "sequence":
        return (
          <SequenceQuestion
            questionData={question.question_data}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        );
      case "drag_word":
        return (
          <DragWordQuestion
            questionData={question.question_data}
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        );
      default:
        return (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            Unsupported question type: {question.question_type}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {question.points} {question.points === 1 ? "Point" : "Points"}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {question.question_type.replace("_", " ")}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {question.question_text}
            </h2>
          </div>

          {/* Mark for Review Button */}
          <motion.button
            onClick={onMarkForReview}
            className={`ml-4 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
              isMarkedForReview
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMarkedForReview ? (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                Marked
              </div>
            ) : (
              <div className="flex items-center gap-2">
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
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Answer Component */}
      <div className="mb-8">{renderAnswerComponent()}</div>

      {/* Question Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            {question.question_type === "single_choice" && (
              <p>Select the best answer from the options below.</p>
            )}
            {question.question_type === "multiple_choice" && (
              <p>
                Select all correct answers. Multiple selections are allowed.
              </p>
            )}
            {question.question_type === "sequence" && (
              <p>
                Drag and drop the items to arrange them in the correct order.
              </p>
            )}
            {question.question_type === "drag_word" && (
              <p>
                Drag the words from the word bank to complete the sentence or
                categorize items.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
