import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import type { IBulkImportResponse } from '@/entities/branch'

interface ImportResultsProps {
  results: IBulkImportResponse
}

export const ImportResults = ({ results }: ImportResultsProps) => {
  const hasErrors = results.failed > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Alert>
          <AlertDescription>
            Успешно создано: <strong>{results.success}</strong>
          </AlertDescription>
        </Alert>
        {hasErrors && (
          <Alert variant="destructive">
            <AlertDescription>
              Ошибок: <strong>{results.failed}</strong>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {hasErrors && (
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Строка</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Ошибка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.results
                .filter((r) => r.error)
                .map((result) => (
                  <TableRow key={result.index}>
                    <TableCell>{result.index + 1}</TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell className="text-destructive">
                      {result.error}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
