# Database Setup Guide

This guide will help you set up your Supabase database with all tables and sample data.

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Environment Variables**: Set up your Supabase credentials

## Step 1: Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

## Step 2: Create Environment File

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Step 3: Setup Database (Choose One Method)

### Method 1: Manual SQL (Recommended)

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Create a new query
4. Copy the entire contents of `scripts/setup-database.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute

### Method 2: Automated Script

```bash
# Install dependencies (if not already done)
npm install

# Install tsx for running TypeScript
npm install -g tsx

# Run the setup script
npx tsx scripts/setup-database.ts
```

## Step 4: Verify Setup

After running the setup, you should have:

### Tables Created:

- ✅ **users** (3 sample users)
- ✅ **categories** (5 categories: Programming, Science, Geography, History, Animals)
- ✅ **quizzes** (5 sample quizzes)
- ✅ **questions** (Multiple questions of all 4 types)
- ✅ **quiz_attempts** (empty, ready for user attempts)
- ✅ **user_answers** (empty, ready for user answers)

### Sample Data Includes:

- **5 Categories**: Programming, Science, Geography, History, Animals
- **5 Quizzes**: JavaScript Fundamentals, React Basics, Solar System, World Capitals, Historical Timeline
- **Multiple Questions**: Examples of all 4 question types (single choice, multiple choice, sequence, drag-word)

## Step 5: Test Connection

Start your development server:

```bash
npm run dev
```

Your app should now connect to Supabase and display the sample quizzes!

## Troubleshooting

### Connection Issues

- Double-check your `.env.local` file has the correct URLs and keys
- Make sure your Supabase project is active
- Restart your Next.js server after adding environment variables

### SQL Errors

- Run the SQL script manually in the Supabase SQL Editor
- Check for any error messages in the SQL Editor
- Make sure you have the correct permissions

### Missing Data

- Verify the INSERT statements ran successfully
- Check the Supabase Table Editor to see if data was inserted
- Re-run the sample data portions of the SQL script

## Next Steps

Once your database is set up:

1. **Authentication**: Set up Google OAuth in Supabase Auth settings
2. **Storage**: Configure file storage for quiz images (optional)
3. **Deploy**: Deploy your app to Vercel or your preferred platform

## Database Schema Overview

```
users
├── id (UUID, Primary Key)
├── email (VARCHAR, Unique)
├── full_name (VARCHAR)
├── avatar_url (VARCHAR)
└── google_id (VARCHAR, Unique)

categories
├── id (UUID, Primary Key)
├── name (VARCHAR)
├── slug (VARCHAR, Unique)
├── description (TEXT)
└── icon_url (VARCHAR)

quizzes
├── id (UUID, Primary Key)
├── title (VARCHAR)
├── slug (VARCHAR, Unique)
├── description (TEXT)
├── category_id (UUID, Foreign Key)
├── time_limit (INTEGER)
├── difficulty_level (INTEGER, 1-5)
└── is_published (BOOLEAN)

questions
├── id (UUID, Primary Key)
├── quiz_id (UUID, Foreign Key)
├── question_text (TEXT)
├── question_type (VARCHAR)
├── question_order (INTEGER)
├── points (INTEGER)
├── explanation (TEXT)
└── question_data (JSONB) -- Unified format for all question types

quiz_attempts
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── quiz_id (UUID, Foreign Key)
├── start_time (TIMESTAMP)
├── end_time (TIMESTAMP)
├── score (INTEGER)
├── max_score (INTEGER)
├── is_completed (BOOLEAN)
└── time_taken (INTEGER)

user_answers
├── id (UUID, Primary Key)
├── attempt_id (UUID, Foreign Key)
├── question_id (UUID, Foreign Key)
├── selected_options (JSONB)
├── is_correct (BOOLEAN)
└── answered_at (TIMESTAMP)
```

Happy coding! 🚀
