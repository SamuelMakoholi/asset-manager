"use client";

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAsset } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormStatus } from 'react-dom';
import { CategoryField, DepartmentField } from '@/app/lib/definitions';

type CreateAssetState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export default function CreateAssetForm({ userId, categories, departments }: { userId: string, categories: CategoryField[], departments: DepartmentField[] }) {
  const router = useRouter();
  const initialState: CreateAssetState = { message: '', errors: {} };

  const clientAction = async (prevState: CreateAssetState, formData: FormData) => {
    const result = await createAsset(userId, formData);
    return result as CreateAssetState;
  };

  const [state, formAction] = useActionState<CreateAssetState, FormData>(clientAction, initialState);

  useEffect(() => {
    if (state?.ok) {
      // Briefly show success, then go to assets page
      const timeout = setTimeout(() => {
        router.push('/dashboard/assets');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [state?.ok, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Asset</CardTitle>
      </CardHeader>
      <CardContent>
        {state.ok && state.message && (
          <p className="mb-2 text-sm text-green-600">{state.message}</p>
        )}
        {!state.ok && state.message && (
          <p className="mb-2 text-sm text-red-600">{state.message}</p>
        )}
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
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Saving asset...
        </span>
      ) : (
        'Create Asset'
      )}
    </Button>
  );
}
