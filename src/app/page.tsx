import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Page() {
  // Check if user is authenticated by looking for the access_token cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
