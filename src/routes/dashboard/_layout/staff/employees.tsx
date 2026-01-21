import { useMemo } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import { BaseError, BaseLoading } from '@/shared/ui'

import {
  useGetEmployees,
  EmployeeTable,
  createEmployeeColumns,
} from '@/entities/organization/employee'
import { CreateEmployeeDialog } from '@/features/organization/employee-form'

import { EmployeeTableActions } from '@/app/dashboard/staff/components/employee-table-actions'

export const Route = createFileRoute('/dashboard/_layout/staff/employees')({
  component: EmployeesPage,
})

function EmployeesPage() {
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
        <title>Сотрудники | Horyco Admin</title>
      </Helmet>
      <div className="absolute inset-0 flex flex-col gap-6 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Сотрудники</h1>
            <p className="text-muted-foreground text-sm">
              Управление сотрудниками и их данными
            </p>
          </div>
          <CreateEmployeeDialog />
        </div>

        {isLoading && <BaseLoading />}
        {isError && <BaseError message="Ошибка при загрузке сотрудников" />}

        {employees.length === 0 && !isLoading && !isError && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h2 className="text-muted-foreground text-lg font-semibold">
              Сотрудников пока нет
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
