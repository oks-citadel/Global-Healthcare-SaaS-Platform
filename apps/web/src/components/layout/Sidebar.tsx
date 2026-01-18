'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Overview and statistics',
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: '📅',
    description: 'Manage your appointments',
  },
  {
    name: 'Medical Records',
    href: '/records',
    icon: '📋',
    description: 'View your medical history',
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: '💬',
    description: 'Chat with healthcare providers',
  },
  {
    name: 'Prescriptions',
    href: '/prescriptions',
    icon: '💊',
    description: 'View and refill prescriptions',
  },
  {
    name: 'Lab Results',
    href: '/lab-results',
    icon: '🔬',
    description: 'Access test results',
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: '👤',
    description: 'Update your information',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: '⚙️',
    description: 'Manage preferences',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-uh-slate-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-uh-teal/10 to-uh-cyan/10 text-uh-teal border-l-2 border-uh-teal'
                  : 'text-uh-slate-600 hover:bg-uh-slate-50 hover:text-uh-slate-900'
              )}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                {item.description && (
                  <div className={cn(
                    'text-xs mt-0.5',
                    isActive ? 'text-uh-teal/70' : 'text-uh-slate-400'
                  )}>
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
