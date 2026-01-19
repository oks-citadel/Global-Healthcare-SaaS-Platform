'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogin, useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { TopLeftLogo, CenteredHeroLogo, LogoWatermark } from '@/components/brand/BrandLogo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  // Password minimum matches registration requirements (12 chars)
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
    } catch (error) {
      console.error('Login failed:', getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#FDF8F3' }}>
      {/* Subtle Logo Watermark */}
      <LogoWatermark opacity={0.02} />

      {/* Top-Left Header Logo - Primary Brand Anchor */}
      <TopLeftLogo variant="dark" size="lg" />

      {/* Background Aurora Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(15, 42, 91, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -top-1/4 right-0 w-2/3 h-2/3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(4, 120, 87, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(194, 65, 12, 0.05) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* Left Side - Centered Hero Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10 p-12">
        <div className="text-center">
          {/* Large Centered Hero Logo */}
          <CenteredHeroLogo variant="dark" showTagline />

          {/* Supporting Description */}
          <p className="mt-10 text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            Access your healthcare portal to manage appointments, view records,
            and connect with providers worldwide.
          </p>

          {/* Trust Badges */}
          <div className="mt-10 flex items-center justify-center gap-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-[#0F2A5B]" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-[#0F2A5B]" />
              <span className="font-medium">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Hero Logo (centered) */}
          <div className="lg:hidden mb-10 pt-16">
            <CenteredHeroLogo variant="dark" showTagline />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#0F2A5B' }}>
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to access your healthcare portal
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    'w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-[#0F2A5B]/20 focus:border-[#0F2A5B]',
                    errors.email
                      ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    'w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-[#0F2A5B]/20 focus:border-[#0F2A5B]',
                    errors.password
                      ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#0F2A5B] focus:ring-[#0F2A5B]/20"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#047857] hover:text-[#065f46] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {login.isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700">
                      {getErrorMessage(login.error)}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={login.isPending}
                className={cn(
                  'w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200',
                  'bg-[#0F2A5B] hover:bg-[#0A1F42] focus:ring-4 focus:ring-[#0F2A5B]/20',
                  login.isPending && 'opacity-60 cursor-not-allowed'
                )}
              >
                {login.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    New to The Unified Health?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/register"
                  className="text-sm font-medium text-[#047857] hover:text-[#065f46] transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Icons
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
