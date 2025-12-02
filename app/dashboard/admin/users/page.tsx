import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchUsers } from '@/app/lib/data';
import { deleteUser } from '@/app/lib/actions';

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Users 🔑</CardTitle>
        <CardDescription>Manage your system users and their roles (Admin, Employee, etc.).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/dashboard/admin/users/create">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create User
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            {/* Added background to header for better separation */}
            <TableRow className="bg-muted/50 hover:bg-muted/60"> 
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* --- STRIPED ROW LOGIC APPLIED HERE --- */}
            {users.map((user, index) => (
              <TableRow 
                key={user.id} 
                // Apply background to odd rows (index 1, 3, 5...)
                className={index % 2 === 1 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-accent/50'} 
              >
                <TableCell className="font-semibold text-primary/90">{user.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                {/* Apply styling to the role for distinction */}
                <TableCell>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'}`
                  }>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server';
                      await deleteUser(user.id);
                    }}>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* --- END OF STRIPED ROW LOGIC --- */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}