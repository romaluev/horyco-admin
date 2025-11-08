import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import type { IBulkBranchItem } from '@/entities/branch'

interface ImportPreviewTableProps {
  data: unknown[]
}

export const ImportPreviewTable = ({ data }: ImportPreviewTableProps) => {
  const branches = data as IBulkBranchItem[]

  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{branch.name}</TableCell>
              <TableCell>{branch.address}</TableCell>
              <TableCell>{branch.phone || '-'}</TableCell>
              <TableCell>{branch.email || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
