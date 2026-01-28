import { ProfileView } from '@/entities/auth/auth'

export const metadata = {
  title: 'Dashboard : Profile',
}

export default async function Page() {
  return <ProfileView />
}
