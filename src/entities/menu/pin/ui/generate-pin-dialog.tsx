/**
 * Generate PIN Dialog
 * Modal for generating PIN with one-time display
 */

'use client'

import { useState } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { AlertTriangle, Check, Copy, Eye, EyeOff, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'

import { useGeneratePin } from '../model/mutations'

import type { IEmployee } from '@/entities/organization/employee/model/types'

interface GeneratePinDialogProps {
  employee: IEmployee
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const GeneratePinDialog = ({
  employee,
  isOpen,
  onClose,
  onSuccess,
}: GeneratePinDialogProps) => {
  const [generatedPin, setGeneratedPin] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [isShowingPin, setIsShowingPin] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { mutate: generatePin, isPending } = useGeneratePin()

  const handleGenerate = (): void => {
    generatePin(employee.id, {
      onSuccess: (data) => {
        setGeneratedPin(data.pin)
        setExpiresAt(data.expiresAt)
        setIsShowingPin(true)
        onSuccess?.()
      },
    })
  }

  const handleCopyPin = (): void => {
    if (generatedPin) {
      navigator.clipboard.writeText(generatedPin)
      toast.success('PIN скопирован в буфер обмена')
    }
  }

  const handleClose = (): void => {
    if (generatedPin && !isConfirmed) {
      if (
        !window.confirm(
          'Вы уверены? PIN будет показан только один раз. Вы сохранили его?'
        )
      ) {
        return
      }
    }

    // Reset state
    setGeneratedPin(null)
    setExpiresAt(null)
    setIsShowingPin(false)
    setIsConfirmed(false)
    onClose()
  }

  const formatExpirationDate = (date: string): string => {
    return format(new Date(date), 'd MMMM yyyy', { locale: ru })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {!generatedPin ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Генерация PIN для {employee.fullName}
              </DialogTitle>
              <DialogDescription>
                Будет создан 4-значный PIN для быстрой аутентификации в POS-системе.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-yellow-900">
                  ⚠️ Важно:
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>PIN будет показан только один раз</li>
                  <li>Скопируйте его немедленно и передайте безопасно</li>
                  <li>Действителен в течение 30 дней</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Сотрудник:</p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-medium">{employee.fullName}</p>
                  <p className="text-sm text-muted-foreground">{employee.phone}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isPending}
              >
                {isPending ? 'Генерация...' : 'Генерировать PIN'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                PIN успешно сгенерирован
              </DialogTitle>
              <DialogDescription>
                Сохраните этот PIN. Он больше не будет показан.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Сотрудник:</p>
                <p className="text-lg">{employee.fullName}</p>
                <p className="text-sm text-muted-foreground">{employee.phone}</p>
              </div>

              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">PIN:</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShowingPin(!isShowingPin)}
                  >
                    {isShowingPin ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {isShowingPin ? (
                    <p className="font-mono text-4xl font-bold tracking-widest">
                      {generatedPin.split('').join(' ')}
                    </p>
                  ) : (
                    <p className="font-mono text-4xl font-bold tracking-widest">
                      • • • •
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPin}
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Скопировать PIN
                </Button>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-900">
                      СОХРАНИТЕ ЭТОТ PIN СЕЙЧАС
                    </p>
                    <p className="text-sm text-yellow-800">
                      Он не будет показан снова. Если вы потеряете его, придется
                      сгенерировать новый.
                    </p>
                  </div>
                </div>
              </div>

              {expiresAt && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Действителен до:{' '}
                    <span className="font-medium text-foreground">
                      {formatExpirationDate(expiresAt)}
                    </span>
                  </p>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Как передать сотруднику:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>📱 Отправить через SMS (скоро)</li>
                  <li>📞 Сообщить по телефону</li>
                  <li>💬 Передать лично</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="confirmed"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="confirmed"
                  className="text-sm font-medium cursor-pointer"
                >
                  Я безопасно сохранил этот PIN
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                disabled={!isConfirmed}
                className="w-full"
              >
                Закрыть
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
