'use client'

import { useEffect, useState } from 'react'

import { Loader2, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'

import { useOperatingHoursStore } from '@/entities/organization/operating-hours/model/store'

interface HolidaysManagerProps {
  branchId: number
}

export function HolidaysManager({ branchId }: HolidaysManagerProps) {
  const { holidays, isLoading, error, fetchHolidays, createHoliday, deleteHoliday, clearError } = useOperatingHoursStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    openTime: '',
    closeTime: '',
    isClosed: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchHolidays(branchId, new Date().getFullYear())
  }, [branchId, fetchHolidays])

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.date || !formData.name) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSaving(true)
      await createHoliday(
        branchId,
        formData.date,
        formData.name,
        formData.isClosed ? null : formData.openTime || null,
        formData.isClosed ? null : formData.closeTime || null
      )
      toast.success('Holiday added successfully')
      setFormData({
        date: '',
        name: '',
        openTime: '',
        closeTime: '',
        isClosed: true,
      })
      setOpen(false)
    } catch (err) {
      toast.error('Failed to add holiday')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteHoliday = async (holidayId: number) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return

    try {
      await deleteHoliday(holidayId)
      toast.success('Holiday deleted successfully')
    } catch (err) {
      toast.error('Failed to delete holiday')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Holidays & Special Days</CardTitle>
          <CardDescription>Manage special hours and closures</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Holiday</DialogTitle>
              <DialogDescription>
                Set special hours or closure for a specific date
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Holiday Name *</Label>
                <Input
                  placeholder="e.g., New Year's Day"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="closed"
                  checked={formData.isClosed}
                  onChange={(e) =>
                    setFormData({ ...formData, isClosed: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="closed" className="font-normal cursor-pointer">
                  Fully closed
                </Label>
              </div>

              {!formData.isClosed && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Open Time</Label>
                    <Input
                      type="time"
                      value={formData.openTime}
                      onChange={(e) =>
                        setFormData({ ...formData, openTime: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Close Time</Label>
                    <Input
                      type="time"
                      value={formData.closeTime}
                      onChange={(e) =>
                        setFormData({ ...formData, closeTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Holiday'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
            <button
              onClick={clearError}
              className="ml-auto text-sm underline"
            >
              Dismiss
            </button>
          </Alert>
        )}

        {holidays?.holidays && holidays.holidays.length > 0 ? (
          <div className="space-y-2">
            {holidays.holidays.map((holiday) => (
              <div
                key={holiday.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{holiday.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(holiday.date).toLocaleDateString()}
                    {holiday.isClosed
                      ? ' • Fully closed'
                      : ` • ${holiday.openTime} - ${holiday.closeTime}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteHoliday(holiday.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No holidays configured yet
          </p>
        )}
      </CardContent>
    </Card>
  )
}
