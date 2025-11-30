import { createDepartment } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export default async function CreateDepartmentPage() {
  const token = await getToken({ req: { cookies: cookies() } as any, secret: process.env.NEXTAUTH_SECRET });
  const createDepartmentWithUserId = createDepartment.bind(null, token!.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Department</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createDepartmentWithUserId} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <Button type="submit" className="w-full">Create Department</Button>
        </form>
      </CardContent>
    </Card>
  );
}
