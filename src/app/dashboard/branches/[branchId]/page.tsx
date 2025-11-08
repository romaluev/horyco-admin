'use client'

import { use, useState } from 'react'

import { useRouter } from 'next/navigation'

import { IconEdit, IconTrash, IconArrowLeft } from '@tabler/icons-react'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import BaseLoading from '@/shared/ui/base-loading'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetBranchById, BranchInfoDisplay } from '@/entities/branch'
import { DeleteBranchDialog } from '@/features/branch-delete'
import { UpdateBranchDialog } from '@/features/branch-form'
import { BranchStatisticsWidget } from '@/widgets/branch-statistics'

export default function BranchDetailPage({
  params,
}: {
  params: Promise<{ branchId: string }>
}) {
  const { branchId } = use(params)
  const router = useRouter()
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
        <BaseLoading />
      </PageContainer>
    )
  }

  if (error || !branch) {
    return (
      <PageContainer>
        <Alert variant="destructive">
          <AlertDescription>Филиал не найден</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  const handleDeleteSuccess = () => {
    router.push('/dashboard/branches')
  }

  return (
    <>
      <PageContainer scrollable>
        <div className="flex flex-1 flex-col space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/branches')}
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
