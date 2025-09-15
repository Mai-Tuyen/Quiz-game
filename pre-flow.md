# Quiz Application - User Flow & Data Flow Documentation

## 🎯 **Complete User Flow: Taking a Quiz**

### **Phase 1: Quiz Discovery & Selection**

#### User Behavior:

- User browses quiz categories on homepage
- Views available quizzes in selected category
- Clicks on a specific quiz to see preview
- Reviews quiz details (title, description, questions count, time limit, difficulty)
- Clicks "Start Quiz" button

#### Data Flow:

```sql
-- Fetch categories for homepage
SELECT id, name, slug, description, icon_url
FROM categories
ORDER BY name;

-- Fetch quizzes by category
SELECT id, title, slug, description, time_limit, difficulty_level,
       (SELECT COUNT(*) FROM questions WHERE quiz_id = quizzes.id) as question_count
FROM quizzes
WHERE category_id = 'selected-category-uuid'
  AND is_published = true;

-- Get quiz details for preview
SELECT q.*, c.name as category_name,
       (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as total_questions
FROM quizzes q
JOIN categories c ON q.category_id = c.id
WHERE q.id = 'selected-quiz-uuid';
```

#### Tables Involved:

- ✅ `categories` - Quiz categories
- ✅ `quizzes` - Quiz metadata
- ✅ `questions` - Count questions per quiz
- ❌ No attempt created yet

---

### **Phase 2: Quiz Initialization**

#### User Behavior:

- User confirms quiz start
- Loading screen appears
- Quiz interface loads with first question
- Timer starts countdown
- Question matrix shows all questions as "unanswered"

#### Data Flow:

```sql
-- 1. Create new quiz attempt
INSERT INTO quiz_attempts (
  id,
  user_id,
  quiz_id,
  start_time,
  is_completed
) VALUES (
  gen_random_uuid(),
  'current-user-uuid',
  'selected-quiz-uuid',
  NOW(),
  false
) RETURNING id;

-- 2. Fetch all questions (PUBLIC DATA ONLY - NO ANSWERS)
SELECT
  id,
  question_text,
  question_type,
  question_order,
  points,
  -- Sanitized question_data without correct answers
  CASE
    WHEN question_type IN ('single_choice', 'multiple_choice') THEN
      jsonb_build_object(
        'options', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', option->>'id',
              'text', option->>'text'
              -- REMOVED: 'is_correct' field
            )
          )
          FROM jsonb_array_elements(question_data->'options') AS option
        )
      )
    WHEN question_type = 'sequence' THEN
      jsonb_build_object(
        'items', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', item->>'id',
              'text', item->>'text'
              -- REMOVED: 'correct_order' field
            )
          )
          FROM jsonb_array_elements(question_data->'items') AS item
        ),
        'shuffle_items', question_data->'shuffle_items'
      )
    WHEN question_type = 'drag_word' THEN
      jsonb_build_object(
        'sentence_template', question_data->>'sentence_template',
        'word_bank', question_data->'word_bank'
        -- REMOVED: 'blanks' with correct_answers
      )
    ELSE question_data
  END as question_data_safe
FROM questions
WHERE quiz_id = 'selected-quiz-uuid'
ORDER BY question_order;
```

#### Tables Involved:

- ✅ `quiz_attempts` - New record created
- ✅ `questions` - All questions fetched (sanitized)
- ❌ `user_answers` - Not created yet

#### Frontend State Initialization:

```javascript
{
  attemptId: 'new-attempt-uuid',
  currentQuestionIndex: 0,
  totalQuestions: 10,
  timeRemaining: 1800, // 30 minutes in seconds
  questions: [...], // All questions loaded
  answers: {}, // Empty initially
  questionStatus: {
    'question-1-uuid': 'current',
    'question-2-uuid': 'unanswered',
    // ... all others 'unanswered'
  },
  markedForReview: [],
  isCompleted: false
}
```

---

### **Phase 3: Active Quiz Session**

#### User Behavior:

- User reads question and selects answer(s)
- User navigates between questions using Previous/Next buttons
- User jumps to specific questions via question matrix
- User marks questions for review
- Timer continuously counts down (WebSocket updates)
- Question matrix updates with color-coded status

#### Data Flow (Per Answer):

**When user selects an answer:**

```sql
-- Save/Update user answer (UPSERT pattern)
INSERT INTO user_answers (
  id,
  attempt_id,
  question_id,
  selected_options,
  answered_at
) VALUES (
  gen_random_uuid(),
  'current-attempt-uuid',
  'current-question-uuid',
  '{"selected": ["opt3"]}', -- Format varies by question type
  NOW()
)
ON CONFLICT (attempt_id, question_id)
DO UPDATE SET
  selected_options = EXCLUDED.selected_options,
  answered_at = EXCLUDED.answered_at;

-- Note: is_correct is NOT calculated yet (no access to answers on frontend)
```

**Answer Format Examples:**

```javascript
// Single Choice
selected_options: {"selected": ["opt3"]}

// Multiple Choice
selected_options: {"selected": ["opt1", "opt2", "opt4"]}

// Sequence
selected_options: {
  "user_sequence": [
    {"id": "item1", "position": 1},
    {"id": "item2", "position": 2},
    {"id": "item3", "position": 3}
  ]
}

// Drag Word (Fill in blanks)
selected_options: {
  "answers": [
    {"blank_id": "BLANK1", "word_id": "word1", "word_text": "Sun"},
    {"blank_id": "BLANK2", "word_id": "word3", "word_text": "star"}
  ]
}

// Drag Word (Categorization)
selected_options: {
  "zone_assignments": [
    {"item_id": "whale", "zone_id": "ocean"},
    {"item_id": "bear", "zone_id": "forest"}
  ]
}
```

#### Real-time State Updates:

```javascript
// Frontend state during quiz
{
  currentQuestionIndex: 3,
  timeRemaining: 1200, // Updated via WebSocket
  answers: {
    "question-1-uuid": {"selected": ["opt2"]},
    "question-2-uuid": {"selected": ["opt1", "opt3"]},
    "question-3-uuid": {"selected": ["opt1"]},
    "question-4-uuid": {"user_sequence": [...]},
    // ...
  },
  questionStatus: {
    "question-1-uuid": "answered",
    "question-2-uuid": "answered",
    "question-3-uuid": "answered",
    "question-4-uuid": "current",
    "question-5-uuid": "unanswered"
    // ...
  },
  markedForReview: ["question-1-uuid", "question-4-uuid"]
}
```

#### Question Matrix Color Coding:

- 🟢 **Green**: Answered
- 🔵 **Blue**: Currently viewing
- 🟡 **Yellow**: Marked for review
- ⚪ **Gray**: Not answered yet

#### Tables Involved:

- ✅ `quiz_attempts` - Remains active (is_completed = false)
- ✅ `user_answers` - Records created/updated for each answer
- ❌ Answer validation happens later

---

### **Phase 4: Quiz Submission**

#### User Behavior:

- User clicks "Submit Quiz" button
- Confirmation dialog appears: "Are you sure you want to submit?"
- User confirms submission
- Loading screen shows "Processing your answers..."
- Quiz session ends

#### Data Flow:

```sql
-- 1. Validate all answers and calculate scores (BACKEND ONLY)
UPDATE user_answers
SET is_correct = CASE
  WHEN ua.question_id IN (
    -- Validate against private question data
    SELECT q.id FROM questions q
    WHERE q.id = ua.question_id
    AND (
      -- Single/Multiple choice validation
      (q.question_type IN ('single_choice', 'multiple_choice')
       AND jsonb_path_exists(
         q.question_data->'options',
         '$[*] ? (@.id == any(' || (ua.selected_options->'selected')::text || ') && @.is_correct == true)'
       ))
      OR
      -- Sequence validation
      (q.question_type = 'sequence'
       AND /* complex sequence validation logic */)
      OR
      -- Drag word validation
      (q.question_type = 'drag_word'
       AND /* complex drag word validation logic */)
    )
  ) THEN true
  ELSE false
END
WHERE attempt_id = 'current-attempt-uuid';

-- 2. Calculate final score
WITH score_calculation AS (
  SELECT
    COUNT(*) as total_questions,
    COUNT(CASE WHEN ua.is_correct = true THEN 1 END) as correct_answers,
    SUM(CASE WHEN ua.is_correct = true THEN q.points ELSE 0 END) as earned_points,
    SUM(q.points) as max_points
  FROM user_answers ua
  JOIN questions q ON ua.question_id = q.id
  WHERE ua.attempt_id = 'current-attempt-uuid'
)

-- 3. Update quiz attempt with final results
UPDATE quiz_attempts SET
  end_time = NOW(),
  score = (SELECT earned_points FROM score_calculation),
  max_score = (SELECT max_points FROM score_calculation),
  time_taken = EXTRACT(EPOCH FROM (NOW() - start_time))::INTEGER,
  is_completed = true
WHERE id = 'current-attempt-uuid';
```

#### Tables Involved:

- ✅ `quiz_attempts` - Updated with final score and completion
- ✅ `user_answers` - All answers validated and marked correct/incorrect
- ✅ `questions` - Used for validation and score calculation

---

### **Phase 5: Results Display**

#### User Behavior:

- User sees final score (e.g., "8/10 - 80%")
- Fireworks animation plays if 100% score
- User reviews question-by-question results
- User can see correct answers and explanations
- User can share results or retake quiz

#### Data Flow:

```sql
-- Fetch complete results with answers revealed
SELECT
  qa.id as attempt_id,
  qa.score,
  qa.max_score,
  qa.time_taken,
  qa.start_time,
  qa.end_time,
  ROUND((qa.score::DECIMAL / qa.max_score) * 100, 1) as percentage,

  -- Question details
  q.question_text,
  q.question_type,
  q.question_order,
  q.points,
  q.explanation,
  q.question_data, -- NOW SAFE TO INCLUDE ANSWERS

  -- User's answers
  ua.selected_options,
  ua.is_correct,
  ua.answered_at

FROM quiz_attempts qa
JOIN user_answers ua ON qa.id = ua.attempt_id
JOIN questions q ON ua.question_id = q.id
WHERE qa.id = 'completed-attempt-uuid'
ORDER BY q.question_order;
```

#### Results Data Structure:

```javascript
{
  attempt: {
    id: 'attempt-uuid',
    score: 8,
    maxScore: 10,
    percentage: 80.0,
    timeTaken: 1245, // seconds
    completedAt: '2025-09-15T10:30:00Z'
  },
  questionResults: [
    {
      questionId: 'q1-uuid',
      questionText: 'What is the capital of France?',
      questionType: 'single_choice',
      points: 1,
      explanation: 'Paris has been the capital since...',
      userAnswer: {"selected": ["opt3"]},
      correctAnswer: {"correct": ["opt3"]},
      isCorrect: true,
      options: [
        {id: "opt1", text: "London", isCorrect: false},
        {id: "opt2", text: "Berlin", isCorrect: false},
        {id: "opt3", text: "Paris", isCorrect: true},
        {id: "opt4", text: "Madrid", isCorrect: false}
      ]
    },
    // ... more questions
  ]
}
```

#### Tables Involved:

- ✅ `quiz_attempts` - Final score and metadata
- ✅ `user_answers` - Individual question results
- ✅ `questions` - Question details with correct answers (safe to show now)

---

## 📊 **Database Relationship Flow**
