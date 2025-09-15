-- Quiz Game Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all tables

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  google_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Quizzes Table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  time_limit INTEGER, -- in minutes
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Questions Table (Unified format for all question types)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR CHECK (question_type IN ('single_choice', 'multiple_choice', 'sequence', 'drag_word')),
  question_order INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  explanation TEXT,
  -- Unified format: ALL question types use this JSONB field
  question_data JSONB NOT NULL, -- Stores all question configuration and options
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Quiz Attempts Table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  quiz_id UUID REFERENCES quizzes(id),
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  score INTEGER,
  max_score INTEGER,
  is_completed BOOLEAN DEFAULT false,
  time_taken INTEGER -- in seconds
);

-- 6. User Answers Table
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_options JSONB, -- Store array of selected option IDs
  is_correct BOOLEAN,
  answered_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data

-- Sample Users
INSERT INTO users (id, email, full_name, avatar_url) VALUES
(gen_random_uuid(), 'john.doe@example.com', 'John Doe', 'https://avatar.vercel.sh/john'),
(gen_random_uuid(), 'jane.smith@example.com', 'Jane Smith', 'https://avatar.vercel.sh/jane'),
(gen_random_uuid(), 'admin@quizapp.com', 'Quiz Admin', 'https://avatar.vercel.sh/admin');

-- Sample Categories
INSERT INTO categories (id, name, slug, description, icon_url) VALUES
(gen_random_uuid(), 'Programming', 'programming', 'Test your programming knowledge with these coding quizzes', '💻'),
(gen_random_uuid(), 'Science', 'science', 'Explore the wonders of science through engaging quizzes', '🔬'),
(gen_random_uuid(), 'Geography', 'geography', 'Test your knowledge of world geography and locations', '🌍'),
(gen_random_uuid(), 'History', 'history', 'Journey through time with these history quizzes', '📚'),
(gen_random_uuid(), 'Animals', 'animals', 'Learn about the animal kingdom with fun quizzes', '🐾');

-- Sample Quizzes
WITH programming_category AS (SELECT id FROM categories WHERE slug = 'programming'),
     science_category AS (SELECT id FROM categories WHERE slug = 'science'),
     geography_category AS (SELECT id FROM categories WHERE slug = 'geography'),
     history_category AS (SELECT id FROM categories WHERE slug = 'history'),
     admin_user AS (SELECT id FROM users WHERE email = 'admin@quizapp.com')

INSERT INTO quizzes (id, title, slug, description, category_id, time_limit, difficulty_level, is_published, created_by) VALUES
(gen_random_uuid(), 'JavaScript Fundamentals', 'javascript-fundamentals', 'Test your knowledge of JavaScript basics and core concepts', (SELECT id FROM programming_category), 15, 2, true, (SELECT id FROM admin_user)),
(gen_random_uuid(), 'React Framework Basics', 'react-framework-basics', 'Learn the fundamentals of React.js framework', (SELECT id FROM programming_category), 20, 3, true, (SELECT id FROM admin_user)),
(gen_random_uuid(), 'Solar System Explorer', 'solar-system-explorer', 'Discover the mysteries of our solar system', (SELECT id FROM science_category), 10, 1, true, (SELECT id FROM admin_user)),
(gen_random_uuid(), 'World Capitals Challenge', 'world-capitals-challenge', 'How well do you know world capitals?', (SELECT id FROM geography_category), 12, 2, true, (SELECT id FROM admin_user)),
(gen_random_uuid(), 'Historical Timeline', 'historical-timeline', 'Arrange historical events in chronological order', (SELECT id FROM history_category), 18, 4, true, (SELECT id FROM admin_user));

-- Sample Questions for JavaScript Fundamentals Quiz
WITH js_quiz AS (SELECT id FROM quizzes WHERE slug = 'javascript-fundamentals')

INSERT INTO questions (quiz_id, question_text, question_type, question_order, points, explanation, question_data) VALUES

-- Single Choice Question
((SELECT id FROM js_quiz), 'What is the correct way to declare a variable in JavaScript?', 'single_choice', 1, 1, 'let is the modern way to declare variables in JavaScript, providing block scope.', '{
  "options": [
    {"id": "opt1", "text": "let myVar = 5;", "is_correct": true},
    {"id": "opt2", "text": "variable myVar = 5;", "is_correct": false},
    {"id": "opt3", "text": "declare myVar = 5;", "is_correct": false},
    {"id": "opt4", "text": "myVar := 5;", "is_correct": false}
  ]
}'),

-- Multiple Choice Question
((SELECT id FROM js_quiz), 'Which of the following are JavaScript data types? (Select all that apply)', 'multiple_choice', 2, 2, 'JavaScript has several primitive data types including string, number, boolean, and others.', '{
  "options": [
    {"id": "opt1", "text": "string", "is_correct": true},
    {"id": "opt2", "text": "number", "is_correct": true},
    {"id": "opt3", "text": "boolean", "is_correct": true},
    {"id": "opt4", "text": "integer", "is_correct": false},
    {"id": "opt5", "text": "character", "is_correct": false}
  ],
  "min_selections": 1,
  "max_selections": 5,
  "partial_credit": true
}'),

-- Sequence Question
((SELECT id FROM js_quiz), 'Arrange these JavaScript concepts in order of complexity (simplest to most complex)', 'sequence', 3, 3, 'This order represents a typical learning progression in JavaScript.', '{
  "items": [
    {"id": "item1", "text": "Variables", "correct_order": 1},
    {"id": "item2", "text": "Functions", "correct_order": 2},
    {"id": "item3", "text": "Objects", "correct_order": 3},
    {"id": "item4", "text": "Promises", "correct_order": 4},
    {"id": "item5", "text": "Async/Await", "correct_order": 5}
  ],
  "scoring": "partial",
  "shuffle_items": true
}'),

-- Drag Word Question
((SELECT id FROM js_quiz), 'Complete the JavaScript function: "function __BLANK1__(a, b) { __BLANK2__ a + b; }"', 'drag_word', 4, 2, 'This creates a simple function that adds two numbers and returns the result.', '{
  "sentence_template": "function __BLANK1__(a, b) { __BLANK2__ a + b; }",
  "blanks": [
    {"id": "BLANK1", "position": 1, "correct_answers": ["add", "sum"]},
    {"id": "BLANK2", "position": 2, "correct_answers": ["return"]}
  ],
  "word_bank": [
    {"id": "word1", "text": "add"},
    {"id": "word2", "text": "sum"},
    {"id": "word3", "text": "return"},
    {"id": "word4", "text": "console.log"},
    {"id": "word5", "text": "var"},
    {"id": "word6", "text": "function"}
  ],
  "allow_reuse": false,
  "case_sensitive": false
}');

-- Sample Questions for Solar System Quiz
WITH science_quiz AS (SELECT id FROM quizzes WHERE slug = 'solar-system-explorer')

INSERT INTO questions (quiz_id, question_text, question_type, question_order, points, explanation, question_data) VALUES

-- Single Choice Question
((SELECT id FROM science_quiz), 'What is the largest planet in our solar system?', 'single_choice', 1, 1, 'Jupiter is the largest planet, with a mass greater than all other planets combined.', '{
  "options": [
    {"id": "opt1", "text": "Jupiter", "is_correct": true},
    {"id": "opt2", "text": "Saturn", "is_correct": false},
    {"id": "opt3", "text": "Earth", "is_correct": false},
    {"id": "opt4", "text": "Mars", "is_correct": false}
  ]
}'),

-- Drag Word Categorization
((SELECT id FROM science_quiz), 'Categorize these celestial bodies by type', 'drag_word', 2, 3, 'Understanding the different types of celestial bodies in our solar system.', '{
  "drag_zones": [
    {"id": "planets", "label": "Planets", "correct_items": ["earth", "mars", "jupiter"]},
    {"id": "moons", "label": "Moons", "correct_items": ["luna", "europa", "titan"]},
    {"id": "stars", "label": "Stars", "correct_items": ["sun", "proxima"]}
  ],
  "draggable_items": [
    {"id": "earth", "text": "Earth"},
    {"id": "mars", "text": "Mars"},
    {"id": "jupiter", "text": "Jupiter"},
    {"id": "luna", "text": "Luna (Moon)"},
    {"id": "europa", "text": "Europa"},
    {"id": "titan", "text": "Titan"},
    {"id": "sun", "text": "Sun"},
    {"id": "proxima", "text": "Proxima Centauri"}
  ],
  "allow_multiple_per_zone": true,
  "shuffle_items": true
}');

-- Sample Questions for Geography Quiz
WITH geo_quiz AS (SELECT id FROM quizzes WHERE slug = 'world-capitals-challenge')

INSERT INTO questions (quiz_id, question_text, question_type, question_order, points, explanation, question_data) VALUES

-- Single Choice Question
((SELECT id FROM geo_quiz), 'What is the capital of Japan?', 'single_choice', 1, 1, 'Tokyo has been the capital of Japan since 1868.', '{
  "options": [
    {"id": "opt1", "text": "Tokyo", "is_correct": true},
    {"id": "opt2", "text": "Osaka", "is_correct": false},
    {"id": "opt3", "text": "Kyoto", "is_correct": false},
    {"id": "opt4", "text": "Hiroshima", "is_correct": false}
  ]
}'),

-- Multiple Choice Question
((SELECT id FROM geo_quiz), 'Which of these countries are in Europe? (Select all that apply)', 'multiple_choice', 2, 2, 'These are all European countries with rich histories and cultures.', '{
  "options": [
    {"id": "opt1", "text": "France", "is_correct": true},
    {"id": "opt2", "text": "Germany", "is_correct": true},
    {"id": "opt3", "text": "Italy", "is_correct": true},
    {"id": "opt4", "text": "Australia", "is_correct": false},
    {"id": "opt5", "text": "Brazil", "is_correct": false}
  ],
  "min_selections": 1,
  "max_selections": 5,
  "partial_credit": true
}');

-- Sample Questions for History Quiz
WITH history_quiz AS (SELECT id FROM quizzes WHERE slug = 'historical-timeline')

INSERT INTO questions (quiz_id, question_text, question_type, question_order, points, explanation, question_data) VALUES

-- Sequence Question
((SELECT id FROM history_quiz), 'Arrange these historical events in chronological order (earliest to latest)', 'sequence', 1, 4, 'These events span centuries of human history and technological advancement.', '{
  "items": [
    {"id": "event1", "text": "World War I ends", "correct_order": 1},
    {"id": "event2", "text": "World War II begins", "correct_order": 2},
    {"id": "event3", "text": "Moon landing", "correct_order": 3},
    {"id": "event4", "text": "Internet becomes public", "correct_order": 4},
    {"id": "event5", "text": "COVID-19 pandemic starts", "correct_order": 5}
  ],
  "scoring": "partial",
  "shuffle_items": true
}');

-- Create indexes for better performance
CREATE INDEX idx_quizzes_category_id ON quizzes(category_id);
CREATE INDEX idx_quizzes_slug ON quizzes(slug);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(quiz_id, question_order);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_user_answers_attempt_id ON user_answers(attempt_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Everyone can read published quizzes and categories
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read published quizzes" ON quizzes FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can read questions for published quizzes" ON questions FOR SELECT USING (
  quiz_id IN (SELECT id FROM quizzes WHERE is_published = true)
);

-- Users can manage their own quiz attempts and answers
CREATE POLICY "Users can manage own attempts" ON quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own answers" ON user_answers FOR ALL USING (
  attempt_id IN (SELECT id FROM quiz_attempts WHERE user_id = auth.uid())
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Summary
SELECT 'Database setup completed successfully!' as status,
       (SELECT COUNT(*) FROM categories) as categories_count,
       (SELECT COUNT(*) FROM quizzes) as quizzes_count,
       (SELECT COUNT(*) FROM questions) as questions_count,
       (SELECT COUNT(*) FROM users) as sample_users_count;
