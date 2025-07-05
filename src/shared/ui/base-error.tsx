import { cn } from '@/shared/lib/utils';

export const BaseError = ({ className = '', message = 'Произошла ошибка' }) => {
  return (
    <div className={cn(className, 'flex items-center justify-center py-10')}>
      <h2 className='text-destructive text-center text-2xl'>{message}</h2>
    </div>
  );
};
