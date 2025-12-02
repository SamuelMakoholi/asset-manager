import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/server-auth';
import CreateCategoryForm from './create-form';

export default async function CreateCategoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <CreateCategoryForm userId={user.userId} />;
}
