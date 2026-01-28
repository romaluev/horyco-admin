import * as React from 'react'

import { useRouter } from '@/shared/lib/navigation'

import { SortBy, SortDirection } from '@/shared/api/graphql'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useDeleteView, useUpdateView, useViewById } from '@/entities/dashboard/view'
import {
  FilterBar,
  DisplaySettings,
  useViewBuilderStore,
  ViewHeader,
} from '@/features/dashboard/view-builder'
import { ViewDataTable } from '@/widgets/views'

import type { IFilter, IViewConfig, IViewDataParams } from '@/entities/dashboard/view'
import type { Dataset } from '@/shared/api/graphql'

interface IViewPageProps {
  id: string
}

export default function ViewPage({ id }: IViewPageProps) {
  const router = useRouter()
  const viewId = id

  const { data: view, isLoading } = useViewById(viewId)
  const { mutate: updateView, isPending } = useUpdateView()
  const { mutate: deleteView, isPending: isDeleting } = useDeleteView()

  const {
    selectedDataset,
    viewName,
    workingConfig,
    loadView,
    resetConfig,
  } = useViewBuilderStore()

  // Load view data into store
  React.useEffect(() => {
    if (view) {
      // Parse config from API response
      const config: IViewConfig = {
        timeframe: view.config.timeframe,
        filters: view.config.filters
          ? (JSON.parse(view.config.filters) as IFilter[])
          : [],
        columns: view.config.columns || [],
        groupBy: view.config.groupBy,
        sorting: view.config.sorting
          ? {
              field: Object.values(SortBy).includes(view.config.sorting.column as SortBy)
                ? (view.config.sorting.column as SortBy)
                : SortBy.REVENUE,
              direction: view.config.sorting.direction,
            }
          : { field: SortBy.REVENUE, direction: SortDirection.DESC },
        display: (view.config.display as 'TABLE' | 'CHART') || 'TABLE',
      }

      loadView(view.id, view.name, config, view.pageCode as Dataset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      resetConfig()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    if (!viewId || !viewName.trim()) return

    updateView(
      {
        id: viewId,
        data: {
          name: viewName,
          config: {
            timeframe: workingConfig.timeframe,
            filters: JSON.stringify(workingConfig.filters),
            columns: workingConfig.columns,
            groupBy: workingConfig.groupBy,
            sorting: {
              column: workingConfig.sorting.field,
              direction: workingConfig.sorting.direction,
            },
            display: workingConfig.display,
          },
        },
      },
      {
        onSuccess: () => {
          router.refresh()
        },
      }
    )
  }

  const handleDelete = () => {
    if (!viewId) return

    deleteView(viewId, {
      onSuccess: () => {
        resetConfig()
        router.push('/dashboard/views')
      },
    })
  }

  // Build data params for table
  const dataParams: IViewDataParams | null = selectedDataset
    ? {
        dataset: selectedDataset,
        period: workingConfig.timeframe,
        sortBy: workingConfig.sorting.field,
        sortDirection: workingConfig.sorting.direction,
        limit: 50,
        filters: workingConfig.filters,
      }
    : null

  if (isLoading) {
    return <ViewPageSkeleton />
  }

  if (!view) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Представление не найдено</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      {/* Header with title/description and save */}
      <ViewHeader
        onSave={handleSave}
        onDelete={handleDelete}
        isPending={isPending}
        isDeleting={isDeleting}
      />

      {/* Toolbar: Filters and Display Settings */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <FilterBar />
        <DisplaySettings />
      </div>

      {/* Data Table */}
      {dataParams && <ViewDataTable params={dataParams} />}
    </div>
  )
}

function ViewPageSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-9 w-[180px]" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="ml-auto h-9 w-32" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
