'use client'

import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { auditApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

type AuditLog = {
  id: string
  action: string
  resource: string
  userId: string
  userName: string
  ipAddress: string
  timestamp: string
  status: string
}

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await auditApi.getAuditLogs()
      return response.data
    },
  })

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => formatDateTime(row.getValue('timestamp')),
    },
    {
      accessorKey: 'userName',
      header: 'User',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const action = row.getValue('action') as string
        return <Badge variant="outline">{action}</Badge>
      },
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: ({ row }) => {
        const ip = row.getValue('ipAddress') as string
        return <span className="font-mono text-xs">{ip}</span>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={status === 'success' ? 'success' : 'destructive'}
            className="capitalize"
          >
            {status}
          </Badge>
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
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all administrative actions and system events
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs || []}
        searchKey="action"
        searchPlaceholder="Search by action..."
      />
    </div>
  )
}
