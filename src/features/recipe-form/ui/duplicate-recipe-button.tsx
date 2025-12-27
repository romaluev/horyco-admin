'use client'

import { IconCopy } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { useDuplicateRecipe } from '@/entities/recipe'

interface IDuplicateRecipeButtonProps {
  recipeId: number
  onSuccess?: () => void
}

export const DuplicateRecipeButton = ({
  recipeId,
  onSuccess,
}: IDuplicateRecipeButtonProps) => {
  const { mutate: duplicateRecipe, isPending } = useDuplicateRecipe()

  const handleDuplicate = () => {
    duplicateRecipe(recipeId, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDuplicate}
      disabled={isPending}
      title="Дублировать техкарту"
    >
      <IconCopy className="h-4 w-4" />
    </Button>
  )
}
