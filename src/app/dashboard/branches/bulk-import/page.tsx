'use client'

import { useState } from 'react'

import { IconArrowLeft, IconUpload } from '@tabler/icons-react'

import { useRouter } from '@/shared/lib/navigation'
import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { BulkImportDialog } from '@/features/organization/branch-bulk-import'

export default function BulkImportPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Массовый импорт филиалов"
              description="Загрузите CSV файл для создания нескольких филиалов"
            />
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/branches')}
            >
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </div>
          <Separator />

          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Формат CSV файла:</strong>
                <br />
                Первая строка должна содержать заголовки: name, address, phone,
                email
                <br />
                Каждая следующая строка - данные одного филиала
              </AlertDescription>
            </Alert>

            <div className="flex justify-center p-8">
              <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                <IconUpload className="mr-2 h-5 w-5" />
                Загрузить CSV файл
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>

      <BulkImportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => router.push('/dashboard/branches')}
      />
    </>
  )
}
