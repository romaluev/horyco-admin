'use client'

import { useEffect, useState } from 'react'

import { Check, Clock, Copy, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'

import { employeeApi } from '@/entities/employee/model/api'

import type { IEmployee, IGenerateInviteLinkResponse } from '@/entities/employee'

interface InviteLinkDialogProps {
  employee: IEmployee
  isOpen: boolean
  onClose: () => void
}

export const InviteLinkDialog = ({
  employee,
  isOpen,
  onClose,
}: InviteLinkDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [inviteData, setInviteData] = useState<IGenerateInviteLinkResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const generateLink = async (regenerate = false) => {
    try {
      setError(null)
      if (regenerate) {
        setIsRegenerating(true)
      } else {
        setIsLoading(true)
      }

      const response = regenerate
        ? await employeeApi.regenerateInviteLink(employee.id)
        : await employeeApi.generateInviteLink(employee.id)

      setInviteData(response)

      if (regenerate) {
        toast.success('Ссылка обновлена')
      }
    } catch {
      setError('Не удалось сгенерировать ссылку. Попробуйте позже.')
    } finally {
      setIsLoading(false)
      setIsRegenerating(false)
    }
  }

  // Generate link when dialog opens
  useEffect(() => {
    if (isOpen && !inviteData && !isLoading) {
      generateLink()
    }
  }, [isOpen])

  const copyToClipboard = async () => {
    if (!inviteData?.magicLink) return

    try {
      await navigator.clipboard.writeText(inviteData.magicLink)
      setIsCopied(true)
      toast.success('Ссылка скопирована')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать ссылку')
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state when closing
    setInviteData(null)
    setError(null)
    setIsCopied(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Пригласительная ссылка</DialogTitle>
          <DialogDescription>
            Отправьте эту ссылку сотруднику {employee.fullName} для установки пароля
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : inviteData ? (
            <>
              {/* Link input with copy button */}
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={inviteData.magicLink}
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Expiration info */}
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">
                  Срок действия: {inviteData.daysRemaining} дн.
                </span>
              </div>

              {/* Instructions */}
              <p className="text-muted-foreground text-sm">
                {inviteData.instructions}
              </p>

              {/* Regenerate button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => generateLink(true)}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обновление...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Сгенерировать новую ссылку
                  </>
                )}
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
