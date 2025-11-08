import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useHallList } from '../model/queries'

interface IHallSelectorProps {
  branchId: number
  value?: number
  onChange: (hallId: number) => void
  placeholder?: string
}

export const HallSelector = ({
  branchId,
  value,
  onChange,
  placeholder = 'Select Hall',
}: IHallSelectorProps) => {
  const { data: halls, isLoading } = useHallList(branchId)

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    )
  }

  if (!halls || halls.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="No halls found" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {halls.map((hall) => (
          <SelectItem key={hall.id} value={hall.id.toString()}>
            {hall.name} (Floor {hall.floor})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
