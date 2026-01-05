'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { authApi } from '@/lib/api'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // SECURITY: Check auth via API call instead of localStorage
    // httpOnly cookies are sent automatically, server validates
    const checkAuth = async () => {
      try {
        await authApi.getProfile()
        setIsAuthenticated(true)
      } catch {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/40">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
