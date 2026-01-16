'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { providersApi } from '@/lib/api'
import {
  ArrowLeft,
  Mail,
  Calendar,
  Stethoscope,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function ProviderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const providerId = params.id as string
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const { data: provider, isLoading, refetch } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: async () => {
      const response = await providersApi.getProvider(providerId)
      return response.data
    },
  })

  const handleApprove = async () => {
    try {
      await providersApi.approveProvider(providerId)
      refetch()
    } catch (error) {
      console.error('Failed to approve provider:', error)
    }
  }

  const handleReject = async () => {
    try {
      await providersApi.rejectProvider(providerId, rejectionReason)
      setRejectDialogOpen(false)
      setRejectionReason('')
      refetch()
    } catch (error) {
      console.error('Failed to reject provider:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!provider) {
    return <div>Provider not found</div>
  }

  const isPending = provider.verificationStatus === 'pending'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{provider.name}</h1>
            <p className="text-muted-foreground">{provider.specialty}</p>
          </div>
        </div>
        {isPending && (
          <div className="flex gap-2">
            <Button onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRejectDialogOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Provider Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{provider.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {provider.phone || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Specialty</p>
                <Badge variant="outline">{provider.specialty}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {provider.location || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Registered</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(provider.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Verification Status</p>
                <Badge
                  variant={
                    provider.verificationStatus === 'verified'
                      ? 'success'
                      : provider.verificationStatus === 'pending'
                      ? 'warning'
                      : 'destructive'
                  }
                  className="capitalize"
                >
                  {provider.verificationStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">License Number</p>
              <p className="text-sm text-muted-foreground">
                {provider.licenseNumber || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Years of Experience</p>
              <p className="text-sm text-muted-foreground">
                {provider.yearsOfExperience || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Education</p>
              <p className="text-sm text-muted-foreground">
                {provider.education || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Certifications</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {provider.certifications?.map((cert: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {cert}
                  </Badge>
                )) || <p className="text-sm text-muted-foreground">N/A</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {provider.documents?.map((doc: any, index: number) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Provider</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Input
                id="reason"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
