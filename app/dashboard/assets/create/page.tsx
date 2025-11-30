import { createAsset } from '@/app/lib/actions';
import { fetchCategoryFields, fetchDepartmentFields } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export default async function CreateAssetPage() {
  const token = await getToken({ req: { cookies: cookies() } as any, secret: process.env.NEXTAUTH_SECRET });
  const createAssetWithUserId = createAsset.bind(null, token!.id as string);
  const categories = await fetchCategoryFields();
  const departments = await fetchDepartmentFields();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAssetWithUserId} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department_id">Department</Label>
              <Select name="department_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input id="purchase_date" name="purchase_date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" name="cost" type="number" step="0.01" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="active" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" />
          </div>
          <Button type="submit" className="w-full">Create Asset</Button>
        </form>
      </CardContent>
    </Card>
  );
}
