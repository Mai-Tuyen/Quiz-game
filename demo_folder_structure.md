# Feature-Based Folder Structure for Next.js 15 Quiz Game

## Overview

This document outlines a comprehensive feature-based folder structure for a Next.js 15 application using the App Router. The structure is designed to improve maintainability, scalability, and developer experience by organizing code around business features rather than technical layers.

## Current vs. Proposed Structure

### Current Structure (Technical Layer-Based)

```
src/
├── app/                    # App Router pages
├── components/             # All components mixed together
├── lib/                    # Database utilities
└── utils/                  # General utilities
```

### Proposed Structure (Feature-Based)

```
src/
├── app/                    # App Router (Next.js convention)
├── features/               # Feature modules
├── shared/                 # Shared utilities and components
├── lib/                    # Core libraries and configurations
└── types/                  # Global TypeScript types
```

## Detailed Feature-Based Structure

```
src/
├── app/                                    # Next.js App Router
│   ├── (auth)/                            # Route group for authentication
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── ModalLogin.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   ├── (dashboard)/                       # Route group for dashboard
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── (public)/                          # Route group for public pages
│   │   ├── page.tsx                       # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── categories/
│   │   ├── page.tsx
│   │   └── [category_slug]/
│   │       └── page.tsx
│   ├── quizzes/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── result/
│   │   └── [attemptId]/
│   │       └── page.tsx
│   ├── error/
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
│
├── features/                              # Feature modules
│   ├── auth/                              # Authentication feature
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AuthButton.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── useRegister.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   └── auth.utils.ts
│   │   └── index.ts                       # Feature exports
│   │
│   ├── quiz/                              # Quiz feature
│   │   ├── components/
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuizCardSkeleton.tsx
│   │   │   ├── QuizStart.tsx
│   │   │   ├── QuestionDisplay.tsx
│   │   │   ├── QuestionMatrix.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── NavigationControls.tsx
│   │   │   └── AnswerOptions/
│   │   │       ├── SingleChoiceQuestion.tsx
│   │   │       ├── MultipleChoiceQuestion.tsx
│   │   │       ├── SequenceQuestion.tsx
│   │   │       └── DragWordQuestion.tsx
│   │   ├── hooks/
│   │   │   ├── useQuiz.ts
│   │   │   ├── useQuizAttempt.ts
│   │   │   ├── useQuizTimer.ts
│   │   │   └── useQuizNavigation.ts
│   │   ├── services/
│   │   │   ├── quiz.service.ts
│   │   │   ├── quiz.types.ts
│   │   │   └── quiz.utils.ts
│   │   ├── stores/
│   │   │   └── quiz.store.ts              # Zustand/Redux store
│   │   └── index.ts
│   │
│   ├── category/                          # Category feature
│   │   ├── components/
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CategoryCardSkeleton.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── CategoryFilter.tsx
│   │   ├── hooks/
│   │   │   ├── useCategories.ts
│   │   │   └── useCategoryQuizzes.ts
│   │   ├── services/
│   │   │   ├── category.service.ts
│   │   │   └── category.types.ts
│   │   └── index.ts
│   │
│   ├── results/                           # Results feature
│   │   ├── components/
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── QuestionReviewMatrix.tsx
│   │   │   ├── FireworksAnimation.tsx
│   │   │   ├── ResultSummary.tsx
│   │   │   └── ShareResults.tsx
│   │   ├── hooks/
│   │   │   ├── useResults.ts
│   │   │   └── useResultAnalytics.ts
│   │   ├── services/
│   │   │   ├── results.service.ts
│   │   │   └── results.types.ts
│   │   └── index.ts
│   │
│   ├── dashboard/                         # Dashboard feature
│   │   ├── components/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── RecentQuizzes.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   └── AchievementBadges.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboard.ts
│   │   │   └── useUserStats.ts
│   │   ├── services/
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.types.ts
│   │   └── index.ts
│   │
│   └── profile/                           # User profile feature
│       ├── components/
│       │   ├── ProfileCard.tsx
│       │   ├── ProfileSettings.tsx
│       │   ├── AchievementList.tsx
│       │   └── QuizHistory.tsx
│       ├── hooks/
│       │   ├── useProfile.ts
│       │   └── useProfileUpdate.ts
│       ├── services/
│       │   ├── profile.service.ts
│       │   └── profile.types.ts
│       └── index.ts
│
├── shared/                                # Shared utilities and components
│   ├── components/                        # Reusable UI components
│   │   ├── ui/                            # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── spinner.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/                        # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── common/                        # Common components
│   │   │   ├── FullPageClient.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── PageWrapper.tsx
│   │   └── home/                          # Home page specific
│   │       └── TypeQuote.tsx
│   ├── hooks/                             # Shared custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useClickOutside.ts
│   ├── utils/                             # Shared utilities
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── api.ts
│   ├── services/                          # Shared services
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── storage.ts
│   │   ├── api/
│   │   │   ├── api-client.ts
│   │   │   └── api-types.ts
│   │   └── storage/
│   │       ├── localStorage.ts
│   │       └── sessionStorage.ts
│   └── types/                             # Shared types
│       ├── common.ts
│       ├── api.ts
│       └── user.ts
│
├── lib/                                   # Core libraries and configurations
│   ├── database/                          # Database layer
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   ├── categories.ts
│   │   ├── quizzes.ts
│   │   ├── attempts.ts
│   │   └── users.ts
│   ├── auth/                              # Authentication configuration
│   │   ├── config.ts
│   │   ├── middleware.ts
│   │   └── providers.ts
│   ├── validation/                        # Validation schemas
│   │   ├── auth.schema.ts
│   │   ├── quiz.schema.ts
│   │   └── user.schema.ts
│   └── config/                            # App configuration
│       ├── env.ts
│       ├── database.ts
│       └── app.ts
│
└── types/                                 # Global TypeScript types
    ├── global.d.ts
    ├── api.d.ts
    └── database.d.ts
```

## Key Principles of Feature-Based Architecture

### 1. **Feature Isolation**

Each feature is self-contained with its own:

- Components
- Hooks
- Services
- Types
- Tests

### 2. **Clear Boundaries**

- Features communicate through well-defined interfaces
- Shared code lives in the `shared/` directory
- No direct imports between features

### 3. **Scalability**

- Easy to add new features
- Easy to remove features
- Easy to modify features independently

### 4. **Team Collaboration**

- Different teams can work on different features
- Reduced merge conflicts
- Clear ownership boundaries

## Migration Strategy

### Phase 1: Create Feature Structure

1. Create the new folder structure
2. Move existing components to appropriate features
3. Update import paths

### Phase 2: Refactor Components

1. Break down large components into smaller, focused ones
2. Extract custom hooks
3. Create feature-specific services

### Phase 3: Implement Shared Layer

1. Create shared UI components
2. Extract common utilities
3. Set up shared services

### Phase 4: Add Feature Boundaries

1. Implement feature exports through index files
2. Add proper TypeScript interfaces
3. Set up feature-specific testing

## Benefits of This Structure

### 1. **Maintainability**

- Related code is grouped together
- Easy to find and modify specific functionality
- Clear separation of concerns

### 2. **Scalability**

- New features can be added without affecting existing ones
- Large teams can work on different features simultaneously
- Easy to scale individual features

### 3. **Reusability**

- Shared components and utilities are clearly identified
- Features can be easily extracted into separate packages
- Common patterns are centralized

### 4. **Testing**

- Each feature can be tested independently
- Clear boundaries make mocking easier
- Feature-specific test utilities

### 5. **Developer Experience**

- Intuitive folder structure
- Clear import paths
- Easy onboarding for new developers

## Best Practices

### 1. **Feature Index Files**

Each feature should have an `index.ts` file that exports the public API:

```typescript
// features/quiz/index.ts
export { QuizCard } from './components/QuizCard'
export { useQuiz } from './hooks/useQuiz'
export { quizService } from './services/quiz.service'
export type { Quiz, Question } from './services/quiz.types'
```

### 2. **Import Rules**

- Features should only import from `shared/` and other features through their index files
- No direct imports between feature internals
- Use absolute imports with path mapping

### 3. **Type Safety**

- Each feature should define its own types
- Shared types go in `shared/types/`
- Global types go in `types/`

### 4. **Testing Structure**

```
features/
├── quiz/
│   ├── __tests__/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── ...
```

### 5. **Documentation**

Each feature should include:

- README.md with feature overview
- API documentation
- Usage examples

## Path Mapping Configuration

Update your `tsconfig.json` to include path mapping:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## Example Feature Implementation

### Quiz Feature Structure

```
features/quiz/
├── components/
│   ├── QuizCard.tsx           # Quiz card display
│   ├── QuizStart.tsx          # Quiz start screen
│   ├── QuestionDisplay.tsx    # Question rendering
│   └── AnswerOptions/         # Different question types
├── hooks/
│   ├── useQuiz.ts            # Quiz data management
│   ├── useQuizTimer.ts       # Timer functionality
│   └── useQuizNavigation.ts  # Navigation logic
├── services/
│   ├── quiz.service.ts       # API calls
│   ├── quiz.types.ts         # TypeScript types
│   └── quiz.utils.ts         # Utility functions
├── stores/
│   └── quiz.store.ts         # State management
└── index.ts                  # Public API exports
```

This structure provides a solid foundation for building scalable, maintainable Next.js applications with clear feature boundaries and excellent developer experience.

