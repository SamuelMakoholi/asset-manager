"use client";

import { useActionState } from 'react';
import { createAsset } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormStatus } from 'react-dom';
import { CategoryField, DepartmentField } from '@/app/lib/definitions';

export default function CreateAssetForm({ userId, categories, departments }: { userId: string, categories: CategoryField[], departments: DepartmentField[] }) {
  const initialState = { message: '', errors: {} };

  const clientAction = async (prevState: typeof initialState, formData: FormData) => {
    return createAsset(userId, formData);
  };

  const [state, formAction] = useActionState(clientAction, initialState);
  const { pending } = useFormStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" name="name" required />
            {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
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
              {state.errors?.category_id && <p className="text-sm text-red-500">{state.errors.category_id}</p>}
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
              {state.errors?.department_id && <p className="text-sm text-red-500">{state.errors.department_id}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input id="purchase_date" name="purchase_date" type="date" required />
              {state.errors?.purchase_date && <p className="text-sm text-red-500">{state.errors.purchase_date}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" name="cost" type="number" step="0.01" required />
              {state.errors?.cost && <p className="text-sm text-red-500">{state.errors.cost}</p>}
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
            {state.errors?.status && <p className="text-sm text-red-500">{state.errors.status}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>Create Asset</Button>
        </form>
      </CardContent>
    </Card>
  );
}
