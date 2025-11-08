'use client'

import { useState } from 'react'

import { Heading } from '@/shared/ui/base/heading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetAllBranches } from '@/entities/branch'
import { HallList } from '@/entities/hall'
import { CreateHallDialog, UpdateHallDialog } from '@/features/hall-form'

import type { IHall } from '@/entities/hall'

export default function HallsPage() {
  const { data: branchesData } = useGetAllBranches()
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [editingHall, setEditingHall] = useState<IHall | null>(null)

  const branches = branchesData?.items || []

  // Auto-select first branch if available
  if (branches.length > 0 && selectedBranchId === null && branches[0]) {
    setSelectedBranchId(branches[0].id)
  }

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

        {/* Branch Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Выберите филиал:</span>
          <Select
            value={selectedBranchId?.toString()}
            onValueChange={(val) => setSelectedBranchId(Number(val))}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Выберите филиал" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Halls List */}
        {selectedBranchId ? (
          <HallList branchId={selectedBranchId} onEdit={setEditingHall} />
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">
              Select a branch to view halls
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
