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
      // ============================================
      // THE UNIFIED HEALTH - Design System Tokens
      // ============================================

      colors: {
        // -------- shadcn/ui Compatible --------
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
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

        // -------- UH Brand Colors (Healing Aurora) --------
        uh: {
          // Base Backgrounds
          dark: '#0A0A0F',
          bright: '#FFFFFF',

          // Primary Brand Colors
          teal: {
            DEFAULT: '#00D4AA',
            50: '#E6FFF9',
            100: '#CCFFF3',
            200: '#99FFE7',
            300: '#66FFDB',
            400: '#33FFCF',
            500: '#00D4AA',
            600: '#00A888',
            700: '#007D66',
            800: '#005244',
            900: '#002922',
          },
          indigo: {
            DEFAULT: '#4F46E5',
            50: '#EEEDFD',
            100: '#DDDCFB',
            200: '#BBB9F7',
            300: '#9996F3',
            400: '#7773EF',
            500: '#4F46E5',
            600: '#3F38B7',
            700: '#2F2A89',
            800: '#1F1C5B',
            900: '#100E2E',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            50: '#E5FAFC',
            100: '#CCF5F9',
            200: '#99EBF3',
            300: '#66E1ED',
            400: '#33D7E7',
            500: '#06B6D4',
            600: '#0592A9',
            700: '#046D7F',
            800: '#034954',
            900: '#01242A',
          },
          emerald: {
            DEFAULT: '#10B981',
            50: '#E7F9F3',
            100: '#CFF3E7',
            200: '#9FE7CF',
            300: '#6FDBB7',
            400: '#3FCF9F',
            500: '#10B981',
            600: '#0D9467',
            700: '#0A6F4D',
            800: '#064A34',
            900: '#03251A',
          },
          gold: {
            DEFAULT: '#D4AF37',
            50: '#FBF7E6',
            100: '#F7EFCC',
            200: '#EFDF99',
            300: '#E7CF66',
            400: '#DFBF33',
            500: '#D4AF37',
            600: '#AA8C2C',
            700: '#7F6921',
            800: '#554616',
            900: '#2A230B',
          },

          // Neutral Palette
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
      },

      // -------- Typography --------
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },

      fontSize: {
        // 9pt and 10pt body text
        'body-sm': ['0.5625rem', { lineHeight: '1.6', fontStyle: 'italic' }],  // 9pt
        'body': ['0.625rem', { lineHeight: '1.6', fontStyle: 'italic' }],      // 10pt
        'body-lg': ['0.75rem', { lineHeight: '1.6' }],                          // 12pt

        // Display sizes
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3' }],

        // Heading sizes
        'heading-xl': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-md': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
      },

      // -------- Gradients & Backgrounds --------
      backgroundImage: {
        // Landing page backgrounds
        'uh-landing': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 212, 170, 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(79, 70, 229, 0.1), transparent), radial-gradient(ellipse 50% 30% at 20% 80%, rgba(6, 182, 212, 0.1), transparent)',
        'uh-hero': 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0, 212, 170, 0.2), transparent 50%), linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 100%)',

        // Healing Aurora gradients
        'gradient-healing': 'linear-gradient(135deg, #00D4AA 0%, #4F46E5 50%, #06B6D4 100%)',
        'gradient-healing-soft': 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(79, 70, 229, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)',
        'gradient-aurora': 'linear-gradient(180deg, rgba(0, 212, 170, 0.05) 0%, rgba(79, 70, 229, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)',

        // Button gradients
        'gradient-primary': 'linear-gradient(135deg, #00D4AA 0%, #06B6D4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F5D67B 100%)',

        // Interior page backgrounds
        'uh-interior': 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',

        // Mesh gradients
        'mesh-dark': 'radial-gradient(at 40% 20%, rgba(0, 212, 170, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(79, 70, 229, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.1) 0px, transparent 50%)',
      },

      // -------- Box Shadows --------
      boxShadow: {
        // Glow effects
        'glow-teal': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',

        // Glass shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.16)',

        // Card shadows
        'card-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        'card-elevated': '0 12px 24px -4px rgba(0, 0, 0, 0.08)',

        // Premium shadows
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'premium-lg': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },

      // -------- Border Radius --------
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'uh': '12px',
        'uh-lg': '16px',
        'uh-xl': '24px',
      },

      // -------- Animations --------
      animation: {
        'aurora': 'aurora 15s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },

      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.5' },
          '50%': { transform: 'translateY(-20px) scale(1.05)', opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 170, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // -------- Transitions --------
      transitionDuration: {
        'uh-fast': '150ms',
        'uh-normal': '300ms',
        'uh-slow': '500ms',
      },

      transitionTimingFunction: {
        'uh-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'uh-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // -------- Spacing --------
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // -------- Accessibility --------
      ringWidth: {
        DEFAULT: '2px',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },

      // -------- Z-Index Scale --------
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [
    // Custom plugin for UH design system utilities
    function ({ addUtilities, addComponents, theme }) {
      // Focus visible utilities with UH colors
      addUtilities({
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.uh.teal.DEFAULT')}`,
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(0, 212, 170, 0.2)',
          },
        },
        '.focus-ring-inset': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.uh.teal.DEFAULT')}`,
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
            border: `2px solid ${theme('colors.uh.teal.DEFAULT')}`,
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
        // Glass morphism
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        // Text gradient
        '.text-gradient-healing': {
          backgroundImage: 'linear-gradient(135deg, #00D4AA 0%, #4F46E5 50%, #06B6D4 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        },
        // High contrast mode support
        '@media (forced-colors: active)': {
          '.forced-colors-adjust': {
            forcedColorAdjust: 'auto',
          },
        },
      });

      // UH accessible component patterns
      addComponents({
        '.btn-uh': {
          minHeight: '44px',
          minWidth: '44px',
          padding: '0.5rem 1.5rem',
          borderRadius: '12px',
          fontWeight: '500',
          fontSize: '0.875rem',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.uh.teal.DEFAULT')}`,
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(0, 212, 170, 0.2)',
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed',
          },
        },
        '.btn-uh-primary': {
          background: 'linear-gradient(135deg, #00D4AA 0%, #06B6D4 100%)',
          color: '#0A0A0F',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px -5px rgba(0, 212, 170, 0.4)',
          },
        },
        '.btn-uh-secondary': {
          backgroundColor: 'transparent',
          border: '1px solid rgba(0, 212, 170, 0.3)',
          color: '#00D4AA',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            borderColor: '#00D4AA',
          },
        },
        '.btn-uh-gold': {
          background: 'linear-gradient(135deg, #D4AF37 0%, #F5D67B 100%)',
          color: '#0A0A0F',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px -5px rgba(212, 175, 55, 0.4)',
          },
        },
        '.card-uh': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(0, 212, 170, 0.2)',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.3)',
          },
        },
        '.card-uh-bright': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
          },
        },
        '.input-uh': {
          minHeight: '44px',
          padding: '0.5rem 1rem',
          borderWidth: '1px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          transition: 'all 200ms ease',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          '&:focus': {
            outline: 'none',
            borderColor: '#00D4AA',
            boxShadow: '0 0 0 3px rgba(0, 212, 170, 0.2)',
          },
          '&[aria-invalid="true"]': {
            borderColor: '#EF4444',
            '&:focus': {
              borderColor: '#EF4444',
              boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)',
            },
          },
        },
        '.input-uh-bright': {
          minHeight: '44px',
          padding: '0.5rem 1rem',
          borderWidth: '1px',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          color: '#111827',
          transition: 'all 200ms ease',
          '&::placeholder': {
            color: '#9CA3AF',
          },
          '&:focus': {
            outline: 'none',
            borderColor: '#00D4AA',
            boxShadow: '0 0 0 3px rgba(0, 212, 170, 0.2)',
          },
        },
        '.link-uh': {
          color: '#00D4AA',
          textDecoration: 'underline',
          textDecorationThickness: '1px',
          textUnderlineOffset: '2px',
          transition: 'all 150ms ease',
          '&:hover': {
            color: '#06B6D4',
            textDecorationThickness: '2px',
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.uh.teal.DEFAULT')}`,
            outlineOffset: '2px',
            borderRadius: '4px',
          },
        },
      });
    },
  ],
};
