'use client'

import { useState } from 'react'

import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { useBranchStore } from '@/entities/branch'
import { HallList } from '@/entities/hall'
import { CreateHallDialog, UpdateHallDialog } from '@/features/hall-form'

import type { IHall } from '@/entities/hall'

export default function HallsPage() {
  const { selectedBranchId } = useBranchStore()
  const [editingHall, setEditingHall] = useState<IHall | null>(null)

  return (
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

        {/* Halls List */}
        {selectedBranchId ? (
          <HallList branchId={selectedBranchId} onEdit={setEditingHall} />
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">
              Выберите филиал в боковой панели для просмотра залов
            </p>
          </div>
        )}

        {/* Update Dialog */}
        {editingHall && (
          <UpdateHallDialog
            hall={editingHall}
            isOpen={!!editingHall}
            onClose={() => setEditingHall(null)}
          />
        )}
      </div>
    </PageContainer>
  )
}
