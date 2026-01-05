'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { authApi } from '@/lib/api'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  CreditCard,
  Settings,
  FileText,
  BarChart3,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Providers', href: '/providers', icon: Stethoscope },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // SECURITY: Call logout endpoint to clear httpOnly cookies on server
      await authApi.logout()
    } catch {
      // Proceed to login page even if logout fails
    }
    window.location.href = '/login'
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Health Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'sidebar-active text-white shadow-md'
                  : 'text-muted-foreground hover:bg-trust-blue-50 hover:text-trust-blue-700'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-trust-blue-50 hover:text-trust-blue-700"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
