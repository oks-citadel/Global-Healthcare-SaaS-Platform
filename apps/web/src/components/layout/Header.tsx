'use client';

import { useAuth, useLogout } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BrandLogo, BrandLogoMark } from '@/components/brand/BrandLogo';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const pathname = usePathname();

  const handleLogout = () => {
    logout.mutate();
  };

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Appointments', href: '/appointments' },
    { name: 'Profile', href: '/profile' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white border-b border-uh-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Enhanced size for header visibility) */}
          <div className="flex items-center">
            <BrandLogo variant="dark" size="md" href="/" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                  pathname === item.href
                    ? 'border-uh-teal text-uh-slate-900'
                    : 'border-transparent text-uh-slate-500 hover:border-uh-slate-300 hover:text-uh-slate-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-uh-slate-700">
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-uh-slate-400">•</span>
              <span className="text-uh-slate-500 capitalize">{user?.role}</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className={cn(
                'btn-uh btn-uh-primary px-4 py-2 text-sm',
                logout.isPending && 'opacity-60 cursor-not-allowed'
              )}
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </button>

            {/* Logo Mark - Brand placement rule: top-right */}
            <div className="hidden lg:block border-l border-uh-slate-200 pl-4 ml-2">
              <BrandLogoMark variant="dark" size="xs" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
