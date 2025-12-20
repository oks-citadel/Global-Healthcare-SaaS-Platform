'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { settingsApi } from '@/lib/api'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getSettings()
      return response.data
    },
  })

  const [formData, setFormData] = useState({
    platformName: '',
    supportEmail: '',
    maxAppointmentDuration: 60,
    appointmentSlotInterval: 15,
    providerVerificationRequired: true,
    autoApproveProviders: false,
    maintenanceMode: false,
  })

  useState(() => {
    if (settings) {
      setFormData(settings)
    }
  })

  const handleSave = async () => {
    try {
      await settingsApi.updateSettings(formData)
      refetch()
      alert('Settings saved successfully')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={formData.platformName}
                onChange={(e) =>
                  setFormData({ ...formData, platformName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Settings</CardTitle>
            <CardDescription>Configure appointment parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxDuration">
                Maximum Appointment Duration (minutes)
              </Label>
              <Input
                id="maxDuration"
                type="number"
                value={formData.maxAppointmentDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAppointmentDuration: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slotInterval">
                Appointment Slot Interval (minutes)
              </Label>
              <Input
                id="slotInterval"
                type="number"
                value={formData.appointmentSlotInterval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointmentSlotInterval: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Settings</CardTitle>
            <CardDescription>Provider verification and approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Provider Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Providers must be verified before accepting appointments
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.providerVerificationRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    providerVerificationRequired: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Approve Providers</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve provider registrations
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.autoApproveProviders}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autoApproveProviders: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>System-wide configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable platform access for maintenance
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maintenanceMode: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
