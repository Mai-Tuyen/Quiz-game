# Quiz website PRD with ReactJS and Supabase

_Exported on 9/15/2025 at 10:03:20 GMT+7 from Cursor (1.5.11)_

---

**User**

im a reactJs developer. i'm going to create a small quiz website. I want using reactjs and supabase. Give me a full PRD

- First screen

* Header with logo
* Quizz list group by topic (life, coding, animal,...)
* Copyright

- Detail a quiz

* Left: Quiz content (question & answer), next and back
* Right: Matrix number, timer (web socket show timer), submit button

- Result screen:

* Show scrore/ max score
* Fireworks if correct 100%
* Matrix preview result for each question

- Question type support: Single choice, multiple choice, sequence, drag the word
- I want login with google by subabase

---

**Cursor**

I'll create a comprehensive Product Requirements Document (PRD) for your ReactJS Quiz Website with Supabase. Let me structure this professionally for you.

# Quiz Website - Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Product Vision

A modern, interactive quiz platform that allows users to test their knowledge across various topics with real-time features and engaging user experience.

### 1.2 Target Audience

- Students and professionals looking to test their knowledge
- Casual users interested in entertainment quizzes
- Educational institutions for assessments

### 1.3 Key Success Metrics

#### 1.3.1 User Engagement

- User engagement rate
- Quiz completion rate
- User retention
- Time spent on platform

#### 1.3.2 SEO & Growth Metrics

- **Organic search traffic**: 60%+ of total traffic from search engines
- **Search rankings**: Top 10 positions for target keywords
- **Core Web Vitals**: Pass all Core Web Vitals assessments
- **Click-through rate (CTR)**: >3% average CTR from search results
- **Organic conversion rate**: >15% of organic visitors complete a quiz
- **Page indexation**: 95%+ of published pages indexed by Google
- **Backlink profile**: Acquire 50+ quality backlinks within 6 months

## 2. Technical Stack

### 2.1 Frontend

- **Framework**: NextJS (with App Router for better SEO)
- **State Management**: Tanstack query and Zustand
- **Animation**: Framer Motion (for fireworks and transitions)
- **WebSocket**: Socket.io-client (for real-time timer)
- **UI Library**: Shadcn UI and Tailwind Css
- **SEO**: Next-SEO for meta tags management
- **Sitemap**: next-sitemap for automatic sitemap generation
- **Analytics**: Google Analytics 4 (gtag) and Google Search Console
- **Schema.org**: JSON-LD structured data for rich snippets

### 2.2 Backend & Database

- **BaaS**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for images/media)

### 2.3 Additional Libraries

- **UI Components**: React DnD (drag and drop)
- **Animations**: React Confetti (fireworks effect)
- **Icons**: React Icons or Heroicons
- **Forms**: React Hook Form
- **Date/Time**: date-fns

## 3. Functional Requirements

### 3.1 Authentication System

- **Google OAuth Integration** via Supabase Auth
- Automatic user profile creation
- Session management
- Protected routes for authenticated users

### 3.2 Home Screen (Quiz Discovery)

#### 3.2.1 Header Component

- **Logo**: Clickable brand logo (left side)
- **Navigation**: Home, Profile, History
- **User Menu**: Avatar, Sign out option
- **Responsive**: Mobile-friendly hamburger menu

#### 3.2.2 Quiz Categories

- **Topics**: Life, Coding, Animals, Science, History, Sports, etc.
- **Display**: Card-based layout with category icons
- **Filtering**: Search functionality
- **Sorting**: By popularity, difficulty, recent
- **Quiz Preview**: Number of questions, estimated time, difficulty level

#### 3.2.3 Footer

- **Copyright**: © 2025 Quiz Website. All rights reserved.
- **Links**: Privacy Policy, Terms of Service, Contact

### 3.3 Quiz Detail Screen

#### 3.3.1 Left Panel - Quiz Content

- **Question Display**:
  - Question text with rich formatting support
  - Question counter (e.g., "Question 3 of 10")
  - Progress bar
- **Answer Options**: Based on question type
- **Navigation**:
  - Previous/Next buttons
  - Mark for review option
  - Jump to specific question via matrix

#### 3.3.2 Right Panel - Quiz Controls

- **Question Matrix**:
  - Grid showing all questions (1-N)
  - Color coding: Answered (green), Current (blue), Unanswered (gray), Marked (yellow)
  - Clickable for navigation
- **Timer**:
  - Real-time countdown using WebSocket
  - Visual progress (circular or linear)
  - Warning when time is low (last 10% of time)
- **Submit Button**:
  - Always visible
  - Confirmation dialog before submission

#### 3.3.3 Question Types Support

**Single Choice Questions**

```
Question: What is the capital of France?
○ London
○ Berlin
○ Paris
○ Madrid
```

**Multiple Choice Questions**

```
Question: Which are programming languages? (Select all that apply)
☐ JavaScript
☐ Python
☐ HTML
☐ Java
```

**Sequence Questions**

```
Question: Arrange these events in chronological order:
[Draggable items: "World War II", "Moon Landing", "Internet Invention", "COVID-19"]
```

**Drag the Word Questions**

```
Question: Complete the sentence by dragging the correct words:
"The [DRAG_ZONE] is the largest [DRAG_ZONE] in the solar system."
Available words: [Jupiter] [planet] [star] [Earth]
```

### 3.4 Results Screen

#### 3.4.1 Score Display

- **Main Score**: Large, prominent display (e.g., "8/10")
- **Percentage**: Calculated score percentage
- **Performance Message**: Contextual feedback based on score
- **Time Taken**: Total time spent on quiz

#### 3.4.2 Fireworks Animation

- **Trigger**: Activate when score = 100%
- **Duration**: 3-5 seconds
- **Style**: Colorful confetti animation
- **Sound**: Optional congratulatory sound effect

#### 3.4.3 Question Review Matrix

- **Grid Layout**: All questions with results
- **Color Coding**:
  - Green: Correct answers
  - Red: Incorrect answers
  - Gray: Skipped questions
- **Detailed Review**: Click to see correct answers and explanations
- **Share Results**: Social media sharing options

## 4. Database Schema (Supabase)

**Simplified 6-Table Design:**

1. **users** - User accounts and authentication
2. **categories** - Quiz categories (Programming, Science, etc.)
3. **quizzes** - Quiz metadata and settings
4. **questions** - All question types with unified JSONB format
5. **quiz_attempts** - User quiz sessions and scores
6. **user_answers** - Individual question responses

> ✅ **Key Change**: Removed `question_options` table - all question data now stored in `questions.question_data` JSONB field for consistency across all question types.

### 4.1 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  google_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 Quizzes Table

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL, -- For SEO-friendly URLs
  description TEXT,
  category_id UUID REFERENCES categories(id),
  time_limit INTEGER, -- in minutes
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.4 Questions Table

```sql
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
```

### 4.5 Quiz Attempts Table

```sql
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
```

### 4.6 User Answers Table

```sql
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_options JSONB, -- Store array of selected option IDs
  is_correct BOOLEAN,
  answered_at TIMESTAMP DEFAULT NOW()
);
```

## 5. Complex Question Types - Database Examples

### 5.1 Sequence Question Example

**Question**: "Arrange these programming concepts in order of complexity (simplest to most complex)"

**Database Storage:**

```sql
-- In questions table
INSERT INTO questions (
  quiz_id,
  question_text,
  question_type,
  question_order,
  question_data
) VALUES (
  'quiz-uuid',
  'Arrange these programming concepts in order of complexity (simplest to most complex)',
  'sequence',
  1,
  '{
    "items": [
      {"id": "item1", "text": "Variables", "correct_order": 1},
      {"id": "item2", "text": "Functions", "correct_order": 2},
      {"id": "item3", "text": "Classes", "correct_order": 3},
      {"id": "item4", "text": "Design Patterns", "correct_order": 4}
    ],
    "scoring": "partial" // "all_or_nothing" or "partial"
  }'
);

-- User answer storage in user_answers table
INSERT INTO user_answers (
  attempt_id,
  question_id,
  selected_options,
  is_correct
) VALUES (
  'attempt-uuid',
  'question-uuid',
  '{
    "user_sequence": [
      {"id": "item1", "position": 1},
      {"id": "item2", "position": 2},
      {"id": "item3", "position": 3},
      {"id": "item4", "position": 4}
    ]
  }',
  true
);
```

### 5.2 Drag Word Question Example

**Question**: "Complete the sentence by dragging the correct words to the blanks"

**Database Storage:**

```sql
-- In questions table
INSERT INTO questions (
  quiz_id,
  question_text,
  question_type,
  question_order,
  question_data
) VALUES (
  'quiz-uuid',
  'Complete the sentence: "The __BLANK1__ is the largest __BLANK2__ in our solar system."',
  'drag_word',
  2,
  '{
    "sentence_template": "The __BLANK1__ is the largest __BLANK2__ in our solar system.",
    "blanks": [
      {
        "id": "BLANK1",
        "correct_answers": ["Sun"],
        "position": 1
      },
      {
        "id": "BLANK2",
        "correct_answers": ["star"],
        "position": 2
      }
    ],
    "word_bank": [
      {"id": "word1", "text": "Sun"},
      {"id": "word2", "text": "star"},
      {"id": "word3", "text": "planet"},
      {"id": "word4", "text": "Moon"},
      {"id": "word5", "text": "asteroid"}
    ],
    "allow_reuse": false
  }'
);

-- User answer storage
INSERT INTO user_answers (
  attempt_id,
  question_id,
  selected_options,
  is_correct
) VALUES (
  'attempt-uuid',
  'question-uuid',
  '{
    "answers": [
      {"blank_id": "BLANK1", "word_id": "word1", "word_text": "Sun"},
      {"blank_id": "BLANK2", "word_id": "word2", "word_text": "star"}
    ]
  }',
  true
);
```

### 5.3 Multiple Drag Zones Example (Complex)

**Question**: "Categorize these animals into their correct habitats"

```sql
-- In questions table
INSERT INTO questions (
  quiz_id,
  question_text,
  question_type,
  question_order,
  question_data
) VALUES (
  'quiz-uuid',
  'Drag each animal to its correct habitat',
  'drag_word',
  3,
  '{
    "drag_zones": [
      {
        "id": "ocean",
        "label": "Ocean Animals",
        "correct_items": ["whale", "shark", "dolphin"]
      },
      {
        "id": "forest",
        "label": "Forest Animals",
        "correct_items": ["bear", "deer", "owl"]
      },
      {
        "id": "desert",
        "label": "Desert Animals",
        "correct_items": ["camel", "lizard", "snake"]
      }
    ],
    "draggable_items": [
      {"id": "whale", "text": "Whale"},
      {"id": "bear", "text": "Bear"},
      {"id": "camel", "text": "Camel"},
      {"id": "shark", "text": "Shark"},
      {"id": "deer", "text": "Deer"},
      {"id": "lizard", "text": "Lizard"},
      {"id": "dolphin", "text": "Dolphin"},
      {"id": "owl", "text": "Owl"},
      {"id": "snake", "text": "Snake"}
    ]
  }'
);

-- User answer storage
INSERT INTO user_answers (
  attempt_id,
  question_id,
  selected_options,
  is_correct
) VALUES (
  'attempt-uuid',
  'question-uuid',
  '{
    "zone_assignments": [
      {"item_id": "whale", "zone_id": "ocean"},
      {"item_id": "bear", "zone_id": "forest"},
      {"item_id": "camel", "zone_id": "desert"},
      {"item_id": "shark", "zone_id": "ocean"},
      {"item_id": "deer", "zone_id": "forest"},
      {"item_id": "lizard", "zone_id": "desert"},
      {"item_id": "dolphin", "zone_id": "ocean"},
      {"item_id": "owl", "zone_id": "forest"},
      {"item_id": "snake", "zone_id": "desert"}
    ]
  }',
  true
);
```

### 5.4 Single Choice Question Example (Unified Format)

**Question**: "What is the capital of France?"

```sql
-- In questions table
INSERT INTO questions (
  quiz_id,
  question_text,
  question_type,
  question_order,
  question_data
) VALUES (
  'quiz-uuid',
  'What is the capital of France?',
  'single_choice',
  1,
  '{
    "options": [
      {"id": "opt1", "text": "London", "is_correct": false},
      {"id": "opt2", "text": "Berlin", "is_correct": false},
      {"id": "opt3", "text": "Paris", "is_correct": true},
      {"id": "opt4", "text": "Madrid", "is_correct": false}
    ]
  }'
);

-- User answer
INSERT INTO user_answers (
  attempt_id,
  question_id,
  selected_options,
  is_correct
) VALUES (
  'attempt-uuid',
  'question-uuid',
  '{"selected": ["opt3"]}',
  true
);
```

### 5.5 Multiple Choice Question Example (Unified Format)

**Question**: "Which are programming languages? (Select all that apply)"

```sql
-- In questions table
INSERT INTO questions (
  quiz_id,
  question_text,
  question_type,
  question_order,
  question_data
) VALUES (
  'quiz-uuid',
  'Which are programming languages? (Select all that apply)',
  'multiple_choice',
  2,
  '{
    "options": [
      {"id": "opt1", "text": "JavaScript", "is_correct": true},
      {"id": "opt2", "text": "Python", "is_correct": true},
      {"id": "opt3", "text": "HTML", "is_correct": false},
      {"id": "opt4", "text": "Java", "is_correct": true}
    ],
    "min_selections": 1,
    "max_selections": 4
  }'
);

-- User answer (multiple selections)
INSERT INTO user_answers (
  attempt_id,
  question_id,
  selected_options,
  is_correct
) VALUES (
  'attempt-uuid',
  'question-uuid',
  '{"selected": ["opt1", "opt2", "opt4"]}',
  true
);
```

## 5.6 Unified Question Format Summary

**All question types now use the same database structure:**

### Database Schema (Simplified)

- ✅ **questions table**: Contains `question_data` JSONB field for all question types
- ❌ **question_options table**: REMOVED - no longer needed
- ✅ **user_answers table**: Uses `selected_options` JSONB for all answer types

### Question Format Pattern

```sql
question_data: {
  // For single/multiple choice
  "options": [{"id": "opt1", "text": "...", "is_correct": true}],

  // For sequence
  "items": [{"id": "item1", "text": "...", "correct_order": 1}],

  // For drag-word
  "word_bank": [{"id": "word1", "text": "..."}],
  "blanks": [{"id": "BLANK1", "correct_answers": ["..."]}]
}
```

### User Answer Pattern

```sql
selected_options: {
  // Single/Multiple choice
  "selected": ["opt1", "opt2"],

  // Sequence
  "user_sequence": [{"id": "item1", "position": 1}],

  // Drag-word
  "answers": [{"blank_id": "BLANK1", "word_id": "word1"}]
}
```

**Benefits:**

- ✅ **Consistent API**: Same data structure for all question types
- ✅ **Simpler Schema**: One table instead of two
- ✅ **Flexible**: Easy to add new question types
- ✅ **No Joins**: Better performance, no complex queries

## 5.7 Complete Examples: Creating All 4 Question Types

### Example 1: Single Choice Question

**Topic**: Geography Quiz
**Question**: "What is the capital of Japan?"

```sql
INSERT INTO questions (
  id,
  quiz_id,
  question_text,
  question_type,
  question_order,
  points,
  explanation,
  question_data
) VALUES (
  gen_random_uuid(),
  'your-quiz-uuid-here',
  'What is the capital of Japan?',
  'single_choice',
  1,
  1,
  'Tokyo has been the capital of Japan since 1868.',
  '{
    "options": [
      {
        "id": "opt_1",
        "text": "Tokyo",
        "is_correct": true
      },
      {
        "id": "opt_2",
        "text": "Osaka",
        "is_correct": false
      },
      {
        "id": "opt_3",
        "text": "Kyoto",
        "is_correct": false
      },
      {
        "id": "opt_4",
        "text": "Hiroshima",
        "is_correct": false
      }
    ]
  }'
);
```

### Example 2: Multiple Choice Question

**Topic**: Programming Quiz
**Question**: "Which of the following are JavaScript frameworks? (Select all that apply)"

```sql
INSERT INTO questions (
  id,
  quiz_id,
  question_text,
  question_type,
  question_order,
  points,
  explanation,
  question_data
) VALUES (
  gen_random_uuid(),
  'your-quiz-uuid-here',
  'Which of the following are JavaScript frameworks? (Select all that apply)',
  'multiple_choice',
  2,
  2,
  'React, Vue, and Angular are all popular JavaScript frameworks used for building user interfaces.',
  '{
    "options": [
      {
        "id": "opt_1",
        "text": "React",
        "is_correct": true
      },
      {
        "id": "opt_2",
        "text": "Vue",
        "is_correct": true
      },
      {
        "id": "opt_3",
        "text": "Angular",
        "is_correct": true
      },
      {
        "id": "opt_4",
        "text": "Python",
        "is_correct": false
      },
      {
        "id": "opt_5",
        "text": "MySQL",
        "is_correct": false
      }
    ],
    "min_selections": 1,
    "max_selections": 5,
    "partial_credit": true
  }'
);
```

### Example 3: Sequence Question

**Topic**: History Quiz
**Question**: "Arrange these historical events in chronological order (earliest to latest)"

```sql
INSERT INTO questions (
  id,
  quiz_id,
  question_text,
  question_type,
  question_order,
  points,
  explanation,
  question_data
) VALUES (
  gen_random_uuid(),
  'your-quiz-uuid-here',
  'Arrange these historical events in chronological order (earliest to latest)',
  'sequence',
  3,
  3,
  'The correct chronological order reflects major milestones in human history.',
  '{
    "items": [
      {
        "id": "event_1",
        "text": "World War I ends",
        "correct_order": 1
      },
      {
        "id": "event_2",
        "text": "World War II begins",
        "correct_order": 2
      },
      {
        "id": "event_3",
        "text": "Moon landing",
        "correct_order": 3
      },
      {
        "id": "event_4",
        "text": "Internet becomes public",
        "correct_order": 4
      },
      {
        "id": "event_5",
        "text": "COVID-19 pandemic starts",
        "correct_order": 5
      }
    ],
    "scoring": "partial",
    "shuffle_items": true
  }'
);
```

### Example 4: Drag Word Question (Fill in the blanks)

**Topic**: Science Quiz
**Question**: "Complete the sentence about our solar system"

```sql
INSERT INTO questions (
  id,
  quiz_id,
  question_text,
  question_type,
  question_order,
  points,
  explanation,
  question_data
) VALUES (
  gen_random_uuid(),
  'your-quiz-uuid-here',
  'Complete the sentence: "The __BLANK1__ is the largest __BLANK2__ in our solar system, and __BLANK3__ is the closest planet to it."',
  'drag_word',
  4,
  3,
  'The Sun is our solar system''s star, and Mercury is the planet closest to it.',
  '{
    "sentence_template": "The __BLANK1__ is the largest __BLANK2__ in our solar system, and __BLANK3__ is the closest planet to it.",
    "blanks": [
      {
        "id": "BLANK1",
        "position": 1,
        "correct_answers": ["Sun"]
      },
      {
        "id": "BLANK2",
        "position": 2,
        "correct_answers": ["star"]
      },
      {
        "id": "BLANK3",
        "position": 3,
        "correct_answers": ["Mercury"]
      }
    ],
    "word_bank": [
      {
        "id": "word_1",
        "text": "Sun"
      },
      {
        "id": "word_2",
        "text": "Moon"
      },
      {
        "id": "word_3",
        "text": "star"
      },
      {
        "id": "word_4",
        "text": "planet"
      },
      {
        "id": "word_5",
        "text": "Mercury"
      },
      {
        "id": "word_6",
        "text": "Earth"
      },
      {
        "id": "word_7",
        "text": "asteroid"
      }
    ],
    "allow_reuse": false,
    "case_sensitive": false
  }'
);
```

### Example 5: Drag Word Question (Categorization)

**Topic**: Animal Quiz  
**Question**: "Drag each animal to its correct habitat"

```sql
INSERT INTO questions (
  id,
  quiz_id,
  question_text,
  question_type,
  question_order,
  points,
  explanation,
  question_data
) VALUES (
  gen_random_uuid(),
  'your-quiz-uuid-here',
  'Drag each animal to its correct habitat',
  'drag_word',
  5,
  4,
  'Animals are adapted to live in specific environments that provide their basic needs.',
  '{
    "drag_zones": [
      {
        "id": "ocean",
        "label": "Ocean Animals",
        "correct_items": ["whale", "shark", "dolphin", "octopus"]
      },
      {
        "id": "forest",
        "label": "Forest Animals",
        "correct_items": ["bear", "deer", "owl", "squirrel"]
      },
      {
        "id": "desert",
        "label": "Desert Animals",
        "correct_items": ["camel", "lizard", "snake", "scorpion"]
      }
    ],
    "draggable_items": [
      {"id": "whale", "text": "Whale"},
      {"id": "bear", "text": "Bear"},
      {"id": "camel", "text": "Camel"},
      {"id": "shark", "text": "Shark"},
      {"id": "deer", "text": "Deer"},
      {"id": "lizard", "text": "Lizard"},
      {"id": "dolphin", "text": "Dolphin"},
      {"id": "owl", "text": "Owl"},
      {"id": "snake", "text": "Snake"},
      {"id": "octopus", "text": "Octopus"},
      {"id": "squirrel", "text": "Squirrel"},
      {"id": "scorpion", "text": "Scorpion"}
    ],
    "allow_multiple_per_zone": true,
    "shuffle_items": true
  }'
);
```

### Quick Reference: Question Data Structure

```javascript
// Single Choice & Multiple Choice
{
  "options": [
    {"id": "opt_1", "text": "Option text", "is_correct": true}
  ],
  "min_selections": 1,    // Multiple choice only
  "max_selections": 3     // Multiple choice only
}

// Sequence
{
  "items": [
    {"id": "item_1", "text": "Item text", "correct_order": 1}
  ],
  "scoring": "partial",   // or "all_or_nothing"
  "shuffle_items": true
}

// Drag Word (Fill in blanks)
{
  "sentence_template": "Text with __BLANK1__ placeholders",
  "blanks": [
    {"id": "BLANK1", "correct_answers": ["answer1", "answer2"]}
  ],
  "word_bank": [
    {"id": "word_1", "text": "Word text"}
  ],
  "allow_reuse": false
}

// Drag Word (Categorization)
{
  "drag_zones": [
    {"id": "zone1", "label": "Zone Name", "correct_items": ["item1"]}
  ],
  "draggable_items": [
    {"id": "item1", "text": "Item text"}
  ]
}
```

## 6. API Endpoints (Supabase Functions)

### 6.1 Authentication

- `POST /auth/google` - Google OAuth login
- `POST /auth/logout` - User logout
- `GET /auth/user` - Get current user

### 6.2 Quiz Management

- `GET /api/categories` - Get all categories
- `GET /api/quizzes?category=` - Get quizzes by category
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/start` - Start quiz attempt
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### 6.3 Real-time Features

- `WebSocket /quiz/:attemptId` - Real-time timer updates

## 7. User Experience (UX) Requirements

### 7.1 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Touch Friendly**: Large touch targets for mobile

### 7.2 Performance

- **Loading Time**: <3 seconds initial load
- **Quiz Navigation**: Instant navigation between questions
- **Image Optimization**: Lazy loading for quiz images

### 7.3 Accessibility

- **WCAG 2.1 AA Compliance**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Color Contrast**: Minimum 4.5:1 ratio

## 7. Security Requirements

### 7.1 Authentication

- Secure Google OAuth implementation
- JWT token management
- Session timeout handling

### 7.2 Data Protection

- Input validation and sanitization
- XSS protection
- SQL injection prevention (handled by Supabase)
- Rate limiting on API calls

## 8. SEO Requirements (Simplified)

### 8.1 Basic SEO Setup

- **SEO-friendly URLs**: Use slugs for categories and quizzes (`/category/programming`, `/quiz/javascript-basics`)
- **Meta tags**: Dynamic titles and descriptions for each page
- **Sitemap**: Auto-generated XML sitemap using next-sitemap
- **Performance**: Fast loading with Next.js built-in optimizations

### 8.2 Essential Features

- **Open Graph**: Basic social media sharing tags
- **Mobile responsive**: Works well on all devices
- **Clean URLs**: No unnecessary parameters

## 9. Development Phases

### Phase 1 (MVP - 4 weeks)

- Basic authentication with Google
- Home screen with quiz categories
- Single choice question type
- Basic quiz taking functionality
- Simple results screen
- **SEO Foundation**: Basic meta tags, sitemap setup, robots.txt

### Phase 2 (2 weeks)

- Multiple choice questions
- Enhanced UI/UX
- Question matrix navigation
- Timer functionality
- **SEO Enhancement**: Dynamic meta tags, Open Graph tags, structured data

### Phase 3 (2 weeks)

- Sequence and drag-word questions
- Fireworks animation
- Real-time timer with WebSocket
- Performance optimizations
- **SEO Advanced**: Core Web Vitals optimization, internal linking

### Phase 4 (1 week)

- Admin panel for quiz creation
- Analytics and reporting
- Social sharing features
- **SEO Analytics**: Google Analytics 4, Search Console integration

### Phase 5 (SEO Optimization - 1 week)

- **Content SEO**: Rich descriptions, FAQ sections
- **Technical SEO**: Schema.org implementation, breadcrumbs
- **Performance**: Image optimization, lazy loading, CDN setup
- **Monitoring**: SEO tracking tools, Core Web Vitals monitoring

## 9. File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── LoadingSpinner.jsx
│   ├── quiz/
│   │   ├── QuizCard.jsx
│   │   ├── QuestionDisplay.jsx
│   │   ├── QuestionMatrix.jsx
│   │   ├── Timer.jsx
│   │   └── AnswerOptions/
│   │       ├── SingleChoice.jsx
│   │       ├── MultipleChoice.jsx
│   │       ├── SequenceQuestion.jsx
│   │       └── DragWordQuestion.jsx
│   └── results/
│       ├── ScoreDisplay.jsx
│       ├── Fireworks.jsx
│       └── ReviewMatrix.jsx
├── pages/
│   ├── Home.jsx
│   ├── QuizDetail.jsx
│   ├── Results.jsx
│   └── Login.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useQuiz.js
│   └── useTimer.js
├── services/
│   ├── supabase.js
│   ├── auth.js
│   └── quiz.js
├── utils/
│   ├── constants.js
│   └── helpers.js
└── styles/
    └── index.css
```

## 10. Success Criteria

### 10.1 Technical

- 99% uptime
- <3 second load times
- Mobile responsive across all devices
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### 10.2 User Experience

- Intuitive navigation
- Smooth animations and transitions
- Clear feedback for all user actions
- Accessible to users with disabilities

### 10.3 Business

- User engagement: >70% quiz completion rate
- Return users: >30% within 7 days
- Performance: <5% bounce rate on quiz pages

### 10.4 SEO Success Criteria

- **Fast loading**: <3 seconds page load time
- **Good search rankings**: Appear in Google search results for quiz topics
- **Mobile friendly**: Works well on mobile devices

## 11. Conclusion

This comprehensive PRD provides a complete foundation for building your ReactJS quiz website with Supabase. The key highlights include:

### ✅ **Simplified Database Design**

- **6 tables only**: Clean, maintainable schema
- **Unified question format**: All question types use JSONB for consistency
- **No complex joins**: Better performance and simpler queries

### ✅ **Flexible Question System**

- **4 question types**: Single choice, multiple choice, sequence, drag-word
- **Extensible design**: Easy to add new question types without schema changes
- **Rich examples**: Ready-to-use SQL examples for all question types

### ✅ **Modern Tech Stack**

- **NextJS**: SEO-friendly React framework
- **Supabase**: Complete backend-as-a-service
- **Tailwind + Shadcn**: Modern, responsive UI
- **TypeScript**: Type-safe development

### ✅ **Essential Features**

- **Google OAuth**: Seamless authentication
- **Real-time timers**: Live quiz experience
- **Responsive design**: Works on all devices
- **SEO optimized**: Search engine friendly

### 🚀 **Ready for Development**

The PRD includes everything needed to start development immediately:

- Complete database schema with examples
- Detailed functional requirements
- Technical specifications
- Development phases and timeline

This simplified approach ensures faster development, easier maintenance, and better scalability while delivering all the core features needed for a successful quiz platform.
