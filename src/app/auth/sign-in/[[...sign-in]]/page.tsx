import { Metadata } from 'next';
import SignInViewPage from '@/entities/auth/ui/sign-in-view';

export const metadata: Metadata = {
  title: 'Авторизация',
  description: 'Вход в систему'
};

export default async function Page() {
  return <SignInViewPage />;
}
