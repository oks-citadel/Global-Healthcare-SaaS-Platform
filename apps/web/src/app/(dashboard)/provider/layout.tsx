'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BrandLogo } from '@/components/brand';

interface ProviderLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/provider',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: 'Patients',
    href: '/provider/patients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    name: 'Encounters',
    href: '/provider/encounters',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    name: 'Schedule',
    href: '/provider/schedule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // RBAC: Redirect non-provider users
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role !== 'doctor' && user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/provider') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-uh-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-uh-teal"></div>
      </div>
    );
  }

  // Don't render provider content for non-provider users
  if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-uh-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-uh-slate-900">Access Denied</h2>
          <p className="mt-2 text-uh-slate-600">You do not have permission to access this area.</p>
          <Link
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-uh-teal text-white rounded-lg hover:bg-uh-teal/90"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-uh-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-uh-slate-200">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <div className="flex items-center">
                <BrandLogo variant="dark" size="sm" />
                <div className="ml-3">
                  <span className="text-[10px] uppercase tracking-widest font-medium text-uh-teal">
                    Provider Portal
                  </span>
                  <h2 className="text-lg font-semibold text-uh-slate-900">UnifiedHealth</h2>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus-ring ${
                    isActive(item.href)
                      ? 'bg-uh-teal/10 text-uh-teal'
                      : 'text-uh-slate-600 hover:bg-uh-slate-50 hover:text-uh-slate-900'
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      isActive(item.href)
                        ? 'text-uh-teal'
                        : 'text-uh-slate-400 group-hover:text-uh-slate-500'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex-shrink-0 flex border-t border-uh-slate-200 p-4">
              <Link href="/profile" className="flex-shrink-0 w-full group block focus-ring rounded-lg p-2">
                <div className="flex items-center">
                  <div>
                    <div className="w-10 h-10 bg-uh-teal/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-uh-teal"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-uh-slate-700 group-hover:text-uh-slate-900">
                      {user?.firstName || 'Provider'} {user?.lastName || ''}
                    </p>
                    <p className="text-xs font-medium text-uh-slate-500 group-hover:text-uh-slate-700">
                      View profile
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-uh-slate-200">
            <div className="flex items-center">
              <BrandLogo variant="dark" size="sm" />
              <span className="ml-2 text-lg font-semibold text-uh-slate-900">Provider</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-uh-slate-400 hover:text-uh-slate-500 hover:bg-uh-slate-100 focus-ring"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus-ring ${
                  isActive(item.href)
                    ? 'bg-uh-teal/10 text-uh-teal'
                    : 'text-uh-slate-600 hover:bg-uh-slate-50 hover:text-uh-slate-900'
                }`}
              >
                <span className={`mr-3 ${isActive(item.href) ? 'text-uh-teal' : 'text-uh-slate-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-uh-slate-200">
            <Link
              href="/"
              className="flex items-center space-x-2 text-uh-slate-600 hover:text-uh-slate-900 focus-ring rounded-lg p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-uh-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BrandLogo variant="dark" size="sm" />
            <span className="ml-2 text-lg font-semibold text-uh-slate-900">Provider Portal</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-uh-slate-400 hover:text-uh-slate-500 hover:bg-uh-slate-100 focus-ring"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none pt-16 md:pt-0">
          <div className="py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
