import Image from "next/image";
import Link from "next/link";
import { Package2, BarChart3, Users, Building } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Asset Manager</span>
          </div>
          <Link 
            href="/login" 
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Manage Your Assets <span className="text-primary">Efficiently</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                Track, organize, and optimize your company assets with our comprehensive asset management solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
                <Link 
                  href="#features" 
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="relative z-10 rounded-xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Package2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Total Assets</h3>
                      <p className="text-2xl font-bold">1,248</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-500">Departments</span>
                      </div>
                      <p className="font-medium">12</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-500">Users</span>
                      </div>
                      <p className="font-medium">48</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Everything you need to manage your assets effectively</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 rounded-full bg-primary/10 p-2 w-fit">
                <Package2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Asset Tracking</h3>
              <p className="text-slate-600 dark:text-slate-400">Track all your assets in one place with detailed information and history.</p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 rounded-full bg-primary/10 p-2 w-fit">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400">Get insights into your asset utilization and make data-driven decisions.</p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 rounded-full bg-primary/10 p-2 w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">User Management</h3>
              <p className="text-slate-600 dark:text-slate-400">Assign assets to users and track responsibility with role-based access control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-6 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Package2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Asset Manager</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">© 2025 Asset Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
