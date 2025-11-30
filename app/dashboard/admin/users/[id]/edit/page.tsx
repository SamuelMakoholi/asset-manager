import { updateUser } from '@/app/lib/actions';
import { fetchUserById } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  const updateUserWithId = updateUser.bind(null, user.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={updateUserWithId} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user.name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">New Password (optional)</Label>
            <Input id="password" name="password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user.role}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Update User</Button>
        </form>
      </CardContent>
    </Card>
  );
}
