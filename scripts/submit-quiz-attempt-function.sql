-- Create a comprehensive function to submit quiz attempt with all logic
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION submit_quiz_attempt_transaction(
  p_attempt_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_attempt quiz_attempts%ROWTYPE;
  v_quiz quizzes%ROWTYPE;
  v_question RECORD;
  v_user_answer RECORD;
  v_total_score INTEGER := 0;
  v_max_score INTEGER := 0;
  v_time_taken INTEGER;
  v_end_time TIMESTAMP WITHOUT TIME ZONE;
  v_is_correct BOOLEAN;
  v_correct_answer JSONB;
  v_user_answer_data JSONB;
  v_results JSONB := '[]'::JSONB;
  v_result_item JSONB;
  v_correct_options JSONB;
  v_user_selections JSONB;
BEGIN
  -- Get the attempt
  SELECT * INTO v_attempt
  FROM quiz_attempts
  WHERE id = p_attempt_id;
  
  IF v_attempt.id IS NULL THEN
    RAISE EXCEPTION 'Quiz attempt not found: %', p_attempt_id;
  END IF;
  
  IF v_attempt.is_completed THEN
    RAISE EXCEPTION 'Quiz attempt already completed';
  END IF;
  
  -- Get the quiz
  SELECT * INTO v_quiz
  FROM quizzes
  WHERE id = v_attempt.quiz_id;
  
  IF v_quiz.id IS NULL THEN
    RAISE EXCEPTION 'Quiz not found: %', v_attempt.quiz_id;
  END IF;
  
  -- Calculate end time and time taken
  v_end_time := NOW();
  v_time_taken := EXTRACT(EPOCH FROM (v_end_time - v_attempt.start_time))::INTEGER;
  
  -- Process each question
  FOR v_question IN 
    SELECT * FROM questions 
    WHERE quiz_id = v_quiz.id 
    ORDER BY question_order
  LOOP
    v_max_score := v_max_score + COALESCE(v_question.points, 1);
    
    -- Get user answer for this question
    SELECT * INTO v_user_answer
    FROM user_answers
    WHERE attempt_id = p_attempt_id 
      AND question_id = v_question.id
    LIMIT 1;
    
    -- Initialize result item
    v_result_item := jsonb_build_object(
      'question_id', v_question.id,
      'question_text', v_question.question_text,
      'question_type', v_question.question_type,
      'points', v_question.points,
      'userAnswer', CASE WHEN v_user_answer.id IS NOT NULL THEN 
        jsonb_build_object(
          'id', v_user_answer.id,
          'selected_options', v_user_answer.selected_options,
          'answered_at', v_user_answer.answered_at
        ) ELSE NULL END,
      'correctAnswer', NULL,
      'isCorrect', false
    );
    
    -- Check answer based on question type
    v_is_correct := false;
    v_user_answer_data := COALESCE(v_user_answer.selected_options, 'null'::JSONB);
    
    -- Use correct_answer column from questions table
    v_correct_answer := v_question.correct_answer;

    CASE v_question.question_type
      WHEN 'single_choice' THEN
        -- correct_answer format: {"id": "opt1"}, user selected_options: "opt1" (string)
        IF v_correct_answer IS NOT NULL AND v_user_answer_data IS NOT NULL THEN
          v_is_correct := (v_user_answer_data #>> '{}') = (v_correct_answer->>'id');
        END IF;
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', v_correct_answer);

      WHEN 'multiple_choice' THEN
        -- correct_answer format: [{"id": "opt1"}, {"id": "opt2"}, ...], user: ["opt1", "opt2"] (array of strings)
        IF v_correct_answer IS NOT NULL AND jsonb_typeof(v_correct_answer) = 'array'
           AND jsonb_typeof(v_user_answer_data) = 'array' THEN
          SELECT jsonb_agg(to_jsonb(x->>'id') ORDER BY x->>'id') INTO v_correct_options
          FROM jsonb_array_elements(v_correct_answer) AS x;
          SELECT jsonb_agg(to_jsonb(x #>> '{}') ORDER BY x #>> '{}') INTO v_user_selections
          FROM jsonb_array_elements(v_user_answer_data) AS x;
          v_is_correct := (v_correct_options = v_user_selections);
        END IF;
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', v_correct_answer);

      ELSE
        -- Other question types: no grading, just expose correct_answer if present
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', v_correct_answer);
    END CASE;
    
    -- Update result item with correctness
    v_result_item := v_result_item || jsonb_build_object('isCorrect', v_is_correct);
    
    -- Add to total score if correct
    IF v_is_correct THEN
      v_total_score := v_total_score + COALESCE(v_question.points, 1);
    END IF;
    
    -- Add result to results array
    v_results := v_results || jsonb_build_array(v_result_item);
  END LOOP;
  
  -- Update quiz_attempts in transaction
  UPDATE quiz_attempts
  SET 
    end_time = v_end_time,
    score = v_total_score,
    max_score = v_max_score,
    is_completed = true,
    time_taken = v_time_taken
  WHERE id = p_attempt_id
  RETURNING * INTO v_attempt;

  -- Return comprehensive result (user_answers are kept for review)
  RETURN jsonb_build_object(
    'success', true,
    'attempt', row_to_json(v_attempt),
    'results', v_results
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback is automatic on exception
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$;
