/**
 * View Builder Store
 * Zustand store for managing view configuration state
 */

import { create } from 'zustand'

// PeriodType imported via DEFAULT_VIEW_CONFIG

import { DATASET_CONFIG, DEFAULT_VIEW_CONFIG } from './constants'

import type {
  IColumnDef,
  IFilter,
  IFilterDef,
  IViewConfig,
  ChartType,
  ChartMetric,
  WidgetType,
  IViewWidget,
} from '@/entities/dashboard/view'
import type { Dataset, GroupBy, SortBy, SortDirection } from '@/shared/api/graphql'

// Stable empty arrays for selectors (prevents infinite loops)
const EMPTY_COLUMNS: readonly IColumnDef[] = []
const EMPTY_FILTERS: readonly IFilterDef[] = []

// ============================================
// STORE INTERFACE
// ============================================

interface IViewBuilderStore {
  // Meta
  viewId: string | null
  viewName: string
  viewDescription: string
  isEditMode: boolean

  // Dataset
  selectedDataset: Dataset | null

  // Working config
  workingConfig: IViewConfig

  // Original config for comparison
  savedConfig: IViewConfig | null

  // Actions - Meta
  setViewId: (id: string | null) => void
  setViewName: (name: string) => void
  setViewDescription: (description: string) => void
  setEditMode: (isEdit: boolean) => void

  // Actions - Dataset
  setDataset: (dataset: Dataset) => void

  // Actions - Config
  updateConfig: (partial: Partial<IViewConfig>) => void
  setTimeframe: (timeframe: IViewConfig['timeframe']) => void
  setColumns: (columns: string[]) => void
  toggleColumn: (column: string) => void
  setSorting: (field: SortBy, direction: SortDirection) => void
  setGroupBy: (groupBy: GroupBy | undefined) => void
  setDisplay: (display: 'TABLE' | 'CHART') => void

  // Actions - Chart
  setChartType: (type: ChartType) => void
  setChartMetric: (metric: ChartMetric) => void
  setChartGroupBy: (groupBy: GroupBy) => void

  // Actions - Widgets
  addWidget: (type: WidgetType) => void
  removeWidget: (id: string) => void
  reorderWidgets: (widgets: IViewWidget[]) => void

  // Actions - KPI
  toggleKpiCards: (show: boolean) => void
  setKpiTypes: (types: string[]) => void

  // Actions - Filters
  addFilter: (filter: IFilter) => void
  updateFilter: (index: number, filter: IFilter) => void
  removeFilter: (index: number) => void
  clearFilters: () => void

  // Actions - State management
  loadView: (viewId: string, name: string, config: IViewConfig, dataset: Dataset) => void
  resetConfig: () => void
  hasUnsavedChanges: () => boolean

  // Computed
  getConfigForSave: () => IViewConfig
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useViewBuilderStore = create<IViewBuilderStore>((set, get) => ({
  // Initial state
  viewId: null,
  viewName: '',
  viewDescription: '',
  isEditMode: false,
  selectedDataset: null,
  workingConfig: { ...DEFAULT_VIEW_CONFIG },
  savedConfig: null,

  // Actions - Meta
  setViewId: (id) => set({ viewId: id }),

  setViewName: (name) => set({ viewName: name }),

  setViewDescription: (description) => set({ viewDescription: description }),

  setEditMode: (isEdit) => set({ isEditMode: isEdit }),

  // Actions - Dataset
  setDataset: (dataset) => {
    const datasetConfig = DATASET_CONFIG[dataset]
    const defaultColumns = datasetConfig?.defaultColumns || []

    set({
      selectedDataset: dataset,
      workingConfig: {
        ...DEFAULT_VIEW_CONFIG,
        columns: defaultColumns,
      },
    })
  },

  // Actions - Config
  updateConfig: (partial) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, ...partial },
    })),

  setTimeframe: (timeframe) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, timeframe },
    })),

  setColumns: (columns) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, columns },
    })),

  toggleColumn: (column) =>
    set((state) => {
      const columns = state.workingConfig.columns.includes(column)
        ? state.workingConfig.columns.filter((c) => c !== column)
        : [...state.workingConfig.columns, column]
      return { workingConfig: { ...state.workingConfig, columns } }
    }),

  setSorting: (field, direction) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        sorting: { field, direction },
      },
    })),

  setGroupBy: (groupBy) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, groupBy },
    })),

  setDisplay: (display) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, display },
    })),

  // Actions - Chart
  setChartType: (type) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        chart: { ...state.workingConfig.chart, type } as IViewConfig['chart'],
      },
    })),

  setChartMetric: (metric) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        chart: { ...state.workingConfig.chart, metric } as IViewConfig['chart'],
      },
    })),

  setChartGroupBy: (groupBy) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        chart: { ...state.workingConfig.chart, groupBy } as IViewConfig['chart'],
      },
    })),

  // Actions - Widgets
  addWidget: (type) =>
    set((state) => {
      const newWidget: IViewWidget = {
        id: `widget-${Date.now()}`,
        type,
        position: (state.workingConfig.widgets?.length ?? 0) + 1,
      }
      return {
        workingConfig: {
          ...state.workingConfig,
          widgets: [...(state.workingConfig.widgets ?? []), newWidget],
        },
      }
    }),

  removeWidget: (id) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        widgets: state.workingConfig.widgets?.filter((w) => w.id !== id) ?? [],
      },
    })),

  reorderWidgets: (widgets) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, widgets },
    })),

  // Actions - KPI
  toggleKpiCards: (show) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, showKpiCards: show },
    })),

  setKpiTypes: (types) =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, kpiTypes: types },
    })),

  // Actions - Filters
  addFilter: (filter) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        filters: [...state.workingConfig.filters, filter],
      },
    })),

  updateFilter: (index, filter) =>
    set((state) => {
      const filters = [...state.workingConfig.filters]
      filters[index] = filter
      return { workingConfig: { ...state.workingConfig, filters } }
    }),

  removeFilter: (index) =>
    set((state) => ({
      workingConfig: {
        ...state.workingConfig,
        filters: state.workingConfig.filters.filter((_, i) => i !== index),
      },
    })),

  clearFilters: () =>
    set((state) => ({
      workingConfig: { ...state.workingConfig, filters: [] },
    })),

  // Actions - State management
  loadView: (viewId, name, config, dataset) =>
    set({
      viewId,
      viewName: name,
      isEditMode: true,
      selectedDataset: dataset,
      workingConfig: { ...config },
      savedConfig: { ...config },
    }),

  resetConfig: () =>
    set({
      viewId: null,
      viewName: '',
      viewDescription: '',
      isEditMode: false,
      selectedDataset: null,
      workingConfig: { ...DEFAULT_VIEW_CONFIG },
      savedConfig: null,
    }),

  hasUnsavedChanges: () => {
    const { workingConfig, savedConfig, viewName } = get()

    // For new views, check if anything has been configured
    if (!savedConfig) {
      return (
        viewName.trim() !== '' ||
        workingConfig.filters.length > 0 ||
        workingConfig.columns.length > 0
      )
    }

    // For existing views, compare with saved config
    return JSON.stringify(workingConfig) !== JSON.stringify(savedConfig)
  },

  // Computed
  getConfigForSave: () => {
    return get().workingConfig
  },
}))

// ============================================
// SELECTORS
// ============================================

export const selectDatasetConfig = (state: IViewBuilderStore) => {
  if (!state.selectedDataset) return null
  return DATASET_CONFIG[state.selectedDataset]
}

export const selectAvailableColumns = (state: IViewBuilderStore) => {
  const config = selectDatasetConfig(state)
  return config?.columns ?? EMPTY_COLUMNS
}

export const selectAvailableFilters = (state: IViewBuilderStore) => {
  const config = selectDatasetConfig(state)
  return config?.filters ?? EMPTY_FILTERS
}
