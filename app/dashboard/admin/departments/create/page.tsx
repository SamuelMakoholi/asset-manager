import CreateDepartmentForm from './create-form';

export default async function CreateDepartmentPage() {
  // TODO: replace 'TEMP_ADMIN_ID' with real admin user id when auth context is available
  const tempAdminId = 'TEMP_ADMIN_ID';
  return <CreateDepartmentForm userId={tempAdminId} />;
}
