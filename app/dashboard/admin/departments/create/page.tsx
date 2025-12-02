import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/server-auth';
import CreateDepartmentForm from './create-form';

export default async function CreateDepartmentPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <CreateDepartmentForm userId={user.userId} />;
}
