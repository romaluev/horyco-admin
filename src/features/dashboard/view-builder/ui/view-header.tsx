'use client'

import * as React from 'react'

import { IconCheck, IconTrash, IconX } from '@tabler/icons-react'

import { useRouter } from '@/shared/lib/navigation'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

import { useViewBuilderStore } from '../model/store'

interface IViewHeaderProps {
  onSave: () => void
  onDelete?: () => void
  isPending?: boolean
  isDeleting?: boolean
}

export function ViewHeader({
  onSave,
  onDelete,
  isPending,
  isDeleting,
}: IViewHeaderProps) {
  const router = useRouter()
  const {
    viewName,
    viewDescription,
    setViewName,
    setViewDescription,
    isEditMode,
    resetConfig,
    savedConfig,
    workingConfig,
  } = useViewBuilderStore()

  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [isEditingDescription, setIsEditingDescription] = React.useState(false)
  const titleInputRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)

  // Use a ref to track the initial name when the view was loaded
  const initialNameRef = React.useRef<string | null>(null)

  // Capture initial name when view is first loaded (savedConfig becomes available)
  React.useEffect(() => {
    if (isEditMode && savedConfig && initialNameRef.current === null) {
      initialNameRef.current = viewName
    }
    // Reset when leaving edit mode
    if (!isEditMode) {
      initialNameRef.current = null
    }
  }, [isEditMode, savedConfig, viewName])

  // Check if there are actual changes
  const hasConfigChanges = React.useMemo(() => {
    if (!savedConfig) {
      // For new views - always show buttons
      return true
    }
    // Compare name change (use ref to get initial value)
    const isNameChanged =
      initialNameRef.current !== null && viewName !== initialNameRef.current
    // Compare config change
    const isConfigChanged =
      JSON.stringify(workingConfig) !== JSON.stringify(savedConfig)
    return isNameChanged || isConfigChanged
  }, [viewName, workingConfig, savedConfig])

  const handleCancel = () => {
    resetConfig()
    router.push('/dashboard/views')
  }

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsEditingTitle(false)
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  const handleDescriptionClick = () => {
    setIsEditingDescription(true)
  }

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false)
  }

  // Auto-resize textarea
  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = descriptionRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const lineHeight = 20 // approx line height in px
      const maxLines = 3
      const maxHeight = lineHeight * maxLines
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [])

  // Focus title input when editing starts
  React.useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditingTitle])

  // Focus and resize description when editing starts
  React.useEffect(() => {
    if (isEditingDescription) {
      descriptionRef.current?.focus()
      adjustTextareaHeight()
    }
  }, [isEditingDescription, adjustTextareaHeight])

  // Adjust height when description changes
  React.useEffect(() => {
    if (isEditingDescription) {
      adjustTextareaHeight()
    }
  }, [viewDescription, isEditingDescription, adjustTextareaHeight])

  return (
    <div className="border-border flex flex-col gap-2 border-b pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          {/* Title - seamless input/display */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              placeholder="Название представления"
              className="placeholder:text-muted-foreground w-full bg-transparent text-2xl font-semibold outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={handleTitleClick}
              className="hover:text-muted-foreground w-full text-left text-2xl font-semibold"
            >
              {viewName || 'Новое представление'}
            </button>
          )}

          {/* Description - auto-resize textarea */}
          {isEditingDescription ? (
            <textarea
              ref={descriptionRef}
              value={viewDescription}
              onChange={(e) => {
                setViewDescription(e.target.value)
                adjustTextareaHeight()
              }}
              onBlur={handleDescriptionBlur}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsEditingDescription(false)
                }
              }}
              placeholder="Добавить описание..."
              className="text-muted-foreground placeholder:text-muted-foreground w-full resize-none overflow-hidden bg-transparent text-sm outline-none"
              rows={1}
            />
          ) : (
            <button
              type="button"
              onClick={handleDescriptionClick}
              className={cn(
                'hover:text-foreground w-full text-left text-sm',
                viewDescription
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/50'
              )}
            >
              {viewDescription || 'Добавить описание...'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Delete button - only in edit mode */}
          {isEditMode && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <IconTrash className="mr-1 size-4" />
            </Button>
          )}

          {/* Cancel and Save buttons - only when there are changes */}
          {hasConfigChanges && (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <IconX className="mr-1 size-4" />
                Отмена
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={!viewName.trim() || isPending}
              >
                <IconCheck className="mr-1 size-4" />
                {isPending && 'Сохранение...'}
                {!isPending && isEditMode && 'Сохранить'}
                {!isPending && !isEditMode && 'Создать'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
