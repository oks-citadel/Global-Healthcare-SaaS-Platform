'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { DashboardBackground } from '@/components/theme/UnifiedHealthBrightBackground';
import { BrandLogo, PatientPortalLogo } from '@/components/brand/BrandLogo';

interface PatientLayoutProps {
  children: ReactNode;
}

const patientNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/patient',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'appointments',
    label: 'Appointments',
    href: '/patient/appointments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'visits',
    label: 'Virtual Visits',
    href: '/patient/visits',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/patient/documents',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/patient/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function PatientLayout({ children }: PatientLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/patient') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <DashboardBackground>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-uh-slate-200 fixed top-0 left-0 bottom-0">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-uh-slate-100">
            <BrandLogo variant="dark" size="sm" />
          </div>

          {/* Portal Badge */}
          <div className="px-6 py-3 border-b border-uh-slate-100">
            <span className="text-[10px] uppercase tracking-widest font-medium text-uh-teal">
              Patient Portal
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {patientNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 focus-ring
                  ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-uh-teal/10 to-uh-cyan/10 text-uh-teal border-l-2 border-uh-teal'
                      : 'text-uh-slate-600 hover:text-uh-slate-900 hover:bg-uh-slate-50'
                  }
                `}
              >
                <span className={isActive(item.href) ? 'text-uh-teal' : 'text-uh-slate-400'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Help Link */}
          <div className="p-4 border-t border-uh-slate-100">
            <Link
              href="/help"
              className="flex items-center gap-3 px-4 py-3 text-sm text-uh-slate-500 hover:text-uh-slate-700 hover:bg-uh-slate-50 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help & Support
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-uh-slate-200 sticky top-0 z-30">
            <div className="h-full flex items-center justify-between px-4 lg:px-8">
              {/* Mobile Logo */}
              <div className="lg:hidden">
                <BrandLogo variant="dark" size="sm" />
              </div>

              {/* Search Bar */}
              <div className="hidden lg:flex flex-1 max-w-lg">
                <div className="relative w-full">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-uh-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search appointments, documents..."
                    className="w-full pl-10 pr-4 py-2 bg-uh-slate-50 border border-uh-slate-200 rounded-xl text-sm placeholder:text-uh-slate-400 focus:outline-none focus:ring-2 focus:ring-uh-teal/20 focus:border-uh-teal transition-all"
                  />
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                  className="p-2 text-uh-slate-500 hover:text-uh-slate-700 focus-ring rounded-lg relative"
                  aria-label="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-uh-teal rounded-full animate-pulse" />
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-uh-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-uh-slate-500">Patient</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-uh-teal to-uh-cyan flex items-center justify-center text-white font-medium text-sm shadow-glow-teal/30">
                    {user?.firstName?.charAt(0).toUpperCase() || 'P'}
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-uh-slate-600 hover:text-uh-slate-900 hover:bg-uh-slate-100 rounded-lg transition-colors focus-ring"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardBackground>
  );
}
