import { redirect } from 'next/navigation';
import CreateAssetForm from './create-form';
import { fetchCategories, fetchDepartments } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/server-auth';

export default async function CreateAssetPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const [categories, departments] = await Promise.all([
    fetchCategories(),
    fetchDepartments(),
  ]);

  return (
    <CreateAssetForm
      userId={user.userId}
      userRole={user.role}
      categories={categories}
      departments={departments}
    />
  );
}
