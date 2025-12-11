'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { LogOut, User as UserIcon } from 'lucide-react'

import { getNameInitials } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/base/avatar'
import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'

import { useAuthStore } from '@/entities/auth/model/store'
import { getFileById } from '@/entities/file/model/api'

export function UserNav() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (user?.avatar?.thumb || user?.avatar?.original) {
        setAvatarUrl(user.avatar.thumb || user.avatar.original)
        return
      }

      if (!user?.photoUrl) {
        setAvatarUrl(undefined)
        return
      }

      try {
        const fileId = Number(user.photoUrl)
        if (isNaN(fileId)) {
          setAvatarUrl(undefined)
          return
        }

        const file = await getFileById(fileId)
        setAvatarUrl(file.variants?.thumb || file.variants?.original)
      } catch (error) {
        console.error('Error fetching avatar:', error)
        setAvatarUrl(undefined)
      }
    }

    fetchAvatarUrl()
  }, [user?.photoUrl, user?.avatar?.thumb, user?.avatar?.original])

  const handleLogout = () => {
    logout()
    router.push('/auth/sign-in')
  }

  const userInitials = getNameInitials(user?.fullName)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              src={avatarUrl}
              alt={user?.fullName}
            />
            <AvatarFallback>{userInitials || <UserIcon />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user?.fullName}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Профиль</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выход из системы</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
