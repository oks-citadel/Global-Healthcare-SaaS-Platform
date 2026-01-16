/**
 * @unified-health/asset-branding - Tailwind CSS Configuration
 *
 * Healthcare-grade Tailwind theme extension for The Unified Health platform.
 * Implements the brand design system with WCAG AA+ compliance.
 *
 * Usage:
 *   // tailwind.config.js
 *   const unifiedHealthPreset = require('@unified-health/asset-branding/tailwind');
 *   module.exports = {
 *     presets: [unifiedHealthPreset],
 *     // your customizations...
 *   };
 */

import type { Config } from 'tailwindcss';

const unifiedHealthPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Clinical Blue - Primary Brand Color
        'clinical-blue': {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffc',
          300: '#7cc7fa',
          400: '#36aaf5',
          500: '#0c8ee6',
          600: '#0070c4',
          700: '#01599f',
          800: '#064b83',
          900: '#0b3f6d',
          950: '#072849',
        },
        // Trust Black - Typography & Borders
        'trust-black': {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a',
        },
        // Clinical White - Surfaces
        'clinical-white': {
          pure: '#ffffff',
          warm: '#fafafa',
          cool: '#f8fafc',
        },
        // Accent Green - Success Indicators
        'accent-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Semantic Colors
        success: {
          light: '#dcfce7',
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        info: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        critical: {
          light: '#fce7f3',
          DEFAULT: '#ec4899',
          dark: '#be185d',
        },
        // Surface Colors
        surface: {
          page: '#fafafa',
          card: '#ffffff',
          elevated: '#ffffff',
          disabled: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'SF Mono',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        clinical: '0.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'focus-ring': '0 0 0 3px rgba(12, 142, 230, 0.4)',
      },
      transitionDuration: {
        instant: '0ms',
        fast: '100ms',
        normal: '200ms',
        slow: '300ms',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      minHeight: {
        'touch-target': '44px',
        'touch-target-lg': '48px',
      },
      minWidth: {
        'touch-target': '44px',
        'touch-target-lg': '48px',
      },
      ringWidth: {
        focus: '3px',
      },
      ringOffsetWidth: {
        focus: '2px',
      },
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
        toast: '1080',
      },
    },
  },
  plugins: [],
};

export default unifiedHealthPreset;

// CommonJS export for compatibility
module.exports = unifiedHealthPreset;
