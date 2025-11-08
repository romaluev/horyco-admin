'use client'

import { useRouter } from 'next/navigation'

import { Eye } from 'lucide-react'

import { Button } from './base/button'

interface ViewBranchButtonProps {
  branchId: number
}

export const ViewBranchButton = ({ branchId }: ViewBranchButtonProps) => {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(`/dashboard/branches/${branchId}`)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  )
}
