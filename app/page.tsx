import Link from "next/link";
import { Package2, ArrowRight, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 selection:bg-primary selection:text-white dark:bg-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[25%] -left-[10%] h-[500px] w-[500px] animate-pulse rounded-full bg-primary/20 blur-[100px] duration-3000" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] animate-pulse rounded-full bg-blue-400/20 blur-[100px] duration-5000 delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] animate-pulse rounded-full bg-indigo-500/10 blur-[120px] duration-7000 delay-2000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo Icon with Float Animation */}
          <div className="relative mb-4 animate-[bounce_3s_infinite]">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>
            <div className="relative rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-4 shadow-2xl ring-1 ring-white/20">
              <Package2 className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Card with Top Border */}
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-xl p-8 border-t-4 border-primary">
            {/* Hero Text with Gradient */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-slate-900 dark:text-white">Asset Management</span>
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              <p className="mx-auto max-w-[600px] text-lg text-slate-600 dark:text-slate-300 md:text-xl">
                Streamline your inventory, track equipment lifecycles, and optimize resource allocation with our intelligent platform.
              </p>
            </div>

            {/* Stats / Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure Tracking
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                <BarChart3 className="h-4 w-4 text-primary" />
                Real-time Analytics
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row justify-center">
              <Link
                href="/login"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700"></div>
    </div>
  );
}