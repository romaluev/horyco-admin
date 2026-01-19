'use client'

import { useState } from 'react'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Input } from '@/shared/ui/base/input'

import { useBulkCreateBranches, type IBulkBranchItem, type IBulkImportResponse } from '@/entities/organization/branch'

import { ImportPreviewTable } from './import-preview-table'
import { ImportResults } from './import-results'
import { parseCsv } from '../lib/parse-csv'
import { validateImportData } from '../lib/validate-import-data'

interface BulkImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type Step = 'upload' | 'preview' | 'results'

export const BulkImportDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: BulkImportDialogProps) => {
  const [step, setStep] = useState<Step>('upload')
  const [validData, setValidData] = useState<IBulkBranchItem[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [results, setResults] = useState<IBulkImportResponse | null>(null)

  const { mutate: bulkImport, isPending } = useBulkCreateBranches()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    const { data, errors: parseErrors } = await parseCsv(selectedFile)

    if (parseErrors.length > 0) {
      setErrors(parseErrors)
      return
    }

    const { valid, invalid } = validateImportData(data)
    setValidData(valid)
    setErrors(invalid.map((e) => `Строка ${e.row}: ${e.message}`))
    setStep('preview')
  }

  const handleImport = () => {
    bulkImport(
      { branches: validData },
      {
        onSuccess: (data) => {
          setResults(data)
          setStep('results')
          if (data.failed === 0) {
            onSuccess?.()
          }
        },
      }
    )
  }

  const handleClose = () => {
    setStep('upload')
    setValidData([])
    setErrors([])
    setResults(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Массовый импорт филиалов</DialogTitle>
          <DialogDescription>
            Загрузите CSV файл с данными филиалов
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isPending}
            />
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>{errors.join(', ')}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'preview' && <ImportPreviewTable data={validData} />}

        {step === 'results' && results && <ImportResults results={results} />}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {step === 'results' ? 'Закрыть' : 'Отмена'}
          </Button>
          {step === 'preview' && (
            <Button onClick={handleImport} disabled={isPending}>
              {isPending ? 'Импорт...' : `Импортировать (${validData.length})`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
