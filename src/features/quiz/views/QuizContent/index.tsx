'use client'

import {
  useGetAllAnswerOfQuizAttemptQuery,
  useGetCurrentQuizAttemptQuery,
  useGetQuizWithQuestionsQuery,
  useSubmitQuizAttemptMutation,
  useUpsertUserAnswerMutation
} from '@/features/quiz/hooks/query'
import Timer from '@/features/quiz/views/components/Timer'
import NavigationControls from '@/features/quiz/views/QuizContent/NavigationControls'
import QuestionDisplay from '@/features/quiz/views/QuizContent/QuestionDisplay'
import QuestionMatrix from '@/features/quiz/views/QuizContent/QuestionMatrix'
import TimerRight from '@/features/quiz/views/QuizContent/TimerRight'
import QuizLoading from '@/features/quiz/views/QuizLoading'
import { Button } from '@/global/components/ui/button'
import { storage } from '@/global/lib/storage'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function QuizDetailView() {
  const userId = typeof window === 'undefined' ? null : storage.get('user')?.id
  const params = useParams()
  const router = useRouter()
  const quizSlug = params.slug as string
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const { data: quiz, isLoading: isQuizLoading, error: quizError } = useGetQuizWithQuestionsQuery(quizSlug)
  const {
    data: currentAttempt,
    isFetched: isCurrentAttemptFetched,
    isFetching: isCurrentAttemptFetching,
    isError: isCurrentAttemptError,
    error: currentAttemptError
  } = useGetCurrentQuizAttemptQuery(quiz?.id, !!userId && !!quiz?.id)

  // Redirect to quiz info when no incomplete quiz attempt is found (only after fetch completes, to avoid redirecting on stale cache after creating attempt)
  useEffect(() => {
    if (!quiz?.id || isQuizLoading) return
    if (!userId) {
      router.replace(`/quizzes/${quizSlug}/info`)
      return
    }
    if (!isCurrentAttemptFetching && isCurrentAttemptFetched && !currentAttempt) {
      router.replace(`/quizzes/${quizSlug}/info`)
    }
  }, [
    quiz?.id,
    quizSlug,
    isQuizLoading,
    userId,
    isCurrentAttemptFetched,
    isCurrentAttemptFetching,
    currentAttempt,
    router
  ])
  const { data: allAnswers } = useGetAllAnswerOfQuizAttemptQuery(currentAttempt?.id as string, !!currentAttempt?.id)
  const { mutate: upsertUserAnswer } = useUpsertUserAnswerMutation()
  const { mutate: submitQuizAttempt, isPending: isSubmitting } = useSubmitQuizAttemptMutation()
  const timeStart = dayjs(currentAttempt?.start_time)
  const timeEnd = timeStart.add(quiz?.time_limit, 'minutes')
  const timeRemaining = timeEnd.diff(dayjs(), 'second')

  const handleAnswerChange = (questionId: string, answer: any) => {
    upsertUserAnswer({
      id: allAnswers?.find((answer: any) => answer.question_id === questionId)?.id as string,
      attemptId: currentAttempt?.id as string,
      questionId: questionId,
      selectedOptions: answer
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
    if (!currentAttempt?.id || isSubmitting) return

    submitQuizAttempt(currentAttempt.id, {
      onSuccess: (data) => {
        // navigate to results page
        router.push(`/result/${currentAttempt.id}`)
      },
      onError: (error) => {}
    })
  }

  const shouldRedirectToInfo =
    quiz?.id && !isQuizLoading && (!userId || (!isCurrentAttemptFetching && isCurrentAttemptFetched && !currentAttempt))

  if (isQuizLoading) {
    return <QuizLoading />
  }

  if (shouldRedirectToInfo) {
    return <QuizLoading />
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Quiz Interface */}
      <div className='header-question-mobile fixed top-14 z-10 flex w-full justify-end gap-2 bg-white p-2 md:hidden'>
        <Timer timeRemaining={timeRemaining} totalTime={quiz.time_limit * 60} onTimeUp={handleSubmitQuiz} />
        <Button
          variant='outline'
          size='sm'
          onClick={handleSubmitQuiz}
          className='bg-green-600 text-white hover:bg-green-700'
        >
          Submit Quiz
        </Button>
      </div>
      <div className='mt-10 flex h-screen md:mt-0'>
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
              answer={allAnswers?.find((answer: any) => answer.question_id === currentQuestion.id)?.selected_options}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            />
          </div>

          {/* Navigation Controls */}
          <div className='sticky bottom-0 border-t border-gray-200 bg-white p-4'>
            <NavigationControls
              currentIndex={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              questions={quiz.questions}
              answers={allAnswers || []}
              onQuestionClick={handleQuestionNavigation}
            />
          </div>
        </div>

        {/* Right Panel - Quiz Controls */}
        <div className='flex hidden w-80 flex-col border-l border-gray-200 bg-white md:flex'>
          {/* Timer */}
          <div className='p-4'>
            <TimerRight timeRemaining={timeRemaining} totalTime={quiz.time_limit * 60} onTimeUp={handleSubmitQuiz} />
            {/* Submit Button */}
            <div className='pt-2'>
              <motion.button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className={`w-full cursor-pointer rounded-lg py-3 font-semibold transition-colors duration-200 ${
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

            {/* Question Matrix */}
            <div className='overflow-y-auto p-6'>
              <QuestionMatrix
                questions={quiz.questions}
                currentQuestionIndex={currentQuestionIndex}
                answers={allAnswers || []}
                onQuestionClick={handleQuestionNavigation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
