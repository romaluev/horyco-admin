import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { IconArrowLeft, IconUpload } from '@tabler/icons-react'
import { Helmet } from 'react-helmet-async'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { BulkImportDialog } from '@/features/organization/branch-bulk-import'

export const Route = createFileRoute('/dashboard/_layout/branches/bulk-import')({
  component: BulkImportPage,
})

function BulkImportPage() {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Helmet>
        <title>Массовый импорт филиалов | Horyco Admin</title>
      </Helmet>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Массовый импорт филиалов"
              description="Загрузите CSV файл для создания нескольких филиалов"
            />
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/dashboard/branches' })}
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
        onSuccess={() => navigate({ to: '/dashboard/branches' })}
      />
    </>
  )
}
