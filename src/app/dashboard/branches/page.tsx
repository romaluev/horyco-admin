'use client'

import { Suspense, useState } from 'react'

import { Link } from '@tanstack/react-router'

import { IconPlus, IconUpload } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
import { Button, buttonVariants } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import { DataTableSkeleton } from '@/shared/ui/base/table/data-table-skeleton'
import PageContainer from '@/shared/ui/layout/page-container'

import BranchListingPage from '@/entities/organization/branch/ui/branch-listing'
import { CreateBranchDialog } from '@/features/organization/branch-form'

export default function Page() {
  const { t } = useTranslation('organization')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title={t('branches.title')}
              description={t('branches.description')}
            />
            <div className="flex gap-2">
              <Link
                to="/dashboard/branches/bulk-import"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'text-xs md:text-sm'
                )}
              >
                <IconUpload className="mr-2 h-4 w-4" />{' '}
                {t('branches.actions.import')}
              </Link>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="text-xs md:text-sm"
              >
                <IconPlus className="mr-2 h-4 w-4" /> {t('branches.addNew')}
              </Button>
            </div>
          </div>
          <Separator />
          <Suspense
            fallback={
              <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
            }
          >
            <BranchListingPage />
          </Suspense>
        </div>
      </PageContainer>

      <CreateBranchDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  )
}
