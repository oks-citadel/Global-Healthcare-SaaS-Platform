'use client'

import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { appointmentsApi } from '@/lib/api'
import { XCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

type Appointment = {
  id: string
  patientName: string
  providerName: string
  type: string
  status: string
  scheduledAt: string
  createdAt: string
}

export default function AppointmentsPage() {
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await appointmentsApi.getAppointments()
      return response.data
    },
  })

  const handleCancel = async (appointmentId: string) => {
    try {
      const reason = prompt('Enter cancellation reason:')
      if (reason) {
        await appointmentsApi.cancelAppointment(appointmentId, reason)
        refetch()
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error)
    }
  }

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        const id = row.getValue('id') as string
        return <span className="font-mono text-xs">{id.slice(0, 8)}</span>
      },
    },
    {
      accessorKey: 'patientName',
      header: 'Patient',
    },
    {
      accessorKey: 'providerName',
      header: 'Provider',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string
        return <Badge variant="outline">{type}</Badge>
      },
    },
    {
      accessorKey: 'scheduledAt',
      header: 'Scheduled',
      cell: ({ row }) => formatDateTime(row.getValue('scheduledAt')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        let variant: 'default' | 'success' | 'warning' | 'destructive' = 'default'

        if (status === 'completed') variant = 'success'
        else if (status === 'scheduled') variant = 'warning'
        else if (status === 'cancelled') variant = 'destructive'

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const appointment = row.original
        const canCancel = appointment.status === 'scheduled'

        return (
          canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancel(appointment.id)}
            >
              <XCircle className="h-4 w-4 text-red-600" />
            </Button>
          )
        )
      },
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          Monitor and manage all platform appointments
        </p>
      </div>

      <DataTable
        columns={columns}
        data={appointments || []}
        searchKey="patientName"
        searchPlaceholder="Search by patient name..."
      />
    </div>
  )
}
