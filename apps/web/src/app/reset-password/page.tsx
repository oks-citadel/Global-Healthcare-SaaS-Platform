'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmPasswordReset } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';
import { BrandLogo, TopRightLogo, LogoWatermark } from '@/components/brand/BrandLogo';

const resetPasswordConfirmSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordConfirmFormData = z.infer<typeof resetPasswordConfirmSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? null;
  const confirmReset = useConfirmPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordConfirmFormData>({
    resolver: zodResolver(resetPasswordConfirmSchema as any),
  });

  const onSubmit = async (data: ResetPasswordConfirmFormData) => {
    if (!token) {
      return;
    }

    try {
      await confirmReset.mutateAsync({
        token,
        password: data.password,
      });

      // Redirect to login after success
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BrandLogo variant="dark" size="xl" showTagline href="/" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Invalid reset link</h2>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl text-center">
          <Link
            href="/forgot-password"
            className="btn-uh btn-uh-primary px-6 py-2.5 inline-block"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (confirmReset.isSuccess) {
    return (
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BrandLogo variant="dark" size="xl" showTagline href="/" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-uh-emerald rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Password reset successful</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl text-center">
          <Link
            href="/login"
            className="btn-uh btn-uh-primary px-6 py-2.5 inline-block"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <BrandLogo variant="dark" size="xl" showTagline href="/" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Set new password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              autoComplete="new-password"
              className={cn(
                'appearance-none block w-full px-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-uh-teal focus:border-uh-teal sm:text-sm',
                errors.password
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300'
              )}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={cn(
                'appearance-none block w-full px-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-uh-teal focus:border-uh-teal sm:text-sm',
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300'
              )}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              Password must contain:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>

          {confirmReset.isError && (
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
                  {confirmReset.error?.message || 'Failed to reset password'}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={confirmReset.isPending}
            className={cn(
              'btn-uh btn-uh-primary w-full py-3',
              confirmReset.isPending && 'opacity-60 cursor-not-allowed'
            )}
          >
            {confirmReset.isPending ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-52 h-12 bg-white/10 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-8 bg-white/10 rounded w-48 mx-auto animate-pulse"></div>
        <div className="h-4 bg-white/10 rounded w-64 mx-auto mt-2 animate-pulse"></div>
      </div>
      <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
        <div className="space-y-6">
          <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#FDF8F3' }}>
      {/* Logo Watermark */}
      <LogoWatermark opacity={0.03} />

      {/* Top Right Logo - Brand placement rule */}
      <TopRightLogo variant="dark" size="md" />

      {/* Background Aurora Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30, 64, 175, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -top-1/4 right-0 w-2/3 h-2/3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      <div className="relative z-10">
        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
