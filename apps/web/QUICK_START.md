# Quick Start Guide - UnifiedHealth Web Portal

## Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Backend API running on http://localhost:4000

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd apps/web
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local if needed (default values should work for local development)
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at **http://localhost:3000**

## First Time Usage

### Access the Application
1. Open your browser to http://localhost:3000
2. You'll be redirected to the login page

### Create an Account
1. Click "Create an account" on the login page
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Password: Test@1234 (must contain uppercase, lowercase, and number)
   - Confirm Password: Test@1234
3. Accept terms and conditions
4. Click "Create account"
5. You'll be automatically logged in and redirected to the dashboard

### Explore the Dashboard
- **Dashboard** - View stats and upcoming appointments
- **Appointments** - Manage your appointments (filter by status)
- **Profile** - Edit your personal and medical information

## Key Features to Test

### 1. Authentication
- ✅ Login with credentials
- ✅ Register new account
- ✅ Automatic token refresh
- ✅ Session persistence (refresh page, you stay logged in)
- ✅ Logout functionality

### 2. Protected Routes
- ✅ Try accessing http://localhost:3000 without login (redirects to login)
- ✅ Login and access dashboard (shows dashboard)
- ✅ Logout and try to access dashboard again (redirects to login)

### 3. Forms & Validation
- ✅ Enter invalid email - see validation error
- ✅ Enter weak password - see password requirements
- ✅ Submit empty form - see field errors
- ✅ Fill valid data - form submits successfully

### 4. Navigation
- ✅ Click sidebar links - navigate between pages
- ✅ Click header navigation - highlight active page
- ✅ Use browser back/forward - navigation works

### 5. Loading States
- ✅ Forms show "Loading..." during submission
- ✅ Dashboard shows skeletons while loading data
- ✅ Buttons disable during operations

## Available Routes

### Public Routes (No authentication required)
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require authentication)
- `/` - Main dashboard
- `/appointments` - Appointments list
- `/profile` - User profile

## Common Commands

```bash
# Development
npm run dev              # Start dev server on port 3000

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run typecheck      # Run TypeScript type checking
npm run lint           # Run ESLint

# Testing (when tests are added)
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
```

## Troubleshooting

### Cannot login / API errors
**Problem**: Getting network errors or 404 errors

**Solution**:
1. Make sure backend API is running on http://localhost:4000
2. Check `.env.local` has correct API URL: `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`
3. Check browser console for detailed error messages

### Page shows "Loading..." forever
**Problem**: Authentication check stuck in loading state

**Solution**:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear localStorage
4. Refresh page
5. Try logging in again

### Redirects not working
**Problem**: After login, still on login page

**Solution**:
1. Check browser console for errors
2. Make sure API is returning correct response with tokens
3. Check localStorage has `accessToken` and `refreshToken`
4. Clear localStorage and try again

### Styles not loading
**Problem**: Page shows unstyled content

**Solution**:
1. Stop dev server (Ctrl+C)
2. Delete `.next` folder: `rm -rf .next`
3. Restart dev server: `npm run dev`

### TypeScript errors
**Problem**: Seeing type errors in IDE

**Solution**:
1. Run type check: `npm run typecheck`
2. Make sure all dependencies are installed: `npm install`
3. Restart TypeScript server in your IDE

## Project Structure Overview

```
apps/web/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── appointments/  # Appointments page
│   │   │   ├── profile/       # Profile page
│   │   │   ├── layout.tsx     # Dashboard layout (protected)
│   │   │   └── page.tsx       # Dashboard home
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── layout.tsx        # Root layout
│   │   ├── providers.tsx     # React Query provider
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts       # Authentication hooks
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # API client (Axios)
│   │   └── utils.ts        # Helper functions
│   ├── store/              # State management
│   │   └── auth.ts         # Auth store (Zustand)
│   ├── types/              # TypeScript types
│   └── middleware.ts       # Route protection
├── .env.local              # Environment variables (create this)
├── .env.local.example      # Environment template
├── package.json            # Dependencies
├── tailwind.config.js      # TailwindCSS config
├── tsconfig.json          # TypeScript config
└── next.config.js         # Next.js config
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Optional
NEXT_PUBLIC_APP_NAME=UnifiedHealth
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_VIDEO_CALLS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

## Default Test Credentials

**Note**: These depend on what's in your backend database. You'll need to:
1. Register a new account through the UI, OR
2. Use credentials created via backend seeding/testing

## API Endpoints Used

The frontend expects these endpoints to be available:

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Appointments
- `GET /api/v1/appointments` - Get appointments (with optional status filter)

### Profile
- `GET /api/v1/patients/profile` - Get user profile
- `PUT /api/v1/patients/profile` - Update user profile

## Browser DevTools Tips

### Check Authentication Status
1. Open DevTools (F12)
2. Go to Application > Local Storage > http://localhost:3000
3. Look for:
   - `accessToken` - Current JWT access token
   - `refreshToken` - Refresh token
   - `auth-storage` - Zustand persisted state

### Check API Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. See all API requests and responses

### Check Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. See error messages and logs

## Getting Help

If you encounter issues:

1. **Check the logs**
   - Browser console (F12 > Console)
   - Terminal where `npm run dev` is running

2. **Check the documentation**
   - README.md - Full documentation
   - IMPLEMENTATION_SUMMARY.md - Technical details

3. **Common issues**
   - API not running → Start backend server
   - Port 3000 in use → Kill the process or use different port
   - Dependency errors → Delete node_modules and run `npm install`

## Next Steps

After getting the application running:

1. **Explore the code**
   - Start with `src/app/login/page.tsx` - See how auth works
   - Check `src/lib/api.ts` - Understand API client
   - Review `src/hooks/useAuth.ts` - Learn authentication hooks

2. **Make changes**
   - Edit a page and see hot reload in action
   - Modify styles in components
   - Add new fields to forms

3. **Add features**
   - Create new pages
   - Add more dashboard widgets
   - Implement additional forms

4. **Test integration**
   - Connect to your backend API
   - Test all API endpoints
   - Verify token refresh works

## Success Checklist

- ✅ Dependencies installed (`node_modules` folder exists)
- ✅ Environment configured (`.env.local` file exists)
- ✅ Dev server running (http://localhost:3000 accessible)
- ✅ Can see login page
- ✅ Can register new account
- ✅ Can login with credentials
- ✅ Dashboard loads after login
- ✅ Can navigate between pages
- ✅ Can logout successfully

Congratulations! Your UnifiedHealth Web Portal is running. 🎉
