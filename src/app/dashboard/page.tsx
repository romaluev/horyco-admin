import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  // Check if user is authenticated by looking for the access_token cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const isAuthenticated = !!token

  if (!isAuthenticated) {
    return redirect('/auth/sign-in')
  }
  redirect('/dashboard/overview')
}
