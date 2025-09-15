import { createClient } from "@/utils/supabase/client";

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  start_time: string;
  end_time: string | null;
  score: number;
  max_score: number;
  is_completed: boolean;
  time_taken: number; // in seconds
}

export interface UserAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_options: any;
  is_correct: boolean;
  answered_at: string;
}

export interface AttemptWithDetails extends QuizAttempt {
  quiz: {
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
  };
  user_answers: (UserAnswer & {
    question: {
      id: string;
      question_text: string;
      question_type: string;
      question_order: number;
      points: number;
      explanation: string;
      question_data: any;
    };
  })[];
}

export async function createQuizAttempt(
  quizId: string,
  userId: string
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: userId,
      quiz_id: quizId,
      start_time: new Date().toISOString(),
      is_completed: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating quiz attempt:", error);
    throw new Error(`Failed to create quiz attempt: ${error.message}`);
  }

  return data.id;
}

export async function submitQuizAttempt(
  attemptId: string,
  answers: Record<string, any>,
  timeStarted: Date
): Promise<AttemptWithDetails> {
  const supabase = createClient();

  // First, get the quiz attempt with questions
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(
        *,
        category:categories(*),
        questions(*)
      )
    `
    )
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Quiz attempt not found");
  }

  const quiz = attempt.quiz;
  const questions = quiz.questions.sort(
    (a: any, b: any) => a.question_order - b.question_order
  );

  // Calculate scores and create user answers
  let totalScore = 0;
  let maxScore = 0;
  const userAnswers = [];

  for (const question of questions) {
    maxScore += question.points;
    const userAnswer = answers[question.id];
    let isCorrect = false;
    let points = 0;

    if (userAnswer !== undefined && userAnswer !== null) {
      isCorrect = checkAnswer(question, userAnswer);
      if (isCorrect) {
        points = question.points;
        totalScore += points;
      }
    }

    // Insert user answer
    const { data: answerData, error: answerError } = await supabase
      .from("user_answers")
      .insert({
        attempt_id: attemptId,
        question_id: question.id,
        selected_options: userAnswer ? JSON.stringify(userAnswer) : null,
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (answerError) {
      console.error("Error saving user answer:", answerError);
      continue;
    }

    userAnswers.push({
      ...answerData,
      question: question,
    });
  }

  // Calculate time taken
  const timeTaken = Math.floor(
    (new Date().getTime() - timeStarted.getTime()) / 1000
  );

  // Update quiz attempt with final scores
  const { data: completedAttempt, error: updateError } = await supabase
    .from("quiz_attempts")
    .update({
      end_time: new Date().toISOString(),
      score: totalScore,
      max_score: maxScore,
      is_completed: true,
      time_taken: timeTaken,
    })
    .eq("id", attemptId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(`Failed to complete quiz attempt: ${updateError.message}`);
  }

  return {
    ...completedAttempt,
    quiz: quiz,
    user_answers: userAnswers,
  };
}

export async function getAttemptWithResults(
  attemptId: string
): Promise<AttemptWithDetails | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(
        *,
        category:categories(*),
        questions(*)
      ),
      user_answers(
        *,
        question:questions(*)
      )
    `
    )
    .eq("id", attemptId)
    .eq("is_completed", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching attempt results:", error);
    throw new Error(`Failed to fetch results: ${error.message}`);
  }

  // Sort questions and answers by order
  data.quiz.questions.sort(
    (a: any, b: any) => a.question_order - b.question_order
  );
  data.user_answers.sort(
    (a: any, b: any) => a.question.question_order - b.question.question_order
  );

  return data;
}

function checkAnswer(question: any, userAnswer: any): boolean {
  const { question_type, question_data } = question;

  switch (question_type) {
    case "single_choice":
      const correctOption = question_data.options.find(
        (opt: any) => opt.is_correct
      );
      return userAnswer === correctOption?.id;

    case "multiple_choice":
      const correctOptions = question_data.options
        .filter((opt: any) => opt.is_correct)
        .map((opt: any) => opt.id);
      const userSelections = Array.isArray(userAnswer) ? userAnswer : [];

      // Check if all correct options are selected and no incorrect ones
      if (correctOptions.length !== userSelections.length) return false;
      return correctOptions.every((id: string) => userSelections.includes(id));

    case "sequence":
      const correctSequence = question_data.items
        .sort((a: any, b: any) => a.correct_order - b.correct_order)
        .map((item: any) => item.id);
      const userSequence = Array.isArray(userAnswer)
        ? userAnswer.map((item: any) => item.id)
        : [];

      return (
        correctSequence.length === userSequence.length &&
        correctSequence.every(
          (id: string, index: number) => userSequence[index] === id
        )
      );

    case "drag_word":
      if (question_data.sentence_template && question_data.blanks) {
        // Fill-in-the-blank type
        const answers = userAnswer?.answers || [];
        return question_data.blanks.every((blank: any) => {
          const userBlankAnswer = answers.find(
            (ans: any) => ans.blank_id === blank.id
          );
          return (
            userBlankAnswer &&
            blank.correct_answers.includes(userBlankAnswer.word_text)
          );
        });
      } else if (question_data.drag_zones) {
        // Categorization type
        const assignments = userAnswer?.zone_assignments || [];
        return question_data.drag_zones.every((zone: any) => {
          const zoneItems = assignments
            .filter((assignment: any) => assignment.zone_id === zone.id)
            .map((assignment: any) => assignment.item_id);

          return (
            zone.correct_items.length === zoneItems.length &&
            zone.correct_items.every((itemId: string) =>
              zoneItems.includes(itemId)
            )
          );
        });
      }
      return false;

    default:
      return false;
  }
}

export async function getUserQuizAttempts(
  userId: string
): Promise<QuizAttempt[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(title, slug, category:categories(name, icon_url))
    `
    )
    .eq("user_id", userId)
    .eq("is_completed", true)
    .order("end_time", { ascending: false });

  if (error) {
    console.error("Error fetching user attempts:", error);
    throw new Error(`Failed to fetch attempts: ${error.message}`);
  }

  return data || [];
}
