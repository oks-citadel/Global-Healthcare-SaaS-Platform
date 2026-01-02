'use client';

import { useAuth, useLogout } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Unified Health
                </span>
              </div>
            </Link>
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
                    ? 'border-blue-600 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-700">
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500 capitalize">{user?.role}</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className={cn(
                'px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors',
                logout.isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
