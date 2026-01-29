import { useMemo } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { BaseError, BaseLoading } from '@/shared/ui'

import { EmployeeTableActions } from '@/app/dashboard/staff/components/employee-table-actions'
import {
  useGetEmployees,
  EmployeeTable,
  createEmployeeColumns,
} from '@/entities/organization/employee'
import { CreateEmployeeDialog } from '@/features/organization/employee-form'


export const Route = createFileRoute('/dashboard/_layout/staff/employees')({
  component: EmployeesPage,
})

function EmployeesPage() {
  const { t } = useTranslation('organization')
  const { data: employeesResponse, isLoading, isError } = useGetEmployees()

  const columns = useMemo(
    () =>
      createEmployeeColumns({
        renderActions: (employee) => (
          <EmployeeTableActions employee={employee} />
        ),
      }),
    []
  )

  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : employeesResponse?.data || []
  const totalItems = Array.isArray(employeesResponse)
    ? employeesResponse.length
    : employeesResponse?.meta?.total || 0

  return (
    <>
      <Helmet>
        <title>{t('pages.employees.pageTitle')} | Horyco Admin</title>
      </Helmet>
      <div className="absolute inset-0 flex flex-col gap-6 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('pages.employees.title')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('pages.employees.description')}
            </p>
          </div>
          <CreateEmployeeDialog />
        </div>

        {isLoading && <BaseLoading />}
        {isError && <BaseError message={t('pages.employees.states.loadError')} />}

        {employees.length === 0 && !isLoading && !isError && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h2 className="text-muted-foreground text-lg font-semibold">
              {t('pages.employees.states.empty')}
            </h2>
            <CreateEmployeeDialog />
          </div>
        )}

        {employees.length > 0 && (
          <div className="min-h-0 flex-1 overflow-hidden">
            <EmployeeTable
              data={employees}
              totalItems={totalItems}
              columns={columns}
            />
          </div>
        )}
      </div>
    </>
  )
}
