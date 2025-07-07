import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/base/avatar';
import { IUser } from '@/entities/auth/model';
import { BASE_API_URL } from '@/shared/lib/axios';
import { getNameInitials } from '@/shared/lib/utils';
import { UserIcon } from 'lucide-react';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: IUser | null;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage
          src={
            user?.photoUrl ? `${BASE_API_URL}/file/${user.photoUrl}` : undefined
          }
          alt={user?.fullName || ''}
        />
        <AvatarFallback className='rounded-lg'>
          {getNameInitials(user?.fullName) || <UserIcon />}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{user?.fullName || ''}</span>
        </div>
      )}
    </div>
  );
}
