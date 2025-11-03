'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/base/card'
import BaseLoading from '@/shared/ui/base-loading'

import { useGetBranchById } from '../model'
import BranchForm from './branch-form'

interface TBranchViewPageProps {
  branchId: string
}

export default function BranchViewPage({ branchId }: TBranchViewPageProps) {
  const isNew = branchId === 'new'
  const {
    data: branch,
    isLoading,
    isError,
  } = useGetBranchById(Number(branchId))

  if (isError && !isNew) {
    return <div className="p-4 text-red-500">Создать {isError}</div>
  }

  if (!isNew && isLoading) {
    return <BaseLoading className="py-20" />
  }

  if (!isNew && !branch) {
    return <div className="p-4">Филиал не существует</div>
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {isNew
            ? 'Создать новый филиал'
            : `Редактировать филиал: ${branch?.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BranchForm initialData={branch} />
      </CardContent>
    </Card>
  )
}
