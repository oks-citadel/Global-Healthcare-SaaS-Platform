'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usersApi } from '@/lib/api'
import { ArrowLeft, Mail, Calendar, Shield, Ban, CheckCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await usersApi.getUser(userId)
      return response.data
    },
  })

  const handleSuspend = async () => {
    try {
      await usersApi.suspendUser(userId)
      refetch()
    } catch (error) {
      console.error('Failed to suspend user:', error)
    }
  }

  const handleActivate = async () => {
    try {
      await usersApi.activateUser(userId)
      refetch()
    } catch (error) {
      console.error('Failed to activate user:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  const isActive = user.status === 'active'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isActive ? (
            <Button variant="destructive" onClick={handleSuspend}>
              <Ban className="mr-2 h-4 w-4" />
              Suspend User
            </Button>
          ) : (
            <Button onClick={handleActivate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate User
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(user.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge
                  variant={isActive ? 'success' : 'destructive'}
                  className="capitalize"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Total Appointments</p>
              <p className="text-2xl font-bold">{user.stats?.totalAppointments || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Completed Appointments</p>
              <p className="text-2xl font-bold">
                {user.stats?.completedAppointments || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Login</p>
              <p className="text-sm text-muted-foreground">
                {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.recentActivity?.map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
