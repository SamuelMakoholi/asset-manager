"use client";

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createDepartment } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormStatus } from 'react-dom';

type CreateDepartmentState = {
  ok?: boolean;
  message?: string;
  errors?: { name?: string[]; description?: string[] };
};

export default function CreateDepartmentForm({ userId }: { userId: string }) {
  const router = useRouter();
  const initialState: CreateDepartmentState = { message: '', errors: {} };

  const clientAction = async (prevState: CreateDepartmentState, formData: FormData) => {
    const result = await createDepartment(userId, formData);
    return result as CreateDepartmentState;
  };

  const [state, formAction] = useActionState<CreateDepartmentState, FormData>(clientAction, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.ok) {
      const timeout = setTimeout(() => {
        router.push('/dashboard/admin/departments');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [state?.ok, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Department</CardTitle>
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
            {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
            {state.errors?.description && <p className="text-sm text-red-500">{state.errors.description}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating department...' : 'Create Department'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
