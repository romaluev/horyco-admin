'use client'

import { useState } from 'react'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'

import { useCloseSession } from '@/entities/organization/table'

interface ICloseSessionDialogProps {
  tableId: number
  isOpen: boolean
  onClose: () => void
}

export const CloseSessionDialog = ({
  tableId,
  isOpen,
  onClose,
}: ICloseSessionDialogProps) => {
  const [reason, setReason] = useState('')
  const { mutate: closeSession, isPending } = useCloseSession()

  const handleClose = () => {
    closeSession(
      {
        id: tableId,
        data: {
          reason: reason || 'Закрыто администратором',
          finalizePayment: true,
        },
      },
      {
        onSuccess: () => {
          onClose()
          setReason('')
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to close this active session? This will free up the table for new customers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              placeholder="Customers left"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleClose} disabled={isPending}>
            {isPending ? 'Closing...' : 'Close Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
