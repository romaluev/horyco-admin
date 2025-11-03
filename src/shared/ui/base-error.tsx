import { AlertCircle } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

export const BaseError = ({
  className = '',
  message = 'Произошла ошибка',
  onRetry,
}: {
  className?: string;
  message?: string;
  onRetry?: () => void;
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-10', className)}>
      <AlertCircle className='text-destructive h-12 w-12' />
      <h2 className='text-destructive text-xl font-semibold'>{message}</h2>
      {onRetry && (
        <Button onClick={onRetry} variant='outline'>
          Повторить
        </Button>
      )}
    </div>
  );
};
