import { Badge } from '@/shared/ui/base/badge'

interface ModuleTrialIndicatorProps {
  isInTrial: boolean
  daysRemaining?: number
}

export const ModuleTrialIndicator = ({
  isInTrial,
  daysRemaining,
}: ModuleTrialIndicatorProps) => {
  if (!isInTrial) return null

  return (
    <Badge variant="secondary">
      Пробный период: {daysRemaining} дн.
    </Badge>
  )
}
