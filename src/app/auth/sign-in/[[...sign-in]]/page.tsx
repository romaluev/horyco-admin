import SignInViewPage from '@/entities/auth/ui/sign-in-view';

import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Авторизация',
  description: 'Вход в систему'
};

export default async function Page() {
  return <SignInViewPage />;
}
