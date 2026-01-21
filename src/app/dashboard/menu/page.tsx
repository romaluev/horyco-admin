/**
 * Menu Management Landing Page
 * Overview and quick access to menu management sections
 */

'use client'


import { Link } from '@tanstack/react-router'

import {
  ArrowRight,
  Building2,
  FolderTree,
  Package,
  Plus,
  Settings,
} from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { useGetAdditions } from '@/entities/menu/addition'
import { useGetCategories } from '@/entities/menu/category'
import { useGetModifiers } from '@/entities/menu/modifier'
import { useGetProducts } from '@/entities/menu/product'

import type { JSX } from 'react'

const menuSections = [
  {
    title: 'Категории',
    description: 'Управление иерархической структурой категорий меню',
    icon: FolderTree,
    href: '/dashboard/menu/categories',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Продукты',
    description: 'Управление продуктами, ценами и доступностью',
    icon: Package,
    href: '/dashboard/menu/products',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Модификаторы',
    description: 'Настройка модификаторов для продуктов',
    icon: Settings,
    href: '/dashboard/menu/modifiers',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Дополнения',
    description: 'Управление дополнениями к продуктам',
    icon: Plus,
    href: '/dashboard/menu/additions',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Переопределения филиалов',
    description: 'Индивидуальные настройки для каждого филиала',
    icon: Building2,
    href: '/dashboard/menu/branch-overrides',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
]

export default function MenuPage(): JSX.Element {
  const { data: categories = [] } = useGetCategories()
  const { data: productsData } = useGetProducts()
  const { data: modifiers = [] } = useGetModifiers()
  const { data: additions = [] } = useGetAdditions()

  const stats = [
    {
      label: 'Категории',
      value: categories.length,
      href: '/dashboard/menu/categories',
    },
    {
      label: 'Продукты',
      value: productsData?.total || 0,
      href: '/dashboard/menu/products',
    },
    {
      label: 'Модификаторы',
      value: modifiers.length,
      href: '/dashboard/menu/modifiers',
    },
    {
      label: 'Дополнения',
      value: additions.length,
      href: '/dashboard/menu/additions',
    },
  ]

  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Управление меню</h1>
        <p className="text-muted-foreground">
          Полное управление структурой меню, продуктами и настройками
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.href}>
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuSections.map((section) => {
          const Icon = section.icon
          return (
            <Card
              key={section.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-lg p-3 ${section.bgColor} ${section.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={section.href}>
                  <Button className="w-full" variant="outline">
                    Перейти
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрый старт</CardTitle>
          <CardDescription>
            Советы по организации структуры меню
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Рекомендуемый порядок настройки:</h3>
            <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
              <li>Создайте структуру категорий (иерархию)</li>
              <li>Добавьте продукты и привяжите их к категориям</li>
              <li>Настройте модификаторы для продуктов (опционально)</li>
              <li>Добавьте дополнения к продуктам (опционально)</li>
              <li>
                Создайте переопределения для филиалов (если требуется разная
                цена/доступность)
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
