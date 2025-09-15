"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getQuizWithQuestions } from "@/lib/database/quizzes";
import { createQuizAttempt, submitQuizAttempt } from "@/lib/database/attempts";
import QuestionDisplay from "@/components/quiz/QuestionDisplay";
import QuestionMatrix from "@/components/quiz/QuestionMatrix";
import Timer from "@/components/quiz/Timer";
import NavigationControls from "@/components/quiz/NavigationControls";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  question_text: string;
  question_type: "single_choice" | "multiple_choice" | "sequence" | "drag_word";
  question_order: number;
  points: number;
  explanation: string;
  question_data: any;
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
    description: string;
    icon_url: string;
  };
  questions: Question[];
  question_count: number;
}

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizSlug = params.slug as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(
    new Set()
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const quizData = await getQuizWithQuestions(quizSlug);

        if (!quizData) {
          setError("Quiz not found");
          return;
        }

        setQuiz(quizData);
        setTimeRemaining(quizData.time_limit * 60); // Convert minutes to seconds
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }

    if (quizSlug) {
      fetchQuiz();
    }
  }, [quizSlug]);

  const startQuiz = async () => {
    try {
      // For now, we'll use a dummy user ID. In a real app, this would come from authentication
      const userId = "demo-user-123";

      if (!quiz) return;

      const newAttemptId = await createQuizAttempt(quiz.id, userId);
      setAttemptId(newAttemptId);
      setQuizStartTime(new Date());
      setIsQuizStarted(true);
    } catch (error) {
      console.error("Error starting quiz:", error);
      setError("Failed to start quiz. Please try again.");
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attemptId || !quizStartTime || isSubmitting) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to submit your quiz? You won't be able to change your answers after submission."
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const results = await submitQuizAttempt(
        attemptId,
        answers,
        quizStartTime
      );

      // Redirect to results page
      router.push(`/result/${attemptId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-6xl mb-4 animate-bounce">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Quiz...
          </h1>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  // Quiz start screen
  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center"
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {quiz.category.icon_url}
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {quiz.title}
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {quiz.description}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {quiz.question_count}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {quiz.time_limit}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                Level {quiz.difficulty_level}
              </div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
          </div>

          <motion.button
            onClick={startQuiz}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Interface */}
      <div className="flex h-screen">
        {/* Left Panel - Question Content */}
        <div className="flex-1 flex flex-col">
          {/* Progress Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-semibold text-gray-900">
                {quiz.title}
              </h1>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Question Display */}
          <div className="flex-1 p-6 overflow-y-auto">
            <QuestionDisplay
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={(answer) =>
                handleAnswerChange(currentQuestion.id, answer)
              }
              isMarkedForReview={markedForReview.has(currentQuestion.id)}
              onMarkForReview={() => handleMarkForReview(currentQuestion.id)}
            />
          </div>

          {/* Navigation Controls */}
          <div className="bg-white border-t border-gray-200 p-4">
            <NavigationControls
              currentIndex={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isMarkedForReview={markedForReview.has(currentQuestion.id)}
              onMarkForReview={() => handleMarkForReview(currentQuestion.id)}
            />
          </div>
        </div>

        {/* Right Panel - Quiz Controls */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Timer */}
          <div className="p-6 border-b border-gray-200">
            <Timer
              timeRemaining={timeRemaining}
              totalTime={quiz.time_limit * 60}
              onTimeUp={handleSubmitQuiz}
            />
          </div>

          {/* Question Matrix */}
          <div className="flex-1 p-6 overflow-y-auto">
            <QuestionMatrix
              questions={quiz.questions}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              markedForReview={markedForReview}
              onQuestionClick={handleQuestionNavigation}
            />
          </div>

          {/* Submit Button */}
          <div className="p-6 border-t border-gray-200">
            <motion.button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                isSubmitting
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              whileHover={isSubmitting ? undefined : { scale: 1.02 }}
              whileTap={isSubmitting ? undefined : { scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Quiz"
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
