/**
 * Modifiers Page
 * Manage modifier groups and modifiers
 */

'use client'

import { useState } from 'react'

import {
  MoreVertical,
  Plus,
  Pencil,
  Search,
  Settings,
  Trash2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { BaseLoading } from '@/shared/ui'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/base/accordion'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'
import { Input } from '@/shared/ui/base/input'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetModifierGroups,
  useDeleteModifierGroup,
  useDeleteModifier,
  type IModifierGroup,
  type IModifier,
} from '@/entities/menu/modifier-group'
import {
  CreateModifierGroupDialog,
  CreateModifierDialog,
  UpdateModifierGroupDialog,
  UpdateModifierDialog,
} from '@/features/menu/modifier-group-form'

import type { JSX } from 'react'

interface PageHeaderProps {
  onCreateGroup: () => void
}

const PageHeader = ({ onCreateGroup }: PageHeaderProps) => {
  const { t } = useTranslation('menu')

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t('pages.modifiers.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('pages.modifiers.description')}
        </p>
      </div>
      <CreateModifierGroupDialog
        trigger={
          <Button onClick={onCreateGroup}>
            <Plus className="mr-2 h-4 w-4" />
            {t('pages.modifiers.actions.createGroup')}
          </Button>
        }
      />
    </div>
  )
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const { t } = useTranslation('menu')

  return (
    <div className="flex items-center gap-2">
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          placeholder={t('pages.modifiers.filters.searchPlaceholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  )
}

interface EmptyStateProps {
  hasSearch: boolean
}

const EmptyState = ({ hasSearch }: EmptyStateProps) => {
  const { t } = useTranslation('menu')

  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <p className="text-muted-foreground text-lg font-medium">
          {hasSearch
            ? t('pages.modifiers.empty.notFound')
            : t('pages.modifiers.empty.noGroups')}
        </p>
        <p className="text-muted-foreground text-sm">
          {hasSearch
            ? t('pages.modifiers.empty.tryChangeQuery')
            : t('pages.modifiers.empty.createFirst')}
        </p>
      </div>
    </div>
  )
}

interface ModifierGroupStatsProps {
  totalGroups: number
  requiredGroups: number
  totalModifiers: number
}

const ModifierGroupStats = ({
  totalGroups,
  requiredGroups,
  totalModifiers,
}: ModifierGroupStatsProps) => {
  const { t } = useTranslation('menu')

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('pages.modifiers.stats.totalGroups')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGroups}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('pages.modifiers.stats.required')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{requiredGroups}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('pages.modifiers.stats.totalModifiers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalModifiers}</div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ModifierItemProps {
  modifier: IModifier
  onEdit: (modifier: IModifier) => void
  onDelete: (id: number) => void
}

const ModifierItem = ({ modifier, onEdit, onDelete }: ModifierItemProps) => {
  const { t } = useTranslation('menu')

  return (
    <div className="bg-background hover:bg-accent/50 mb-px flex items-center justify-between rounded-lg border p-4 transition-colors">
      <div className="flex-1">
        <p className="font-medium">{modifier.name}</p>
        {modifier.description && (
          <p className="text-muted-foreground mt-1 text-sm">
            {modifier.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={modifier.isActive ? 'default' : 'secondary'}>
          {modifier.isActive
            ? t('pages.modifiers.badges.active')
            : t('pages.modifiers.badges.inactive')}
        </Badge>
        <span className="min-w-[80px] text-right font-semibold">
          {modifier.price} UZS
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(modifier)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(modifier.id)}>
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface GroupHeaderProps {
  group: IModifierGroup
  onEdit: () => void
  onDelete: () => void
}

const GroupHeader = ({ group, onEdit, onDelete }: GroupHeaderProps) => {
  const { t } = useTranslation('menu')

  return (
    <div className="flex flex-1 items-center justify-between pr-4">
      <div className="flex items-center gap-3 text-left">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <Settings className="text-primary h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            {group.isRequired && (
              <Badge variant="outline" className="text-xs">
                {t('pages.modifiers.badges.required')}
              </Badge>
            )}
            <span>
              {t('pages.modifiers.selectionRange', {
                min: group.minSelection,
                max: group.maxSelection,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-sm">
          {t('pages.modifiers.modifierCount', {
            count: group.modifiers?.length || 0,
          })}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {t('pages.modifiers.actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('pages.modifiers.actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

interface GroupContentProps {
  group: IModifierGroup
  onEditModifier: (modifier: IModifier) => void
  onDeleteModifier: (id: number) => void
}

const GroupContent = ({
  group,
  onEditModifier,
  onDeleteModifier,
}: GroupContentProps) => {
  const { t } = useTranslation('menu')

  return (
    <>
      <Separator className="mb-4" />
      <div className="space-y-3 pb-1">
        {group.modifiers && group.modifiers.length > 0 ? (
          group.modifiers.map((modifier) => (
            <ModifierItem
              key={modifier.id}
              modifier={modifier}
              onEdit={onEditModifier}
              onDelete={onDeleteModifier}
            />
          ))
        ) : (
          <p className="text-muted-foreground py-8 text-center text-sm">
            {t('pages.modifiers.empty.noModifiersInGroup')}
          </p>
        )}
        <CreateModifierDialog
          modifierGroupId={group.id}
          trigger={
            <Button size="sm" variant="outline" className="mt-2 w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('pages.modifiers.actions.addModifier')}
            </Button>
          }
        />
      </div>
    </>
  )
}

interface ModifierGroupItemProps {
  group: IModifierGroup
  onEditGroup: (group: IModifierGroup) => void
  onDeleteGroup: (id: number) => void
  onEditModifier: (modifier: IModifier) => void
  onDeleteModifier: (id: number) => void
}

const ModifierGroupItem = ({
  group,
  onEditGroup,
  onDeleteGroup,
  onEditModifier,
  onDeleteModifier,
}: ModifierGroupItemProps) => (
  <AccordionItem
    key={group.id}
    value={group.id.toString()}
    className="bg-card rounded-lg border"
  >
    <AccordionTrigger className="px-6 py-4 hover:no-underline">
      <GroupHeader
        group={group}
        onEdit={() => onEditGroup(group)}
        onDelete={() => onDeleteGroup(group.id)}
      />
    </AccordionTrigger>
    <AccordionContent className="px-6 pb-4">
      <GroupContent
        group={group}
        onEditModifier={onEditModifier}
        onDeleteModifier={onDeleteModifier}
      />
    </AccordionContent>
  </AccordionItem>
)

export default function ModifiersPage(): JSX.Element {
  const [search, setSearch] = useState('')
  const [editingGroup, setEditingGroup] = useState<IModifierGroup | null>(null)
  const [editingModifier, setEditingModifier] = useState<IModifier | null>(null)

  const { data: modifierGroups = [], isLoading } = useGetModifierGroups(
    search ? { search } : undefined
  )
  const { mutate: deleteGroup } = useDeleteModifierGroup()
  const { mutate: deleteModifier } = useDeleteModifier()

  if (isLoading) {
    return (
      <PageContainer>
        <div className="w-full">
          <BaseLoading />
        </div>
      </PageContainer>
    )
  }

  const filteredGroups = search
    ? modifierGroups.filter((group) =>
        group.name.toLowerCase().includes(search.toLowerCase())
      )
    : modifierGroups

  return (
    <PageContainer>
      <div className="w-full space-y-4">
        <PageHeader onCreateGroup={() => {}} />
        <SearchBar value={search} onChange={setSearch} />

        {modifierGroups.length > 0 && (
          <ModifierGroupStats
            totalGroups={modifierGroups.length}
            requiredGroups={modifierGroups.filter((g) => g.isRequired).length}
            totalModifiers={modifierGroups.reduce(
              (sum, g) => sum + (g.modifiers?.length || 0),
              0
            )}
          />
        )}

        {filteredGroups.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {filteredGroups.map((group) => (
              <ModifierGroupItem
                key={group.id}
                group={group}
                onEditGroup={setEditingGroup}
                onDeleteGroup={deleteGroup}
                onEditModifier={setEditingModifier}
                onDeleteModifier={deleteModifier}
              />
            ))}
          </Accordion>
        )}

        {/* Update Dialogs */}
        {editingGroup && (
          <UpdateModifierGroupDialog
            group={editingGroup}
            isOpen={!!editingGroup}
            onClose={() => setEditingGroup(null)}
          />
        )}

        {editingModifier && (
          <UpdateModifierDialog
            modifier={editingModifier}
            isOpen={!!editingModifier}
            onClose={() => setEditingModifier(null)}
          />
        )}
      </div>
    </PageContainer>
  )
}
