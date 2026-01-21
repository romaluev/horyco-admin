import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { IconEdit, IconTrash, IconArrowLeft } from '@tabler/icons-react'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetBranchById, BranchInfoDisplay } from '@/entities/organization/branch'
import { DeleteBranchDialog } from '@/features/organization/branch-delete'
import { UpdateBranchDialog } from '@/features/organization/branch-form'
import { BranchStatisticsWidget } from '@/widgets/branch-statistics'

export const Route = createFileRoute('/dashboard/_layout/branches/$branchId')({
  component: BranchDetailPage,
})

function BranchDetailPage() {
  const { branchId } = Route.useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const {
    data: branch,
    isLoading,
    error,
  } = useGetBranchById(parseInt(branchId))

  if (isLoading) {
    return (
      <PageContainer>
        <Helmet>
          <title>Загрузка... | Horyco Admin</title>
        </Helmet>
        <BaseLoading />
      </PageContainer>
    )
  }

  if (error || !branch) {
    return (
      <PageContainer>
        <Helmet>
          <title>Филиал не найден | Horyco Admin</title>
        </Helmet>
        <Alert variant="destructive">
          <AlertDescription>Филиал не найден</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  const handleDeleteSuccess = () => {
    navigate({ to: '/dashboard/branches' })
  }

  return (
    <>
      <Helmet>
        <title>{branch.name} | Horyco Admin</title>
      </Helmet>
      <PageContainer scrollable>
        <div className="flex flex-1 flex-col space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard/branches' })}
                >
                  <IconArrowLeft className="h-4 w-4" />
                </Button>
                <Heading title={branch.name} description="Информация о филиале" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Удалить
              </Button>
            </div>
          </div>
          <Separator />

          <BranchInfoDisplay branch={branch} />

          <div className="space-y-4">
            <Heading title="Статистика" description="Показатели эффективности филиала" />
            <BranchStatisticsWidget branchId={parseInt(branchId)} />
          </div>
        </div>
      </PageContainer>

      <UpdateBranchDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        branch={branch}
      />

      <DeleteBranchDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        branch={branch}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
