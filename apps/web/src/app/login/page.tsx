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
import { BrandLogo, TopRightLogo, LogoWatermark } from '@/components/brand/BrandLogo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
    resolver: zodResolver(loginSchema as any),
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
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Logo Watermark */}
      <LogoWatermark opacity={0.03} />

      {/* Top Right Logo - Brand placement rule */}
      <TopRightLogo variant="light" size="sm" />

      {/* Background Aurora Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full animate-aurora"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 170, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -top-1/4 right-0 w-2/3 h-2/3 rounded-full animate-aurora"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '-5s',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-1/2 h-1/2 rounded-full animate-aurora"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            filter: 'blur(70px)',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10 p-12">
        <div className="max-w-md">
          <BrandLogo variant="light" size="xl" showTagline href="/" />
          <p className="mt-6 text-lg text-white/60 leading-relaxed">
            Access your healthcare portal to manage appointments, view records,
            and connect with providers worldwide.
          </p>
          <div className="mt-8 flex items-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <ShieldIcon className="w-4 h-4" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <LockIcon className="w-4 h-4" />
              256-bit Encryption
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <BrandLogo variant="light" size="lg" href="/" className="inline-flex" />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-premium p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-uh-slate-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-uh-slate-500">
                Sign in to access your healthcare portal
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-uh-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    'input-uh-bright w-full',
                    errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
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
                  className="block text-sm font-medium text-uh-slate-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    'input-uh-bright w-full',
                    errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
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
                    className="h-4 w-4 text-uh-teal focus:ring-uh-teal/20 border-uh-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-uh-slate-600"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-uh-teal hover:text-uh-teal-600 transition-colors"
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
                  'btn-uh btn-uh-primary w-full py-3',
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
                  <div className="w-full border-t border-uh-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-uh-slate-500">
                    New to TheUnifiedHealth?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/register"
                  className="text-sm font-medium text-uh-teal hover:text-uh-teal-600 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-white/40">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
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
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
