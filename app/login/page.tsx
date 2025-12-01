"use client";

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form status component to handle loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      className="w-full h-12 text-base font-semibold" 
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </Button>
  );
}

export default function LoginPage() {
  // Form state to handle server errors
  const [state, formAction] = useActionState(authenticate, { error: null, role: undefined });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (state.role === 'user') {
      router.push('/dashboard');
    }
  }, [state, router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="mb-8 flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Package2 className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Asset Manager</h1>
        </div>
        <p className="text-muted-foreground">Manage your assets efficiently</p>
      </div>

      <Card className="mx-auto w-full max-w-md border-t-4 border-primary shadow-xl animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={formAction} className="grid gap-4">
            {state.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                className="h-10"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-primary hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                autoComplete="current-password"
                className="h-10"
                required 
              />
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>Secure login powered by NextAuth</p>
        </CardFooter>
      </Card>
    </div>
  );
}
