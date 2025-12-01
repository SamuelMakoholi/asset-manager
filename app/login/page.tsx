import { authenticate } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Package2 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Asset Manager</h1>
      </div>

      {/* Wider Card with Top Border */}
      <Card className="mx-auto w-full max-w-lg border-t-4 border-primary shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={authenticate} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
