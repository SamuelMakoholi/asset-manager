"use client";

import { useActionState } from 'react';
import { createCategory } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormStatus } from 'react-dom';

type CreateCategoryState = {
  ok?: boolean;
  message?: string;
  errors?: { name?: string[]; description?: string[] };
};

export default function CreateCategoryForm({ userId }: { userId: string }) {
  const initialState: CreateCategoryState = {
    ok: undefined,
    message: '',
    errors: {},
  };

  async function action(prevState: CreateCategoryState, formData: FormData) {
    const result = await createCategory(userId, formData);
    return result as CreateCategoryState;
  }

  const [state, formAction] = useActionState<CreateCategoryState, FormData>(action, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
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
          Saving category...
        </span>
      ) : (
        'Create Category'
      )}
    </Button>
  );
}
