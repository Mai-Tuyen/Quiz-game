'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { getQuizWithQuestions } from '@/global/lib/database/quizzes'
import { createQuizAttempt, submitQuizAttempt } from '@/global/lib/database/attempts'
import QuestionDisplay from '@/global/components/quiz/QuestionDisplay'
import QuestionMatrix from '@/global/components/quiz/QuestionMatrix'
import Timer from '@/global/components/quiz/Timer'
import NavigationControls from '@/global/components/quiz/NavigationControls'
import { useRouter } from 'next/navigation'
import { storage } from '@/global/lib/storage'
import { createClient } from '@/global/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Quiz } from '@/features/quiz/type'
import { useGetQuizWithQuestionsQuery } from '@/features/quiz/hooks/query'
import QuizLoading from '@/features/quiz/views/QuizLoading'

export default function QuizDetailView() {
  const params = useParams()
  const router = useRouter()
  const quizSlug = params.slug as string
  const supabase = createClient()

  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const { data: quiz, isLoading: isQuizLoading, error: quizError } = useGetQuizWithQuestionsQuery(quizSlug)
  const timeRemaining = quiz?.time_limit * 60
  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setAuthLoading(false)
        return
      }

      setUser(session.user)
      setAuthLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        // Force a re-render by updating the user state
        setAuthLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const startQuiz = async () => {
    try {
      if (!quiz || !user?.id) return

      const newAttemptId = await createQuizAttempt(quiz.id, user?.id)
      setAttemptId(newAttemptId)
      setQuizStartTime(new Date())
    } catch (error) {
      console.error('Error starting quiz:', error)
      setError('Failed to start quiz. Please try again.')
    }
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!attemptId || !quizStartTime || isSubmitting) return

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to submit your quiz? You won't be able to change your answers after submission."
    )

    if (!confirmed) return

    try {
      setIsSubmitting(true)

      const results = await submitQuizAttempt(attemptId, answers, quizStartTime)

      // Redirect to results page
      router.push(`/result/${attemptId}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setError('Failed to submit quiz. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (authLoading || isQuizLoading) {
    return <QuizLoading />
  }

  if (!user && !authLoading) {
    // redirect to home
    router.push('/')
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Quiz Interface */}
      <div className='flex h-screen'>
        {/* Left Panel - Question Content */}
        <div className='flex flex-1 flex-col'>
          {/* Progress Header */}
          <div className='border-b border-gray-200 bg-white p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <h1 className='text-lg font-semibold text-gray-900'>{quiz.title}</h1>
              <span className='text-sm text-gray-500'>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>
            <div className='h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                style={{
                  width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Question Display */}
          <div className='flex-1 overflow-y-auto p-6'>
            <QuestionDisplay
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              isMarkedForReview={markedForReview.has(currentQuestion.id)}
              onMarkForReview={() => handleMarkForReview(currentQuestion.id)}
            />
          </div>

          {/* Navigation Controls */}
          <div className='border-t border-gray-200 bg-white p-4'>
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
        <div className='flex w-80 flex-col border-l border-gray-200 bg-white'>
          {/* Timer */}
          <div className='border-b border-gray-200 p-6'>
            <Timer timeRemaining={timeRemaining} totalTime={quiz.time_limit * 60} onTimeUp={handleSubmitQuiz} />
          </div>

          {/* Question Matrix */}
          <div className='flex-1 overflow-y-auto p-6'>
            <QuestionMatrix
              questions={quiz.questions}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              markedForReview={markedForReview}
              onQuestionClick={handleQuestionNavigation}
            />
          </div>

          {/* Submit Button */}
          <div className='border-t border-gray-200 p-6'>
            <motion.button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className={`w-full rounded-lg py-3 font-semibold transition-colors duration-200 ${
                isSubmitting
                  ? 'cursor-not-allowed bg-gray-400 text-gray-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              whileHover={isSubmitting ? undefined : { scale: 1.02 }}
              whileTap={isSubmitting ? undefined : { scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  Submitting...
                </div>
              ) : (
                'Submit Quiz'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
