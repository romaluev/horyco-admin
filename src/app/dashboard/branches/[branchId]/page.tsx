import { useState } from 'react'

import { IconEdit, IconTrash, IconArrowLeft } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useRouter } from '@/shared/lib/navigation'
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

export default function BranchDetailPage({
  branchId,
}: {
  branchId: string
}) {
  const { t } = useTranslation('organization')
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
          <AlertDescription>{t('branches.errors.notFound')}</AlertDescription>
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
                <Heading title={branch.name} description={t('branches.detail.description')} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                <IconEdit className="mr-2 h-4 w-4" />
                {t('branches.actions.edit')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                {t('branches.actions.delete')}
              </Button>
            </div>
          </div>
          <Separator />

          <BranchInfoDisplay branch={branch} />

          <div className="space-y-4">
            <Heading title={t('branches.detail.statistics')} description={t('branches.detail.statisticsDescription')} />
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
