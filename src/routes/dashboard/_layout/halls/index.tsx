import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { useBranchStore } from '@/entities/organization/branch'
import { HallList } from '@/entities/organization/hall'
import { CreateHallDialog, UpdateHallDialog } from '@/features/organization/hall-form'

import type { IHall } from '@/entities/organization/hall'

export const Route = createFileRoute('/dashboard/_layout/halls/')({
  component: HallsPage,
})

function HallsPage() {
  const { selectedBranchId } = useBranchStore()
  const [editingHall, setEditingHall] = useState<IHall | null>(null)

  return (
    <>
      <Helmet>
        <title>Залы | Horyco Admin</title>
      </Helmet>
      <PageContainer>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Залы"
              description="Создавайте и управляйте залами в ваших филиалах"
            />
            {selectedBranchId && <CreateHallDialog branchId={selectedBranchId} />}
          </div>
          <Separator />

          {selectedBranchId ? (
            <HallList branchId={selectedBranchId} onEdit={setEditingHall} />
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                Выберите филиал в боковой панели для просмотра залов
              </p>
            </div>
          )}

          {editingHall && (
            <UpdateHallDialog
              hall={editingHall}
              isOpen={!!editingHall}
              onClose={() => setEditingHall(null)}
            />
          )}
        </div>
      </PageContainer>
    </>
  )
}
