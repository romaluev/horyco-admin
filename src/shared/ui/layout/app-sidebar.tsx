'use client'

import * as React from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  IconChevronRight,
  IconChevronsDown,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react'

import logo from '@/shared/assets/logo.png'
import { getNavItems } from '@/shared/config/data'
import {
  hasPermissionAnyBranch,
  hasAllPermissionsAnyBranch,
  hasAnyPermissionAnyBranch,
} from '@/shared/lib/permissions'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/shared/ui/base/sidebar'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { UserAvatarProfile } from '@/shared/ui/user-avatar-profile'

import { useAuthStore } from '@/entities/auth/model/store'
import { useGetAllBranches, useBranchStore } from '@/entities/branch'

import { BranchSelector } from '@/shared/ui/branch-selector'
import { Icons } from '@/shared/ui/icons'

/**
 * Filter nav items based on user permissions
 * Does NOT use hooks - called once per component mount
 */
function filterNavItemsByPermission(
  items: ReturnType<typeof getNavItems>,
  branchPermissions?: Record<string, string[]>
): ReturnType<typeof getNavItems> {
  // If permissions not loaded yet, show all items (will filter once they load)
  if (!branchPermissions) return items

  return items
    .filter((item) => {
      // If no permission requirement, always show
      if (!item.permission && !item.permissions) {
        return true
      }

      // Check permission
      if (item.permission) {
        return hasPermissionAnyBranch(branchPermissions, item.permission)
      }

      if (item.permissions) {
        if (item.permissionMode === 'all') {
          return hasAllPermissionsAnyBranch(branchPermissions, item.permissions)
        }
        return hasAnyPermissionAnyBranch(branchPermissions, item.permissions)
      }

      return true
    })
    .map((item) => ({
      ...item,
      // Recursively filter sub-items
      items:
        item.items && item.items.length > 0
          ? filterNavItemsByPermission(item.items, branchPermissions)
          : item.items,
    }))
}

export default function AppSidebar() {
  const pathname = usePathname()
  const authStore = useAuthStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const allNavItems = getNavItems()

  // Filter nav items based on user permissions
  const navItems = filterNavItemsByPermission(
    allNavItems,
    user?.branchPermissions
  )

  const { data: branchesData, isLoading: isBranchesLoading } =
    useGetAllBranches()
  const { selectedBranchId, setSelectedBranch, initializeFromStorage } =
    useBranchStore()

  const branches = branchesData?.items || []

  React.useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  React.useEffect(() => {
    if (branches.length > 0 && selectedBranchId === null && branches[0]) {
      setSelectedBranch(branches[0].id)
    }
  }, [branches, selectedBranchId, setSelectedBranch])

  // Handle hover on menu items with subpages in icon mode
  React.useEffect(() => {
    let hoverTimeout: NodeJS.Timeout | null = null
    const hoverStates = new WeakMap<Element, boolean>()

    const handleMenuItemHover = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const menuItem = target.closest('[data-sidebar="menu-item"]')
      if (!menuItem) return

      const trigger = menuItem.querySelector(
        '[data-slot="collapsible-trigger"]'
      )
      const button = menuItem.querySelector(
        '[data-sidebar="menu-button"]'
      ) as HTMLButtonElement | null

      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }

      // Open collapsible on hover in icon mode
      if (button && button.offsetParent !== null) {
        const isIconMode =
          window
            .getComputedStyle(button)
            .width.includes('3rem') ||
          button.classList.toString().includes('size-8')

        if (isIconMode && trigger) {
          const content = menuItem.querySelector(
            '[data-slot="collapsible-content"]'
          )
          if (content?.getAttribute('data-state') !== 'open') {
            const triggerButton = trigger.querySelector('button')
            triggerButton?.click()
            hoverStates.set(menuItem, true)
          }
        }
      }
    }

    const handleMenuItemLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const menuItem = target.closest('[data-sidebar="menu-item"]')
      if (!menuItem) return

      const wasHoverOpened = hoverStates.get(menuItem)
      if (!wasHoverOpened) return

      // Delay close to allow moving to submenu
      hoverTimeout = setTimeout(() => {
        const trigger = menuItem.querySelector(
          '[data-slot="collapsible-trigger"]'
        )
        const content = menuItem.querySelector(
          '[data-slot="collapsible-content"]'
        )

        if (
          trigger &&
          content &&
          content.getAttribute('data-state') === 'open'
        ) {
          const triggerButton = trigger.querySelector('button')
          triggerButton?.click()
          hoverStates.set(menuItem, false)
        }
      }, 200)
    }

    const handleSubmenuHover = (e: Event) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
    }

    const menuItems = document.querySelectorAll('[data-sidebar="menu-item"]')
    menuItems.forEach((item) => {
      item.addEventListener('mouseenter', handleMenuItemHover as EventListener)
      item.addEventListener('mouseleave', handleMenuItemLeave as EventListener)

      // Keep submenu open when hovering over it
      const submenu = item.querySelector('[data-sidebar="menu-sub"]')
      if (submenu) {
        submenu.addEventListener(
          'mouseenter',
          handleSubmenuHover as EventListener
        )
      }
    })

    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)

      menuItems.forEach((item) => {
        item.removeEventListener(
          'mouseenter',
          handleMenuItemHover as EventListener
        )
        item.removeEventListener(
          'mouseleave',
          handleMenuItemLeave as EventListener
        )

        const submenu = item.querySelector('[data-sidebar="menu-sub"]')
        if (submenu) {
          submenu.removeEventListener(
            'mouseenter',
            handleSubmenuHover as EventListener
          )
        }
      })
    }
  }, [])

  const handleLogout = () => {
    authStore.logout()
    router.push('/auth/sign-in')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="my-4">
            <Image
              className="w-40 overflow-hidden rounded-2xl"
              src={logo}
              alt=""
            />
          </SidebarGroupLabel>

          <div className="mb-4 px-2 group-data-[collapsible=icon]:hidden">
            {isBranchesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <BranchSelector
                value={selectedBranchId ?? undefined}
                onChange={(branchId) => setSelectedBranch(branchId ?? null)}
              />
            )}
          </div>

          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <Icon className="!h-6 !w-6" size={30} />}
                        <span className="text-[17px]">{item.title}</span>
                        <IconChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              className="!p-3"
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span className="text-[17px]">
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title} className="my-1">
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon size={30} className="!h-6 !w-6" />
                      <span className="text-[17px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {user && (
                    <UserAvatarProfile
                      className="h-8 w-8 rounded-lg"
                      showInfo
                      user={user}
                    />
                  )}
                  <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    {user && (
                      <UserAvatarProfile
                        className="h-8 w-8 rounded-lg"
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    Профиль
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <IconLogout className="mr-2 h-4 w-4" />
                  Выход из системы
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
