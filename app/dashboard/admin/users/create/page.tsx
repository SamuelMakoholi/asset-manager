"use client";

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormStatus } from 'react-dom';

type CreateUserState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export default function CreateUserPage() {
  const router = useRouter();
  const initialState: CreateUserState = { message: '', errors: {} };

  const clientAction = async (prevState: CreateUserState, formData: FormData) => {
    const result = await createUser(formData);
    return result as CreateUserState;
  };

  const [state, formAction] = useActionState<CreateUserState, FormData>(clientAction, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.ok) {
      const timeout = setTimeout(() => {
        router.push('/dashboard/admin/users');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [state?.ok, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue="user" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.role && <p className="text-sm text-red-500">{state.errors.role}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating user...' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
