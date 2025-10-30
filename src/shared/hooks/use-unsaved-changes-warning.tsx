import { useEffect, useCallback } from 'react';

import { useRouter } from 'next/navigation';

/**
 * Custom hook to warn users about unsaved changes when navigating away
 *
 * @param isDirty - Whether the form has unsaved changes
 * @param message - Custom warning message
 *
 * @example
 * const form = useForm();
 * useUnsavedChangesWarning(form.formState.isDirty);
 */

interface UseUnsavedChangesWarningOptions {
  /**
   * Whether the warning is enabled
   */
  enabled?: boolean;

  /**
   * Custom warning message
   */
  message?: string;
}

export function useUnsavedChangesWarning(
  isDirty: boolean,
  options: UseUnsavedChangesWarningOptions = {}
) {
  const {
    enabled = true,
    message = 'У вас есть несохранённые изменения. Вы уверены, что хотите покинуть страницу?'
  } = options;

  const router = useRouter();

  /**
   * Handle browser/tab close or refresh
   */
  useEffect(() => {
    if (!enabled || !isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard way to trigger browser confirmation dialog
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, enabled, message]);

  /**
   * Confirm navigation away from the page
   * This can be called manually before programmatic navigation
   */
  const confirmNavigation = useCallback((): boolean => {
    if (!enabled || !isDirty) return true;
    return window.confirm(message);
  }, [isDirty, enabled, message]);

  return {
    /**
     * Call this before programmatic navigation to show confirmation
     */
    confirmNavigation,

    /**
     * Whether the form has unsaved changes
     */
    hasUnsavedChanges: isDirty
  };
}
