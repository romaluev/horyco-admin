'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/model/store';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Settings, CreditCard } from 'lucide-react';

export function UserNav() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/sign-in');
  };

  const userInitials = user.fullName
    ? getInitials(user.fullName)
    : user.username.substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInitials}`}
              alt={user.username}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {user.fullName || user.username}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            <UserIcon className='mr-2 h-4 w-4' />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
            <CreditCard className='mr-2 h-4 w-4' />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            <Settings className='mr-2 h-4 w-4' />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
