'use client'

import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { providersApi } from '@/lib/api'
import { Eye, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

type Provider = {
  id: string
  name: string
  email: string
  specialty: string
  verificationStatus: string
  createdAt: string
}

export default function ProvidersPage() {
  const { data: providers, isLoading, refetch } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const response = await providersApi.getProviders()
      return response.data
    },
  })

  const handleApprove = async (providerId: string) => {
    try {
      await providersApi.approveProvider(providerId)
      refetch()
    } catch (error) {
      console.error('Failed to approve provider:', error)
    }
  }

  const handleReject = async (providerId: string) => {
    try {
      const reason = prompt('Enter rejection reason:')
      if (reason) {
        await providersApi.rejectProvider(providerId, reason)
        refetch()
      }
    } catch (error) {
      console.error('Failed to reject provider:', error)
    }
  }

  const columns: ColumnDef<Provider>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'specialty',
      header: 'Specialty',
      cell: ({ row }) => {
        const specialty = row.getValue('specialty') as string
        return <Badge variant="outline">{specialty}</Badge>
      },
    },
    {
      accessorKey: 'verificationStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('verificationStatus') as string
        let variant: 'default' | 'success' | 'warning' | 'destructive' = 'default'

        if (status === 'verified') variant = 'success'
        else if (status === 'pending') variant = 'warning'
        else if (status === 'rejected') variant = 'destructive'

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Registered',
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const provider = row.original
        const isPending = provider.verificationStatus === 'pending'

        return (
          <div className="flex items-center gap-2">
            <Link href={`/providers/${provider.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleApprove(provider.id)}
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReject(provider.id)}
                >
                  <XCircle className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}
          </div>
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
        <h1 className="text-3xl font-bold tracking-tight">Providers</h1>
        <p className="text-muted-foreground">
          Manage and verify healthcare providers
        </p>
      </div>

      <DataTable
        columns={columns}
        data={providers || []}
        searchKey="name"
        searchPlaceholder="Search providers..."
      />
    </div>
  )
}
