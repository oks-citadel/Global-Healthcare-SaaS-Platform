# Getting Started with Admin Dashboard

This guide will help you set up and run the Admin Dashboard for the first time.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** (optional, for version control)

## Step 1: Navigate to Project Directory

Open your terminal and navigate to the admin directory:

```bash
cd "C:\Users\Dell\OneDrive\Documents\Global Healthcare\Global-Healthcare-SaaS-Platform\apps\admin"
```

## Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- Next.js 14 and React 18
- TailwindCSS for styling
- React Query for data fetching
- Radix UI components
- Recharts for visualizations
- TypeScript and all type definitions
- And all other dependencies

**Note**: This may take 2-5 minutes depending on your internet connection.

## Step 3: Set Up Environment Variables

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Or manually create `.env` with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NODE_ENV=development
```

**Important**: Make sure your backend API is running at the specified URL.

## Step 4: Run Development Server

Start the development server:

```bash
npm run dev
```

You should see output like:

```
> @unified-health/admin@0.1.0 dev
> next dev -p 3001

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3001
  - Ready in 2.5s
```

## Step 5: Access the Application

Open your browser and navigate to:

```
http://localhost:3001
```

You should be redirected to the login page.

## Step 6: Login

Use your admin credentials to log in. If you don't have admin credentials yet, you'll need to:

1. Ensure the backend API is running
2. Create an admin user via the backend
3. Use those credentials to log in

**Default Test Credentials** (if using mock data):
- Email: `admin@example.com`
- Password: `admin123`

## Troubleshooting

### Port Already in Use

If port 3001 is already in use, you can:

1. Stop the process using that port
2. Or change the port in `package.json`:
   ```json
   "dev": "next dev -p 3002"
   ```

### Cannot Find Module Errors

If you see module errors:

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

Run type checking to see specific errors:

```bash
npm run type-check
```

### API Connection Issues

If the dashboard can't connect to the API:

1. Verify backend is running: `http://localhost:4000`
2. Check `.env` file has correct `NEXT_PUBLIC_API_URL`
3. Check browser console for CORS errors
4. Ensure backend allows requests from `http://localhost:3001`

### Styling Issues

If styles aren't loading:

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Verify TailwindCSS is properly configured

## Development Tips

### Hot Reload

The development server supports hot reload. Changes to files will automatically refresh the browser.

### Browser DevTools

- Press `F12` to open browser DevTools
- Check Console tab for JavaScript errors
- Check Network tab for API request issues

### React Query DevTools

React Query DevTools are available in development mode. Look for the React Query icon in the bottom corner of your browser.

### File Structure

Key directories:
- `src/app/` - All pages and routes
- `src/components/` - Reusable components
- `src/lib/` - Utilities and API client

## Building for Production

When ready to deploy:

1. Create production build:
   ```bash
   npm run build
   ```

2. Test production build locally:
   ```bash
   npm start
   ```

3. The app will run at `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Common Tasks

### Adding a New Page

1. Create file in `src/app/(dashboard)/[page-name]/page.tsx`
2. Add route to sidebar in `src/components/sidebar.tsx`
3. Page will be automatically routed by Next.js

### Adding a New Component

1. Create file in `src/components/[component-name].tsx`
2. Import and use in your pages

### Modifying API Endpoints

1. Update `src/lib/api.ts`
2. Add or modify API functions
3. Use with React Query in components

### Changing Theme Colors

1. Edit `src/app/globals.css` for color variables
2. Update `tailwind.config.js` for Tailwind colors

## Next Steps

Now that you have the admin dashboard running:

1. Explore all the pages using the sidebar navigation
2. Test user management features
3. Review provider verification workflow
4. Check appointment management
5. Explore billing and reports sections
6. Configure settings for your platform

## Getting Help

If you encounter issues:

1. Check `README.md` for detailed documentation
2. Review `PROJECT_SUMMARY.md` for technical details
3. Check browser console for errors
4. Verify API endpoints are working
5. Ensure environment variables are correct

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Congratulations!** You now have a fully functional admin dashboard for your Unified Healthcare Platform.
