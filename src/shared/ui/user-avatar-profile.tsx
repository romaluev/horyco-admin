'use client'

import { useEffect, useState } from 'react'

import { UserIcon } from 'lucide-react'

import { getNameInitials } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/base/avatar'

import { getFileById } from '@/shared/file/model/api'

import type { IUser } from '@/entities/auth/auth/model'

interface UserAvatarProfileProps {
  className?: string
  showInfo?: boolean
  user: IUser | null
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (user?.avatar?.thumb || user?.avatar?.original) {
        // Already have avatar variants from API
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

  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage
          src={avatarUrl}
          alt={user?.fullName || ''}
        />
        <AvatarFallback className="rounded-lg">
          {getNameInitials(user?.fullName) || <UserIcon />}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user?.fullName || ''}</span>
        </div>
      )}
    </div>
  )
}
