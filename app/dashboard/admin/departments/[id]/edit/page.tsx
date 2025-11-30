import { updateDepartment } from '@/app/lib/actions';
import { fetchDepartmentById } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { notFound } from 'next/navigation';

export default async function EditDepartmentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const department = await fetchDepartmentById(id);

  if (!department) {
    notFound();
  }

  const updateDepartmentWithId = updateDepartment.bind(null, department.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Department</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={updateDepartmentWithId} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={department.name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={department.description} />
          </div>
          <Button type="submit" className="w-full">Update Department</Button>
        </form>
      </CardContent>
    </Card>
  );
}
