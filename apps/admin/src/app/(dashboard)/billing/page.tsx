'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { billingApi } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/stat-card'

type Subscription = {
  id: string
  userName: string
  plan: string
  status: string
  amount: number
  nextBilling: string
}

type Invoice = {
  id: string
  userName: string
  amount: number
  status: string
  createdAt: string
}

export default function BillingPage() {
  const { data: subscriptions, isLoading: loadingSubscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await billingApi.getSubscriptions()
      return response.data
    },
  })

  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await billingApi.getInvoices()
      return response.data
    },
  })

  const { data: revenue } = useQuery({
    queryKey: ['revenue', '30d'],
    queryFn: async () => {
      const response = await billingApi.getRevenue('30d')
      return response.data
    },
  })

  const subscriptionColumns: ColumnDef<Subscription>[] = [
    {
      accessorKey: 'userName',
      header: 'User',
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => {
        const plan = row.getValue('plan') as string
        return <Badge variant="secondary">{plan}</Badge>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={status === 'active' ? 'success' : 'destructive'}
            className="capitalize"
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.getValue('amount')),
    },
    {
      accessorKey: 'nextBilling',
      header: 'Next Billing',
      cell: ({ row }) => formatDateTime(row.getValue('nextBilling')),
    },
  ]

  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice ID',
      cell: ({ row }) => {
        const id = row.getValue('id') as string
        return <span className="font-mono text-xs">{id.slice(0, 8)}</span>
      },
    },
    {
      accessorKey: 'userName',
      header: 'User',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.getValue('amount')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        let variant: 'default' | 'success' | 'warning' | 'destructive' = 'default'

        if (status === 'paid') variant = 'success'
        else if (status === 'pending') variant = 'warning'
        else if (status === 'failed') variant = 'destructive'

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage subscriptions and monitor revenue
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(revenue?.totalRevenue || 0)}
          description="this month"
          icon={DollarSign}
          trend={{
            value: revenue?.growth || 0,
            isPositive: (revenue?.growth || 0) > 0,
          }}
        />
        <StatCard
          title="Active Subscriptions"
          value={revenue?.activeSubscriptions || 0}
          description="paying customers"
          icon={CreditCard}
        />
        <StatCard
          title="Total Transactions"
          value={revenue?.totalTransactions || 0}
          description="this month"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSubscriptions ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={subscriptionColumns}
              data={subscriptions || []}
              searchKey="userName"
              searchPlaceholder="Search subscriptions..."
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingInvoices ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={invoiceColumns}
              data={invoices || []}
              searchKey="userName"
              searchPlaceholder="Search invoices..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
