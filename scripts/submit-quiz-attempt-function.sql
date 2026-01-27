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
  v_correct_sequence JSONB;
  v_user_sequence JSONB;
  v_deleted_count INTEGER;
  v_blank JSONB;
  v_zone JSONB;
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
    
    CASE v_question.question_type
      WHEN 'single_choice' THEN
        -- Find correct option
        SELECT jsonb_agg(opt->>'id') INTO v_correct_answer
        FROM jsonb_array_elements(v_question.question_data->'options') AS opt
        WHERE (opt->>'is_correct')::BOOLEAN = true
        LIMIT 1;
        
        -- Check if user answer matches
        IF v_correct_answer IS NOT NULL AND jsonb_array_length(v_correct_answer) = 1 THEN
          v_is_correct := (v_user_answer_data::TEXT = v_correct_answer->>0);
        END IF;
        
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', v_correct_answer->0);
        
      WHEN 'multiple_choice' THEN
        -- Get all correct option IDs
        SELECT jsonb_agg(opt->>'id' ORDER BY opt->>'id') INTO v_correct_answer
        FROM jsonb_array_elements(v_question.question_data->'options') AS opt
        WHERE (opt->>'is_correct')::BOOLEAN = true;
        
        -- Get user selections (sorted)
        IF jsonb_typeof(v_user_answer_data) = 'array' THEN
          SELECT jsonb_agg(value ORDER BY value) INTO v_user_selections
          FROM jsonb_array_elements(v_user_answer_data);
          
          -- Check if arrays match
          IF v_correct_answer IS NOT NULL AND v_user_selections IS NOT NULL THEN
            v_is_correct := (v_correct_answer = v_user_selections);
          END IF;
        END IF;
        
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', v_correct_answer);
        
      WHEN 'sequence' THEN
        -- Get correct sequence (sorted by correct_order)
        SELECT jsonb_agg(
          jsonb_build_object('id', item->>'id', 'position', (item->>'correct_order')::INTEGER)
          ORDER BY (item->>'correct_order')::INTEGER
        ) INTO v_correct_sequence
        FROM jsonb_array_elements(v_question.question_data->'items') AS item;
        
        -- Extract IDs in order
        SELECT jsonb_agg(value->>'id' ORDER BY (value->>'position')::INTEGER) INTO v_correct_answer
        FROM jsonb_array_elements(v_correct_sequence) AS value;
        
        -- Get user sequence
        IF jsonb_typeof(v_user_answer_data) = 'array' THEN
          SELECT jsonb_agg(value->>'id' ORDER BY (value->>'position')::INTEGER) INTO v_user_sequence
          FROM jsonb_array_elements(v_user_answer_data) AS value;
          
          -- Check if sequences match
          IF v_correct_answer IS NOT NULL AND v_user_sequence IS NOT NULL THEN
            v_is_correct := (v_correct_answer = v_user_sequence);
          END IF;
        END IF;
        
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', v_correct_answer);
        
      WHEN 'drag_word' THEN
        -- Check if it's fill-in-the-blank type
        IF v_question.question_data ? 'blanks' THEN
          -- Get correct answers for blanks
          SELECT jsonb_agg(
            jsonb_build_object(
              'blank_id', blank->>'id',
              'correct_answers', blank->'correct_answers'
            )
          ) INTO v_correct_answer
          FROM jsonb_array_elements(v_question.question_data->'blanks') AS blank;
          
          -- Check user answers
          IF v_user_answer_data ? 'answers' THEN
            v_is_correct := true;
            FOR v_blank IN 
              SELECT * FROM jsonb_array_elements(v_question.question_data->'blanks') AS blank
            LOOP
              DECLARE
                v_blank_id TEXT := v_blank->>'id';
                v_user_blank_answer JSONB;
                v_correct_answers JSONB := v_blank->'correct_answers';
              BEGIN
                SELECT value INTO v_user_blank_answer
                FROM jsonb_array_elements(v_user_answer_data->'answers') AS answer
                WHERE (answer->>'blank_id') = v_blank_id
                LIMIT 1;
                
                IF v_user_blank_answer IS NULL THEN
                  v_is_correct := false;
                  EXIT;
                END IF;
                
                IF NOT (v_correct_answers @> jsonb_build_array(v_user_blank_answer->>'word_text')) THEN
                  v_is_correct := false;
                  EXIT;
                END IF;
              END;
            END LOOP;
          END IF;
          
          v_result_item := v_result_item || jsonb_build_object('correctAnswer', jsonb_build_object('blanks', v_correct_answer));
          
        -- Check if it's categorization type (drag_zones)
        ELSIF v_question.question_data ? 'drag_zones' THEN
          -- Get correct zone assignments
          SELECT jsonb_agg(
            jsonb_build_object(
              'zone_id', zone->>'id',
              'correct_items', zone->'correct_items'
            )
          ) INTO v_correct_answer
          FROM jsonb_array_elements(v_question.question_data->'drag_zones') AS zone;
          
          -- Check user assignments
          IF v_user_answer_data ? 'zone_assignments' THEN
            v_is_correct := true;
            FOR v_zone IN 
              SELECT * FROM jsonb_array_elements(v_question.question_data->'drag_zones') AS zone
            LOOP
              DECLARE
                v_zone_id TEXT := v_zone->>'id';
                v_zone_items JSONB;
                v_correct_items JSONB := v_zone->'correct_items';
              BEGIN
                SELECT jsonb_agg(value->>'item_id') INTO v_zone_items
                FROM jsonb_array_elements(v_user_answer_data->'zone_assignments') AS assignment
                WHERE (assignment->>'zone_id') = v_zone_id;
                
                IF v_zone_items IS NULL OR jsonb_array_length(v_zone_items) != jsonb_array_length(v_correct_items) THEN
                  v_is_correct := false;
                  EXIT;
                END IF;
                
                IF NOT (v_correct_items <@ v_zone_items AND v_zone_items <@ v_correct_items) THEN
                  v_is_correct := false;
                  EXIT;
                END IF;
              END;
            END LOOP;
          END IF;
          
          v_result_item := v_result_item || jsonb_build_object('correctAnswer', jsonb_build_object('zones', v_correct_answer));
        END IF;
        
      ELSE
        -- Unknown question type
        v_result_item := v_result_item || jsonb_build_object('correctAnswer', NULL);
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
  
  -- Delete all user_answers
  DELETE FROM user_answers
  WHERE attempt_id = p_attempt_id;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  -- Return comprehensive result
  RETURN jsonb_build_object(
    'success', true,
    'attempt', row_to_json(v_attempt),
    'results', v_results,
    'deleted_answers_count', v_deleted_count
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback is automatic on exception
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$;
