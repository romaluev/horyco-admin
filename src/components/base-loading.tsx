import { cn } from '@/lib/utils';

const BaseLoading = ({ className = '' }) => {
  return (
    <div className={cn('flex justify-center py-14', className)}>
      <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
    </div>
  );
};

export default BaseLoading;
