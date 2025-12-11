'use client'

import { useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'
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
import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'

import { useOperatingHoursStore } from '@/entities/operating-hours/model/store'

import type { OperatingHour } from '@/entities/operating-hours/model/types'

const DAYS = [
  { number: 0, name: 'Sunday' },
  { number: 1, name: 'Monday' },
  { number: 2, name: 'Tuesday' },
  { number: 3, name: 'Wednesday' },
  { number: 4, name: 'Thursday' },
  { number: 5, name: 'Friday' },
  { number: 6, name: 'Saturday' },
]

interface OperatingHoursEditorProps {
  branchId: number
  onSuccess?: () => void
}

export function OperatingHoursEditor({ branchId, onSuccess }: OperatingHoursEditorProps) {
  const { operatingHours, isLoading, error, fetchOperatingHours, updateOperatingHours, clearError } = useOperatingHoursStore()
  const [hours, setHours] = useState<OperatingHour[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchOperatingHours(branchId)
  }, [branchId, fetchOperatingHours])

  useEffect(() => {
    if (operatingHours?.hours) {
      setHours(operatingHours.hours)
    }
  }, [operatingHours])

  const handleTimeChange = (dayIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    const updated = [...hours]
    const hour = updated[dayIndex]
    if (hour) {
      updated[dayIndex] = {
        ...hour,
        [field]: value || null,
      }
      setHours(updated)
    }
  }

  const handleClosedChange = (dayIndex: number, isClosed: boolean) => {
    const updated = [...hours]
    const hour = updated[dayIndex]
    if (hour) {
      updated[dayIndex] = {
        ...hour,
        isClosed,
        openTime: isClosed ? null : hour.openTime || '09:00',
        closeTime: isClosed ? null : hour.closeTime || '22:00',
      }
      setHours(updated)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateOperatingHours(branchId, { hours })
      toast.success('Operating hours updated successfully')
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to update operating hours')
    } finally {
      setIsSaving(false)
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
      <CardHeader>
        <CardTitle>Operating Hours</CardTitle>
        <CardDescription>Set the hours when your branch is open</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-4">
          {hours.map((hour, index) => (
            <div key={hour.dayOfWeek} className="flex items-end gap-4">
              <div className="w-24">
                <Label className="text-sm font-medium">{hour.dayName}</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hour.isClosed}
                  onChange={(e) => handleClosedChange(index, e.target.checked)}
                  className="h-4 w-4"
                />
                <Label className="text-sm">Closed</Label>
              </div>

              {!hour.isClosed && (
                <>
                  <div>
                    <Input
                      type="time"
                      value={hour.openTime || '09:00'}
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">to</div>
                  <div>
                    <Input
                      type="time"
                      value={hour.closeTime || '22:00'}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Operating Hours'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
