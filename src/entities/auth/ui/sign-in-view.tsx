import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
};

export default function SignInViewPage() {
  return (
    <div className='relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none'>
      <div className='flex items-center justify-center p-4 text-lg font-medium'>
        {/*<LogoIcon />*/}
        OSHPOS
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <LoginForm />

          <p className='text-muted-foreground px-8 text-center text-sm'>
            Входя в аккаунт, вы соглашаетесь с{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Условиями использования
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
