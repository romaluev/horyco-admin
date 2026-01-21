'use client'

import * as React from 'react'

import { Link } from '@tanstack/react-router'
import { usePathname, useRouter } from '@/shared/lib/navigation'

import {
  IconChevronRight,
  IconChevronsDown,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react'

import logo from '@/shared/assets/logo.png'
import { getNavItems, getSettingsNavItem } from '@/shared/config/data'
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/base/hover-card'
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
  useSidebar,
} from '@/shared/ui/base/sidebar'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { UserAvatarProfile } from '@/shared/ui/user-avatar-profile'

import { useAuthStore } from '@/entities/auth/auth/model/store'
import { useGetAllBranches, useBranchStore } from '@/entities/organization/branch'
import { AnalyticsSidebarSection } from '@/features/dashboard/analytics'

import { BranchSelector } from '../branch-selector'
import { Icons } from '../icons'

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

interface NavItem {
  title: string
  url: string
  icon?: keyof typeof Icons
  isActive?: boolean
  permission?: string
  permissions?: string[]
  permissionMode?: 'all' | 'any'
  items?: NavItem[]
}

function NavItemWithSub({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const { state, isMobile } = useSidebar()
  // On mobile, always show expanded view (never show HoverCard tooltips)
  const isCollapsed = state === 'collapsed' && !isMobile

  if (isCollapsed) {
    // In collapsed mode, show first sub-item icon or fallback
    const FirstSubIcon = item.items?.[0]?.icon ? Icons[item.items[0].icon] : Icons.logo

    return (
      <SidebarMenuItem>
        <HoverCard openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <FirstSubIcon className="!h-6 !w-6" />
              <span className="text-[17px]">{item.title}</span>
            </SidebarMenuButton>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            sideOffset={8}
            className="w-48 p-1"
          >
            <div className="flex flex-col gap-0.5">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.title}
              </div>
              {item.items?.map((subItem) => {
                const SubIcon = subItem.icon ? Icons[subItem.icon] : null
                return (
                  <Link
                    key={subItem.title}
                    to={subItem.url}
                    className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                      pathname === subItem.url || pathname.startsWith(subItem.url + '/')
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : ''
                    }`}
                  >
                    {SubIcon && (
                      <SubIcon className="!h-[1.25rem] !w-[1.25rem]" />
                    )}
                    {subItem.title}
                  </Link>
                )
              })}
            </div>
          </HoverCardContent>
        </HoverCard>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {/* Group header - small, without icon */}
          <SidebarMenuButton tooltip={item.title} size="sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.title}</span>
            <IconChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="!border-l-0 !ml-0 !pl-0">
            {item.items?.map((subItem) => {
              const SubIcon = subItem.icon ? Icons[subItem.icon] : null
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    className="!p-3"
                    asChild
                    isActive={pathname === subItem.url || pathname.startsWith(subItem.url + '/')}
                  >
                    <Link
                      to={subItem.url}
                      className="flex items-center gap-2"
                    >
                      {SubIcon && (
                        <SubIcon className="!h-[1.25rem] !w-[1.25rem]" />
                      )}
                      <span className="text-[17px]">{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export default function AppSidebar() {
  const pathname = usePathname()
  const authStore = useAuthStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const allNavItems = getNavItems()
  const settingsNavItem = getSettingsNavItem()

  const navItems = filterNavItemsByPermission(
    allNavItems,
    user?.branchPermissions
  )

  // Filter settings nav item
  const showSettings = !settingsNavItem.permission ||
    hasPermissionAnyBranch(user?.branchPermissions, settingsNavItem.permission)

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

  const handleLogout = () => {
    authStore.logout()
    router.push('/auth/sign-in')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="my-4">
            <img
              className="w-40 overflow-hidden"
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
            {navItems.map((item, index) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo
              const isFirstItem = index === 0
              const isDashboard = item.url === '/dashboard/overview'

              return (
                <React.Fragment key={item.title}>
                  {item?.items && item?.items?.length > 0 ? (
                    <NavItemWithSub
                      item={item as NavItem}
                      pathname={pathname}
                    />
                  ) : (
                    <SidebarMenuItem className="my-1">
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        <Link to={item.url}>
                          <Icon className={`!w-6 !h-6 ${isDashboard ? 'text-[#fe4a49]' : ''}`} />
                          <span className="text-[17px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Analytics Section right after Dashboard */}
                  {isFirstItem && <AnalyticsSidebarSection />}
                </React.Fragment>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Settings button */}
          {showSettings && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Настройки"
                isActive={pathname === settingsNavItem.url}
              >
                <Link to={settingsNavItem.url}>
                  <IconSettings className="!h-6 !w-6" />
                  <span className="text-[17px]">Настройки</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* User profile dropdown */}
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
