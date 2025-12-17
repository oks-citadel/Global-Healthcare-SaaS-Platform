/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Accessibility: Focus ring utilities
      ringWidth: {
        DEFAULT: '2px',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      // Accessibility: Minimum touch target sizes
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [
    // Custom plugin for accessibility utilities
    function ({ addUtilities, addComponents, theme }) {
      // Focus visible utilities
      addUtilities({
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.blue.500')}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 4px ${theme('colors.blue.500')}20`,
          },
        },
        '.focus-ring-inset': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.blue.500')}`,
            outlineOffset: '-2px',
          },
        },
        // Screen reader only utility
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.sr-only-focusable': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
          '&:focus': {
            position: 'absolute',
            width: 'auto',
            height: 'auto',
            padding: '0.75rem',
            margin: '0',
            overflow: 'visible',
            clip: 'auto',
            clipPath: 'none',
            whiteSpace: 'normal',
            backgroundColor: theme('colors.white'),
            color: theme('colors.gray.900'),
            zIndex: 50,
            border: `2px solid ${theme('colors.blue.600')}`,
          },
        },
        // Touch target utility
        '.touch-target': {
          minWidth: '44px',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        // High contrast mode support
        '@media (forced-colors: active)': {
          '.forced-colors-adjust': {
            forcedColorAdjust: 'auto',
          },
        },
      });

      // Accessible component patterns
      addComponents({
        '.btn-accessible': {
          minHeight: '44px',
          minWidth: '44px',
          padding: '0.5rem 1rem',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 150ms ease-in-out',
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.blue.500')}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 4px ${theme('colors.blue.500')}20`,
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.link-accessible': {
          textDecoration: 'underline',
          textDecorationThickness: '1px',
          textUnderlineOffset: '2px',
          '&:hover': {
            textDecorationThickness: '2px',
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.blue.500')}`,
            outlineOffset: '2px',
            borderRadius: theme('borderRadius.sm'),
          },
        },
        '.input-accessible': {
          minHeight: '44px',
          padding: '0.5rem 0.75rem',
          borderWidth: '1px',
          borderRadius: theme('borderRadius.md'),
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.blue.500'),
            boxShadow: `0 0 0 3px ${theme('colors.blue.500')}20`,
          },
          '&[aria-invalid="true"]': {
            borderColor: theme('colors.red.600'),
            '&:focus': {
              borderColor: theme('colors.red.600'),
              boxShadow: `0 0 0 3px ${theme('colors.red.600')}20`,
            },
          },
        },
      });
    },
  ],
};
