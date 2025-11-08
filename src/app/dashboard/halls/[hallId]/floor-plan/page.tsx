import Link from 'next/link'

import { IconArrowLeft } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { FloorPlanContent } from './floor-plan-content'

interface IFloorPlanPageProps {
  params: Promise<{
    hallId: string
  }>
}

export default async function FloorPlanPage(props: IFloorPlanPageProps) {
  const params = await props.params
  const hallId = Number(params.hallId)

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/halls">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Halls
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
        <FloorPlanContent hallId={hallId} />
      </div>
    </PageContainer>
  )
}
