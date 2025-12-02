import CreateAssetForm from './create-form';
import { fetchCategories, fetchDepartments } from '@/app/lib/data';

export default async function CreateAssetPage() {
  const [categories, departments] = await Promise.all([
    fetchCategories(),
    fetchDepartments(),
  ]);

  // TODO: replace 'TEMP_USER_ID' with real user id when you add proper auth context
  const tempUserId = 'TEMP_USER_ID';

  return <CreateAssetForm userId={tempUserId} categories={categories} departments={departments} />;
}
