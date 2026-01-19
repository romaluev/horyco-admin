/**
 * PIN Management Section
 * For employee detail/edit views
 */

'use client'

import { useState } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { AlertTriangle, KeyRound, RefreshCw } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Separator } from '@/shared/ui/base/separator'
import { Switch } from '@/shared/ui/base/switch'

import { GeneratePinDialog } from './generate-pin-dialog'
import { PinStatusBadge } from './pin-status-badge'
import {
  PIN_EXPIRATION_DAYS,
  PIN_WARNING_THRESHOLD_DAYS,
} from '../model/constants'
import { useTogglePinEnabled } from '../model/mutations'
import { usePinStatus } from '../model/queries'

import type { IEmployee } from '@/entities/organization/employee/model/types'

interface PinManagementSectionProps {
  employee: IEmployee
}

export const PinManagementSection = ({
  employee,
}: PinManagementSectionProps) => {
  const [isShowingGenerateDialog, setIsShowingGenerateDialog] = useState(false)

  const { data: pinStatus, isLoading, refetch } = usePinStatus(employee.id)
  const { mutate: togglePinEnabled, isPending: isToggling } = useTogglePinEnabled()

  const handleTogglePin = (enabled: boolean): void => {
    togglePinEnabled({ employeeId: employee.id, enabled })
  }

  const handleRegenerateClick = (): void => {
    setIsShowingGenerateDialog(true)
  }

  const handleDialogSuccess = (): void => {
    refetch()
  }

  const formatDate = (date: string | null): string => {
    if (!date) return 'Н/Д'
    return format(new Date(date), 'd MMMM yyyy, HH:mm', { locale: ru })
  }

  const shouldShowWarning =
    pinStatus?.hasPin &&
    pinStatus?.pinEnabled &&
    !pinStatus?.isExpired &&
    pinStatus?.daysUntilExpiration !== null &&
    pinStatus?.daysUntilExpiration <= PIN_WARNING_THRESHOLD_DAYS

  const shouldShowExpiredAlert =
    pinStatus?.hasPin && pinStatus?.pinEnabled && pinStatus?.isExpired

  return (
    <>
      <Card className="gap-2 py-4">
        <CardHeader className="px-2">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            PIN Аутентификация
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Статус:</span>
            <PinStatusBadge status={pinStatus} isLoading={isLoading} />
          </div>

          <Separator />

          {/* PIN Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Включить PIN аутентификацию</p>
              <p className="text-sm text-muted-foreground">
                Разрешить вход через PIN в POS-системе
              </p>
            </div>
            <Switch
              checked={pinStatus?.pinEnabled || false}
              onCheckedChange={handleTogglePin}
              disabled={isToggling || isLoading || !pinStatus?.hasPin}
            />
          </div>

          {/* Expiration Warning */}
          {shouldShowWarning && (
            <div className="bg-yellow-50 p-3 rounded-lg space-y-1">
              <p className="text-sm font-medium text-yellow-900">
                ⚠️ PIN скоро истечет
              </p>
              <p className="text-sm text-yellow-800">
                PIN истечет через {pinStatus.daysUntilExpiration} дней. Сотрудник
                не сможет войти в POS после истечения.
              </p>
            </div>
          )}

          {/* Expired Alert */}
          {shouldShowExpiredAlert && (
            <div className="bg-red-50 p-3 rounded-lg space-y-1">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">PIN истек</p>
                  <p className="text-sm text-red-800">
                    Сотрудник не может войти в POS-систему. Сгенерируйте новый
                    PIN.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* PIN Details */}
          {pinStatus?.hasPin && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Создан:</p>
                  <p className="text-sm font-medium">
                    {pinStatus.expiresAt
                      ? format(
                          new Date(pinStatus.expiresAt).setDate(
                            new Date(pinStatus.expiresAt).getDate() -
                              PIN_EXPIRATION_DAYS
                          ),
                          'd MMM yyyy',
                          { locale: ru }
                        )
                      : 'Н/Д'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Истекает:</p>
                  <p className="text-sm font-medium">
                    {pinStatus.expiresAt
                      ? format(new Date(pinStatus.expiresAt), 'd MMM yyyy', {
                          locale: ru,
                        })
                      : 'Н/Д'}
                  </p>
                </div>
              </div>

              {pinStatus.daysUntilExpiration !== null &&
                pinStatus.daysUntilExpiration >= 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Осталось дней:
                    </p>
                    <p className="text-sm font-medium">
                      {pinStatus.daysUntilExpiration}
                    </p>
                  </div>
                )}

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Активность:</p>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Последнее использование:{' '}
                    <span className="text-foreground font-medium">
                      {pinStatus.lastUsedAt
                        ? formatDate(pinStatus.lastUsedAt)
                        : 'Никогда'}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Неудачных попыток:{' '}
                    <span
                      className={`font-medium ${
                        pinStatus.failedAttempts > 0
                          ? 'text-red-600'
                          : 'text-foreground'
                      }`}
                    >
                      {pinStatus.failedAttempts}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            {pinStatus?.hasPin ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerateClick}
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Перегенерировать PIN
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleRegenerateClick}
                className="flex-1"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Генерировать PIN
              </Button>
            )}
          </div>

          {/* Help Text */}
          {!pinStatus?.hasPin && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                PIN позволяет сотруднику быстро входить в POS-систему с помощью
                4-значного кода вместо пароля.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <GeneratePinDialog
        employee={employee}
        isOpen={isShowingGenerateDialog}
        onClose={() => setIsShowingGenerateDialog(false)}
        onSuccess={handleDialogSuccess}
      />
    </>
  )
}
