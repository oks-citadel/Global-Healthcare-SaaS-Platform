'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useResetPassword } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';
import { BrandLogo, TopRightLogo, LogoWatermark } from '@/components/brand/BrandLogo';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema as any),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword.mutateAsync(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#FDF8F3' }}>
        {/* Logo Watermark */}
        <LogoWatermark opacity={0.03} />

        {/* Top Right Logo - Brand placement rule */}
        <TopRightLogo variant="dark" size="sm" />

        {/* Background Aurora Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute -top-1/4 right-0 w-2/3 h-2/3 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(30, 64, 175, 0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <BrandLogo variant="dark" size="lg" href="/" />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-uh-emerald rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to your email address.
              Please check your inbox and follow the instructions.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
            <div className="space-y-4">
              <div className="bg-uh-teal/10 border border-uh-teal/20 rounded-xl p-4">
                <p className="text-sm text-uh-teal-dark">
                  If you don't see the email, check your spam folder or request a new link.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Send another email
                </button>
                <Link
                  href="/login"
                  className="btn-uh btn-uh-primary w-full py-2.5 text-center"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#FDF8F3' }}>
      {/* Logo Watermark */}
      <LogoWatermark opacity={0.03} />

      {/* Top Right Logo - Brand placement rule */}
      <TopRightLogo variant="dark" size="sm" />

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

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BrandLogo variant="dark" size="lg" href="/" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={cn(
                  'appearance-none block w-full px-3 py-2.5 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-uh-teal focus:border-uh-teal sm:text-sm',
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                )}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {resetPassword.isError && (
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
                    {resetPassword.error?.message || 'Failed to send reset email'}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={resetPassword.isPending}
              className={cn(
                'btn-uh btn-uh-primary w-full py-3',
                resetPassword.isPending && 'opacity-60 cursor-not-allowed'
              )}
            >
              {resetPassword.isPending ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="font-medium text-uh-teal hover:text-uh-teal-dark transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
