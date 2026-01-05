'use client'

import * as React from 'react'

import Link from 'next/link'

import { IconPlus, IconTrash } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { Icons } from '@/shared/ui/icons'

import { useDeleteView, useViews } from '@/entities/view'
import { DATASET_CONFIG, ViewTypeModal } from '@/features/view-builder'

export default function ViewsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { data: views, isLoading } = useViews()
  const { mutate: deleteView } = useDeleteView()

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteView(id)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Представления</h1>
          <p className="text-sm text-muted-foreground">
            Создавайте и управляйте аналитическими представлениями
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <IconPlus className="mr-1 size-4" />
          Создать
        </Button>
      </div>

      {/* Views Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : views && views.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {views.map((view) => {
            const datasetConfig =
              DATASET_CONFIG[view.pageCode as keyof typeof DATASET_CONFIG]
            const Icon =
              Icons[datasetConfig?.icon as keyof typeof Icons] || Icons.table

            return (
              <Link key={view.id} href={`/dashboard/views/${view.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {view.name}
                            {view.isPinned && (
                              <span className="ml-1 text-muted-foreground">
                                *
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {datasetConfig?.label || view.pageCode}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(view.id, e)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Создано:{' '}
                      {new Date(view.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Icons.table className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">Нет представлений</p>
            <p className="text-sm text-muted-foreground">
              Создайте первое представление для анализа данных
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <IconPlus className="mr-1 size-4" />
            Создать представление
          </Button>
        </div>
      )}

      {/* Create View Modal */}
      <ViewTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
