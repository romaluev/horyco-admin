'use client'

import { useState } from 'react'

import { formatPrice } from '@/shared/lib/format'
import { BaseError, BaseLoading } from '@/shared/ui'
import { Button } from '@/shared/ui/base/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/base/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { InvoiceStatusBadge, useGetInvoices } from '@/entities/organization/subscription'

import { InvoiceDetailDialog } from './invoice-detail-dialog'

const INVOICES_PER_PAGE = 10

export const InvoicesList = () => {
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)

  const { data: invoiceList, isLoading, error } = useGetInvoices(page, INVOICES_PER_PAGE)

  if (isLoading) return <BaseLoading className="py-10" />
  if (error)
    return <BaseError className="py-10" message="Ошибка загрузки счетов-фактур" />
  if (!invoiceList || invoiceList.data.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">Счета-фактуры не найдены</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Номер счета</TableHead>
              <TableHead>Период</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceList.data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell className="text-sm">
                  {new Date(invoice.periodStart).toLocaleDateString('ru-RU')} -{' '}
                  {new Date(invoice.periodEnd).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(invoice.amountDue)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInvoiceId(invoice.id)}
                  >
                    Просмотр
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {invoiceList.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(page - 1)} />
              </PaginationItem>
            )}

            {Array.from({ length: invoiceList.totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < invoiceList.totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => setPage(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {selectedInvoiceId && (
        <InvoiceDetailDialog
          invoiceId={selectedInvoiceId}
          isOpen={Boolean(selectedInvoiceId)}
          onOpenChange={(open) => {
            if (!open) setSelectedInvoiceId(null)
          }}
        />
      )}
    </>
  )
}
