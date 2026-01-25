import { createFileRoute, Link } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { IconArrowLeft } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { FloorPlanContent } from '@/app/dashboard/halls/[hallId]/floor-plan/floor-plan-content'

export const Route = createFileRoute('/dashboard/_layout/halls/$hallId/floor-plan')({
  component: FloorPlanPage,
})

function FloorPlanPage() {
  const { hallId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>План зала | Horyco Admin</title>
      </Helmet>
      <PageContainer>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/halls">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Назад к залам
                </Link>
              </Button>
            </div>
          </div>
          <Separator />
          <FloorPlanContent hallId={Number(hallId)} />
        </div>
      </PageContainer>
    </>
  )
}
