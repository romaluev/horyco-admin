import { Input } from '@/components/ui/input';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { clsx } from 'clsx';

const PasswordInput = ({
  className,
  ...props
}: React.ComponentProps<'input'>) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className={'relative'}>
      <Input
        placeholder='Enter password'
        className={clsx(className, 'pr-8')}
        {...props}
        type={visible ? 'text' : 'password'}
      />
      <Button
        type='button'
        className='absolute top-0 right-0 !bg-transparent !text-black'
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </Button>
    </div>
  );
};

export default PasswordInput;
