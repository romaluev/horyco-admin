import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IUser } from '@/features/auth/store/auth-store';

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
          src={'@/public/images/avatar.png'}
          alt={user?.username || ''}
        />
        <AvatarFallback className='rounded-lg'>
          {user?.username?.slice(0, 2)?.toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{user?.username || ''}</span>
          <span className='truncate text-xs'>{user?.username || ''}</span>
        </div>
      )}
    </div>
  );
}
