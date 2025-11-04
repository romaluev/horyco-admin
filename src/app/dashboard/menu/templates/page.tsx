/**
 * Menu Templates Page
 * Browse and apply menu templates
 */

'use client'

import type { JSX } from 'react'
import { useMemo, useState } from 'react'

import { Sparkles, Star } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import {
  type IMenuTemplate,
  useGetBusinessTypes,
  useGetTemplates,
} from '@/entities/menu-template'
import {
  ApplyTemplateDialog,
  TemplatePreviewCard,
} from '@/features/template-selector'

export default function MenuTemplatesPage(): JSX.Element {
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<string>('all')
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'premium'>(
    'all'
  )
  const [selectedTemplate, setSelectedTemplate] =
    useState<IMenuTemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: businessTypes = [], isLoading: isLoadingBusinessTypes } =
    useGetBusinessTypes()
  const { data: templates, isLoading: isLoadingTemplates } = useGetTemplates()

  // Ensure templates is always an array
  const templatesArray = Array.isArray(templates) ? templates : []

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templatesArray.filter((template) => {
      const isBusinessTypeMatch =
        selectedBusinessType === 'all' ||
        template.businessType === selectedBusinessType

      let isTypeMatch = true
      if (filterType === 'popular') {
        isTypeMatch = template.isPopular
      } else if (filterType === 'premium') {
        isTypeMatch = template.isPremium
      }

      return isBusinessTypeMatch && isTypeMatch
    })
  }, [templatesArray, selectedBusinessType, filterType])

  // Statistics
  const stats = useMemo(() => {
    return {
      total: templatesArray.length,
      popular: templatesArray.filter((t) => t.isPopular).length,
      premium: templatesArray.filter((t) => t.isPremium).length,
      businessTypes: new Set(templatesArray.map((t) => t.businessType)).size,
    }
  }, [templatesArray])

  const handleSelectTemplate = (template: IMenuTemplate): void => {
    setSelectedTemplate(template)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-4 pt-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Шаблоны меню</h1>
        <p className="text-muted-foreground">
          Выберите готовый шаблон меню для быстрого старта
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего шаблонов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Популярные</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.popular}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Типы заведений
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.businessTypes}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Каталог шаблонов</CardTitle>
              <CardDescription>
                Просмотрите и примените готовые решения
              </CardDescription>
            </div>
            <Select
              value={selectedBusinessType}
              onValueChange={setSelectedBusinessType}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {businessTypes.map((bt) => (
                  <SelectItem key={bt.type} value={bt.type}>
                    {bt.name} ({bt.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={filterType}
            onValueChange={(v) =>
              setFilterType(v as 'all' | 'popular' | 'premium')
            }
          >
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="popular">Популярные</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value={filterType} className="mt-6">
              {isLoadingTemplates || isLoadingBusinessTypes ? (
                <div className="text-muted-foreground py-12 text-center">
                  Загрузка шаблонов...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center">
                  {templatesArray.length === 0
                    ? 'Нет доступных шаблонов'
                    : 'Нет шаблонов с выбранными фильтрами'}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTemplates.map((template) => (
                    <TemplatePreviewCard
                      key={template.id}
                      template={template}
                      onSelect={handleSelectTemplate}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ApplyTemplateDialog
        template={selectedTemplate}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
