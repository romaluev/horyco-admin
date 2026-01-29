'use client'

import * as React from 'react'

import { Link } from '@tanstack/react-router'

import { IconChevronRight, IconPlus, IconTable } from '@tabler/icons-react'

import { usePathname } from '@/shared/lib/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/ui/base/sidebar'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { Icons } from '@/shared/ui/icons'

import { useViews } from '@/entities/dashboard/view'
import { DATASET_CONFIG, ViewTypeModal } from '@/features/dashboard/view-builder'

export function ViewsSidebarSection() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { data: views, isLoading } = useViews()

  // Group views by pageCode (dataset)
  const groupedViews = React.useMemo(() => {
    if (!views) return {}

    return views.reduce(
      (acc, view) => {
        const key = view.pageCode
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(view)
        return acc
      },
      {} as Record<string, typeof views>
    )
  }, [views])

  const hasViews = views && views.length > 0

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Представления">
              <IconTable className="!size-6" />
              <span className="text-[17px]">Представления</span>
              <IconChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Loading State */}
              {isLoading && (
                <>
                  <SidebarMenuSubItem>
                    <Skeleton className="mx-3 h-8 w-32" />
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Skeleton className="mx-3 h-8 w-28" />
                  </SidebarMenuSubItem>
                </>
              )}

              {/* Views List */}
              {!isLoading &&
                hasViews &&
                Object.entries(groupedViews).map(([pageCode, pageViews]) => {
                  const datasetConfig =
                    DATASET_CONFIG[pageCode as keyof typeof DATASET_CONFIG]
                  const Icon =
                    Icons[datasetConfig?.icon as keyof typeof Icons] ||
                    Icons.table

                  return (
                    <React.Fragment key={pageCode}>
                      {/* Dataset Label */}
                      <SidebarMenuSubItem>
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium uppercase text-muted-foreground">
                          <Icon className="size-3" />
                          {datasetConfig?.label || pageCode}
                        </div>
                      </SidebarMenuSubItem>

                      {/* Views in this dataset */}
                      {pageViews.map((view) => (
                        <SidebarMenuSubItem key={view.id}>
                          <SidebarMenuSubButton
                            className="!p-3"
                            asChild
                            isActive={pathname === `/dashboard/views/${view.id}`}
                          >
                            <Link to={`/dashboard/views/${view.id}` as any}>
                              <span className="text-[17px]">{view.name}</span>
                              {view.isPinned && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  *
                                </span>
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </React.Fragment>
                  )
                })}

              {/* Empty State */}
              {!isLoading && !hasViews && (
                <SidebarMenuSubItem>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Нет сохраненных представлений
                  </div>
                </SidebarMenuSubItem>
              )}

              {/* Add View Button - at the end */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  className="!p-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsModalOpen(true)}
                >
                  <IconPlus className="mr-1 size-4" />
                  <span className="text-[17px]">Добавить</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      {/* Modal for creating new view */}
      <ViewTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
