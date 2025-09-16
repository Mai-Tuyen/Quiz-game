# Authentication Setup Guide

This project uses Supabase for authentication with Google OAuth integration.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Supabase Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication > Settings**
3. Add the following redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 3. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://your-supabase-url.supabase.co/auth/v1/callback`

### 4. Supabase Google Provider

1. In your Supabase dashboard, go to **Authentication > Providers**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)

## Features Implemented

### Login Page (`/auth/login`)

- Modern, responsive design
- Google OAuth sign-in button
- Loading states and error handling
- Automatic redirect after successful login

### Authentication Flow

- OAuth callback handling at `/auth/callback`
- Error page for failed authentication
- Session management
- Automatic redirects

### Header Component

- Dynamic authentication state
- User profile display
- Sign-out functionality
- Loading indicators

## Usage

1. Users click "Login" in the header
2. Redirected to `/auth/login`
3. Click "Continue with Google"
4. OAuth flow handled by Supabase
5. Redirected back to the application
6. User state updated throughout the app

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page component
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback handler
│   │   └── auth-code-error/
│   │       └── page.tsx          # Error page
│   └── Layout/
│       └── Header.tsx            # Updated with auth state
├── utils/
│   └── supabase/
│       ├── client.ts             # Client-side Supabase
│       └── server.ts             # Server-side Supabase
```

## Security Notes

- All authentication is handled server-side by Supabase
- Google OAuth tokens are securely exchanged
- Session management is automatic
- PKCE flow is used for enhanced security

## Troubleshooting

1. **"Invalid redirect URL"**: Ensure all redirect URLs are correctly configured in both Google Console and Supabase
2. **"Invalid client"**: Verify Google Client ID in environment variables
3. **"Error getting session"**: Check Supabase URL and keys
4. **Authentication loop**: Clear browser cookies and local storage

## Next Steps

Consider implementing:

- Protected routes middleware
- User profile page
- Role-based access control
- Email verification
- Password reset functionality
