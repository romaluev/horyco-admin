'use client'

import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Dataset } from '@/shared/api/graphql'

import { useCreateView } from '@/entities/dashboard/view'
import {
  DATASET_CONFIG,
  FilterBar,
  DisplaySettings,
  useViewBuilderStore,
  ViewHeader,
} from '@/features/dashboard/view-builder'
import { ViewDataTable } from '@/widgets/views'

import type { IViewDataParams } from '@/entities/dashboard/view'

export default function NewViewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')?.toUpperCase() as Dataset | undefined

  const {
    selectedDataset,
    setDataset,
    viewName,
    workingConfig,
    resetConfig,
  } = useViewBuilderStore()

  const { mutate: createView, isPending } = useCreateView()

  // Initialize dataset from URL param
  React.useEffect(() => {
    if (typeParam && Object.values(Dataset).includes(typeParam)) {
      setDataset(typeParam)
    } else if (!selectedDataset) {
      // If no type param and no dataset selected, redirect to views list
      router.push('/dashboard/views')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      resetConfig()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    if (!selectedDataset || !viewName.trim()) return

    createView(
      {
        pageCode: selectedDataset,
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
      {
        onSuccess: (data) => {
          // Navigate to the newly created view
          router.push(`/dashboard/views/${data.id}`)
        },
      }
    )
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

  const datasetConfig = selectedDataset
    ? DATASET_CONFIG[selectedDataset]
    : null

  if (!selectedDataset || !datasetConfig) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:p-6">
      {/* Header with title/description and save */}
      <ViewHeader onSave={handleSave} isPending={isPending} />

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
