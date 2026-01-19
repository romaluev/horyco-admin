import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DASHBOARD_STORAGE_KEY,
  DEFAULT_DASHBOARD_CONFIG,
  WIDGET_SIZE_MAP,
} from './constants'

import type {
  DashboardConfig,
  WidgetConfig,
  WidgetLayoutItem,
} from './types'

interface DashboardState {
  // State
  config: DashboardConfig
  isEditMode: boolean
  selectedWidgetId: string | null
  isDirty: boolean
  hasHydrated: boolean

  // Hydration
  setHasHydrated: (state: boolean) => void

  // Edit mode
  setEditMode: (isEdit: boolean) => void
  toggleEditMode: () => void

  // Widget operations
  addWidget: (
    widget: WidgetConfig,
    position?: { x: number; y: number }
  ) => void
  updateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => void
  removeWidget: (widgetId: string) => void
  duplicateWidget: (widgetId: string) => void

  // Layout operations
  updateLayout: (layout: WidgetLayoutItem[]) => void

  // Selection
  selectWidget: (widgetId: string | null) => void

  // Reset & Export
  resetToDefault: () => void
  exportConfig: () => string
  importConfig: (json: string) => boolean
}

const CONFIG_VERSION = 1

export const useDashboardWidgetStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Initial state
      config: DEFAULT_DASHBOARD_CONFIG,
      isEditMode: false,
      selectedWidgetId: null,
      isDirty: false,
      hasHydrated: false,

      // Hydration
      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Edit mode
      setEditMode: (isEdit) => set({ isEditMode: isEdit }),
      toggleEditMode: () =>
        set((state) => ({
          isEditMode: !state.isEditMode,
          selectedWidgetId: null,
        })),

      // Widget operations
      addWidget: (widget, position) =>
        set((state) => {
          const sizeConfig = WIDGET_SIZE_MAP[widget.size]
          // Calculate next y position based on existing layout
          const maxY = state.config.layout.reduce((max, item) => {
            const itemBottom = (item.y ?? 0) + (item.h ?? 1)
            return Math.max(max, itemBottom)
          }, 0)
          const newLayout: WidgetLayoutItem = {
            i: widget.id,
            x: position?.x ?? 0,
            y: position?.y ?? maxY,
            w: sizeConfig.w,
            h: sizeConfig.h,
            minW: sizeConfig.minW,
            minH: sizeConfig.minH,
            maxW: sizeConfig.maxW,
            maxH: sizeConfig.maxH,
          }

          return {
            config: {
              ...state.config,
              widgets: {
                ...state.config.widgets,
                [widget.id]: widget,
              },
              layout: [...state.config.layout, newLayout],
              updatedAt: new Date().toISOString(),
            },
            isDirty: true,
          }
        }),

      updateWidget: (widgetId, updates) =>
        set((state) => {
          const widget = state.config.widgets[widgetId]
          if (!widget) return state

          const updatedWidget = { ...widget, ...updates }

          // Update layout if size changed
          let newLayout = state.config.layout
          if (updates.size && updates.size !== widget.size) {
            const sizeConfig = WIDGET_SIZE_MAP[updates.size]
            newLayout = state.config.layout.map((item) =>
              item.i === widgetId
                ? {
                    ...item,
                    w: sizeConfig.w,
                    h: sizeConfig.h,
                    minW: sizeConfig.minW,
                    minH: sizeConfig.minH,
                    maxW: sizeConfig.maxW,
                    maxH: sizeConfig.maxH,
                  }
                : item
            )
          }

          return {
            config: {
              ...state.config,
              widgets: {
                ...state.config.widgets,
                [widgetId]: updatedWidget,
              },
              layout: newLayout,
              updatedAt: new Date().toISOString(),
            },
            isDirty: true,
          }
        }),

      removeWidget: (widgetId) =>
        set((state) => {
          const { [widgetId]: _, ...remainingWidgets } = state.config.widgets
          return {
            config: {
              ...state.config,
              widgets: remainingWidgets,
              layout: state.config.layout.filter((item) => item.i !== widgetId),
              updatedAt: new Date().toISOString(),
            },
            selectedWidgetId:
              state.selectedWidgetId === widgetId
                ? null
                : state.selectedWidgetId,
            isDirty: true,
          }
        }),

      duplicateWidget: (widgetId) =>
        set((state) => {
          const widget = state.config.widgets[widgetId]
          if (!widget) return state

          const newId = `widget-${Date.now()}`
          const newWidget: WidgetConfig = {
            ...widget,
            id: newId,
            name: `${widget.name} (копия)`,
          }

          // Calculate next y position based on existing layout
          const maxY = state.config.layout.reduce((max, item) => {
            const itemBottom = (item.y ?? 0) + (item.h ?? 1)
            return Math.max(max, itemBottom)
          }, 0)
          const originalLayout = state.config.layout.find(
            (l) => l.i === widgetId
          )
          const sizeConfig = WIDGET_SIZE_MAP[widget.size]
          const newLayout: WidgetLayoutItem = {
            i: newId,
            x: originalLayout?.x ?? 0,
            y: maxY,
            w: sizeConfig.w,
            h: sizeConfig.h,
            minW: sizeConfig.minW,
            minH: sizeConfig.minH,
            maxW: sizeConfig.maxW,
            maxH: sizeConfig.maxH,
          }

          return {
            config: {
              ...state.config,
              widgets: {
                ...state.config.widgets,
                [newId]: newWidget,
              },
              layout: [...state.config.layout, newLayout],
              updatedAt: new Date().toISOString(),
            },
            isDirty: true,
          }
        }),

      // Layout operations
      updateLayout: (layout) =>
        set((state) => ({
          config: {
            ...state.config,
            layout,
            updatedAt: new Date().toISOString(),
          },
          isDirty: true,
        })),

      // Selection
      selectWidget: (widgetId) => set({ selectedWidgetId: widgetId }),

      // Reset & Export
      resetToDefault: () =>
        set({
          config: {
            ...DEFAULT_DASHBOARD_CONFIG,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isEditMode: false,
          selectedWidgetId: null,
          isDirty: false,
        }),

      exportConfig: () => JSON.stringify(get().config, null, 2),

      importConfig: (json) => {
        try {
          const parsed = JSON.parse(json) as DashboardConfig
          if (parsed.version !== CONFIG_VERSION) {
            console.warn('Config version mismatch, migration may be needed')
          }
          set({
            config: parsed,
            isDirty: true,
          })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: DASHBOARD_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
      }),
      version: CONFIG_VERSION,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
