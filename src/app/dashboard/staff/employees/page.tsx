'use client'

import { useMemo } from 'react'

import { BaseError, BaseLoading } from '@/shared/ui'

import {
  useGetEmployees,
  EmployeeTable,
  createEmployeeColumns,
} from '@/entities/employee'
import { CreateEmployeeDialog } from '@/features/employee-form'

import { EmployeeTableActions } from '../components/employee-table-actions'

export default function EmployeesPage() {
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

  // Handle both array and paginated response
  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : employeesResponse?.data || []
  const totalItems = Array.isArray(employeesResponse)
    ? employeesResponse.length
    : employeesResponse?.meta?.total || 0

  return (
    <div className="space-y-6 p-6 h-full">
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
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <h2 className="text-muted-foreground text-lg font-semibold">
            Сотрудников пока нет
          </h2>
          <CreateEmployeeDialog />
        </div>
      )}

      {employees.length > 0 && (
        <EmployeeTable
          data={employees}
          totalItems={totalItems}
          columns={columns}
        />
      )}
    </div>
  )
}
