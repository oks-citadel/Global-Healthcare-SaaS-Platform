# Quick Start Guide

Get the Hospital Kiosk application up and running in 5 minutes.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Touch-screen display (optional for development)

## Installation

### 1. Navigate to the kiosk directory

```bash
cd "C:\Users\Dell\OneDrive\Documents\Global Healthcare\Global-Healthcare-SaaS-Platform\apps\kiosk"
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages (~200MB).

### 3. Start the development server

```bash
npm run dev
```

The application will start on http://localhost:3004

### 4. Open in browser

Navigate to:
```
http://localhost:3004
```

## First Steps

### Test the Home Page
- You should see 6 large action buttons
- Try switching languages (top right)
- All buttons should be easily tappable

### Test Patient Check-In
1. Click "Check In"
2. Tap on the date of birth field
3. Use the virtual keyboard to enter a date
4. Progress through the steps
5. View the success screen

### Test Registration
1. Return to home
2. Click "New Patient"
3. Fill out the multi-step form
4. Review your information
5. Complete registration

### Test Appointment Scheduling
1. Click "Schedule Appointment"
2. Select a department
3. Choose a provider
4. Pick a date and time
5. Confirm your appointment

### Test Other Features
- **Directions**: Search and find hospital locations
- **Wait Times**: View real-time queue status
- **Payment**: Process a co-pay payment

## Configuration

### Change Idle Timeout

Edit `src/app/layout.tsx`:

```typescript
<IdleTimeoutProvider timeout={180000}>  // 3 minutes
```

### Change Default Language

Edit `.env.local`:

```env
NEXT_PUBLIC_DEFAULT_LANGUAGE=es  # Spanish
```

### Customize Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    600: '#your-color',
  },
}
```

## Development Tips

### Auto-reload
- Changes to files automatically reload the page
- No need to restart the dev server

### Check Console
- Open browser DevTools (F12)
- Check Console tab for any errors
- Check Network tab for API calls

### Test on Mobile
- Access from phone/tablet: http://[your-ip]:3004
- Ensure your device is on the same network

### Simulate Touch Events
In Chrome DevTools:
1. Toggle device toolbar (Ctrl+Shift+M)
2. Select a mobile device
3. Test touch interactions

## Building for Production

### Create production build

```bash
npm run build
```

### Start production server

```bash
npm start
```

The optimized application will run on http://localhost:3004

## Troubleshooting

### Port 3004 already in use

Change the port in `package.json`:

```json
"dev": "next dev -p 3005",
"start": "next start -p 3005"
```

### Module not found errors

Delete node_modules and reinstall:

```bash
rm -rf node_modules
npm install
```

### TypeScript errors

Run type check:

```bash
npm run type-check
```

### Styling not working

Ensure Tailwind is compiled:

```bash
npm run build
```

## Next Steps

1. **Read the README.md** for comprehensive documentation
2. **Check DEPLOYMENT.md** for production deployment
3. **Review CONTRIBUTING.md** for development guidelines
4. **Explore the code** starting with `src/app/page.tsx`

## Common Development Tasks

### Add a new page

1. Create directory in `src/app/[route-name]/`
2. Add `page.tsx` file
3. Use KioskLayout component
4. Add navigation from home page

### Add a new component

1. Create file in `src/components/[ComponentName].tsx`
2. Define TypeScript interface for props
3. Export the component
4. Import where needed

### Add a translation

1. Edit `src/components/LanguageProvider.tsx`
2. Add key to all language objects
3. Use with `t('your.key')`

### Add an API endpoint

1. Edit `src/lib/api.ts`
2. Add new function
3. Replace mock data with actual fetch
4. Handle errors appropriately

## Testing Checklist

Before committing changes, verify:

- [ ] All pages load without errors
- [ ] Touch interactions work smoothly
- [ ] Virtual keyboard functions correctly
- [ ] Auto-logout triggers after inactivity
- [ ] Language switching works
- [ ] Forms validate properly
- [ ] Success screens appear
- [ ] Error handling works
- [ ] No console errors
- [ ] TypeScript compiles without errors

## Getting Help

- **Documentation**: See README.md, DEPLOYMENT.md, CONTRIBUTING.md
- **Issues**: Check existing GitHub issues
- **Support**: Contact the development team

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Create production build
npm start               # Start production server
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript

# Git
git status              # Check file status
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push                # Push to remote

# Docker (optional)
docker build -t kiosk . # Build Docker image
docker run -p 3004:3004 kiosk  # Run container
```

## Project Stats

- **Total Files**: 40+
- **Lines of Code**: ~3,500+
- **Components**: 15+
- **Routes**: 7
- **Languages**: 3
- **Dependencies**: 18

## Features Overview

✅ Patient Check-In
✅ Patient Registration
✅ Appointment Scheduling
✅ Wayfinding/Directions
✅ Queue Status Display
✅ Payment Processing
✅ Multi-Language Support
✅ Auto-Logout
✅ Virtual Keyboard
✅ Touch-Optimized UI
✅ Accessibility Features
✅ Error Handling
✅ Loading States

---

**Ready to develop?** Start with `npm run dev` and open http://localhost:3004

**Questions?** Check the comprehensive documentation or contact the team.

Happy coding! 🚀
