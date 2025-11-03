import { redirect } from 'next/navigation';

export default function StaffPage(): never {
  redirect('/dashboard/staff/employees');
}
