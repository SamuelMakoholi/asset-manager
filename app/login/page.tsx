"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package2, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Our /api/auth/login returns { message, token, user }
        if (data.token && data.user) {
          const token = data.token as string;
          const user = data.user;

          // Store token and user like resume-front
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          // Redirect based on user role
          if (user.role === 'admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard');
          }
        } else {
          setErrors({ general: 'No authentication token received from server' });
        }
      } else {
        // Handle possible validation-style errors (if backend returns them)
        if (data.errors) {
          const formattedErrors: { [key: string]: string } = {};
          Object.entries(data.errors).forEach(([key, messages]) => {
            const firstMessage = Array.isArray(messages) ? messages[0] : messages;
            formattedErrors[key] = String(firstMessage);
          });
          setErrors(formattedErrors);
        } else {
          setErrors({ general: data.error || data.message || 'Login failed' });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Background with subtle gradient and pattern
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Enhanced Branding */}
      <div className="mb-10 flex flex-col items-center space-y-3 relative z-10">
        <div className="flex items-center space-x-3">
          <Package2 className="h-10 w-10 text-primary animate-pulse" />
          {/* Gradient Text for Title */}
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Asset Manager System
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Manage your assets efficiently</p>
      </div>

      {/* Card with Blur Effect and Enhanced Shadow */}
      <Card className="mx-auto w-full max-w-lg rounded-2xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm shadow-2xl transition-all duration-500 ring-2 ring-primary/20 dark:ring-primary/10 animate-fade-in relative z-10">
        <CardHeader className="space-y-2 p-6 sm:p-8 border-b dark:border-slate-800">
          <CardTitle className="text-3xl font-bold text-center text-slate-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-center text-base">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 sm:p-8 sm:pt-6">
          <form onSubmit={handleSubmit} className="grid gap-6">
            {errors.general && (
              <Alert variant="destructive" className="mb-2 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium dark:text-slate-200">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                autoComplete="email"
                className="h-11 text-base focus-visible:ring-2 ring-offset-2 ring-primary transition-all"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium dark:text-slate-200">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm font-medium text-primary hover:underline transition-colors"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                className="h-11 text-base focus-visible:ring-2 ring-offset-2 ring-primary transition-all"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/30 transition-all duration-300 ease-out hover:from-blue-600 hover:to-primary hover:shadow-xl hover:shadow-blue-600/40"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login to Continue'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-600 dark:text-slate-400 border-t dark:border-slate-800 pt-4 mt-4">
          <p>Assets Manager &copy; {new Date().getFullYear()}</p>
        </CardFooter>
      </Card>
    </div>
  );
}