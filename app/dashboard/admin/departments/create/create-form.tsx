"use client";

import { useActionState } from 'react';
import { createDepartment } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormStatus } from 'react-dom';

export default function CreateDepartmentForm({ userId }: { userId: string }) {
  const initialState: { message: string; errors?: { name?: string[]; description?: string[] } } = { message: '', errors: {} };

  // This wrapper function matches the signature expected by useActionState
  const clientAction = async (prevState: typeof initialState, formData: FormData) => {
    // It then calls the original server action with the correct arguments
    return createDepartment(userId, formData);
  };

  const [state, formAction] = useActionState(clientAction, initialState);
  const { pending } = useFormStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Department</CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button type="submit" className="w-full" disabled={pending}>Create Department</Button>
        </form>
      </CardContent>
    </Card>
  );
}
