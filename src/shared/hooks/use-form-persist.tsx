import { useEffect, useCallback, useState, useRef } from 'react'

import { useDebounce } from './use-debounce'

import type { UseFormReturn } from 'react-hook-form'

/**
 * Custom hook for persisting form data to localStorage
 * Automatically saves form state and restores it on mount
 *
 * @param form - React Hook Form instance
 * @param storageKey - Unique key for localStorage
 * @param options - Configuration options
 * @returns Object with clear function and save status
 *
 * @example
 * const form = useForm();
 * const { clearDraft, isDraftSaved } = useFormPersist(form, 'business-info-draft');
 */

interface UseFormPersistOptions {
  /**
   * Exclude specific fields from being persisted
   */
  exclude?: string[]

  /**
   * Debounce delay in milliseconds (default: 500ms)
   */
  debounceDelay?: number

  /**
   * Enable/disable persistence (default: true)
   */
  enabled?: boolean
}

export function useFormPersist<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  storageKey: string,
  options: UseFormPersistOptions = {}
) {
  const { exclude = [], debounceDelay = 500, enabled = true } = options

  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  // Track if initial load has happened to prevent infinite loop
  const hasLoadedRef = useRef(false)

  // Store exclude in ref to avoid re-renders
  const excludeRef = useRef(exclude)
  useEffect(() => {
    excludeRef.current = exclude
  }, [exclude])

  // Watch form values
  const formValues = form.watch()
  const debouncedValues = useDebounce(formValues, debounceDelay)

  /**
   * Load saved draft from localStorage
   */
  const loadDraft = useCallback(() => {
    if (!enabled || hasLoadedRef.current) return false

    try {
      const savedData = localStorage.getItem(storageKey)
      if (savedData) {
        const parsed = JSON.parse(savedData)

        // Filter out excluded fields
        const filteredData = Object.keys(parsed).reduce(
          (acc, key) => {
            if (!excludeRef.current.includes(key)) {
              acc[key] = parsed[key]
            }
            return acc
          },
          {} as Record<string, any>
        ) as T

        // Reset form with saved values
        form.reset(filteredData, { keepDefaultValues: true })

        hasLoadedRef.current = true
        setIsDraftSaved(true)
        return true
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
    return false
  }, [storageKey, enabled])

  /**
   * Clear saved draft from localStorage
   */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
      setIsDraftSaved(false)
      setLastSavedAt(null)
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }
  }, [storageKey])

  /**
   * Check if draft exists
   */
  const hasDraft = useCallback((): boolean => {
    try {
      const savedData = localStorage.getItem(storageKey)
      return !!savedData
    } catch {
      return false
    }
  }, [storageKey])

  // Load draft on mount ONLY ONCE
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadDraft()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save draft when form values change (debounced)
  useEffect(() => {
    if (
      !enabled ||
      !hasLoadedRef.current ||
      Object.keys(debouncedValues).length === 0
    ) {
      return
    }

    try {
      // Filter out excluded fields
      const dataToSave = Object.keys(debouncedValues).reduce(
        (acc, key) => {
          if (
            !excludeRef.current.includes(key) &&
            debouncedValues[key] !== undefined
          ) {
            acc[key] = debouncedValues[key]
          }
          return acc
        },
        {} as Record<string, any>
      )

      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      setIsDraftSaved(true)
      setLastSavedAt(new Date())
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }, [debouncedValues, storageKey, enabled]) // Removed exclude from deps

  /**
   * Manual save function (for explicit saves)
   */
  const saveDraft = useCallback(() => {
    if (!enabled) return

    try {
      const currentValues = form.getValues()
      const dataToSave = Object.keys(currentValues).reduce(
        (acc, key) => {
          if (
            !excludeRef.current.includes(key) &&
            currentValues[key] !== undefined
          ) {
            acc[key] = currentValues[key]
          }
          return acc
        },
        {} as Record<string, any>
      )

      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      setIsDraftSaved(true)
      setLastSavedAt(new Date())
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }, [storageKey, enabled, form])

  return {
    /**
     * Clear the saved draft from localStorage
     */
    clearDraft,

    /**
     * Whether a draft has been saved
     */
    isDraftSaved,

    /**
     * Timestamp of last save
     */
    lastSavedAt,

    /**
     * Check if a draft exists in localStorage
     */
    hasDraft,

    /**
     * Manually load the draft
     */
    loadDraft,

    /**
     * Manually save the draft
     */
    saveDraft,
  }
}
