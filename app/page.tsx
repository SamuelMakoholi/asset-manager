import Link from "next/link";
import { Package2, ArrowRight, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 selection:bg-primary selection:text-white dark:bg-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle, less aggressive animated blobs */}
        <div className="absolute -top-[15%] -left-[5%] h-[400px] w-[400px] animate-pulse rounded-full bg-primary/10 blur-[80px] duration-[2500ms]" />
        <div className="absolute top-[10%] -right-[5%] h-[300px] w-[300px] animate-pulse rounded-full bg-blue-400/10 blur-[80px] duration-[4000ms] delay-1000" />
        <div className="absolute -bottom-[10%] left-[10%] h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-500/5 blur-[100px] duration-[6000ms] delay-2000" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center gap-10 text-center">
          {/* Logo Icon with Pulse Animation */}
          <div className="relative mb-4 animate-pulse duration-3000">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl"></div>
            <div className="relative rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-5 shadow-2xl ring-2 ring-white/50">
              <Package2 className="h-10 w-10 text-white md:h-12 md:w-12" />
            </div>
          </div>

          {/* Wider, Cleaned-up Main Content Card */}
          <div className="w-full max-w-3xl rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl p-8 sm:p-12 ring-1 ring-primary/50 dark:ring-primary/30">
            {/* Hero Text with Reduced Font Size */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block text-slate-900 dark:text-white">Asset Management</span>
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h2>
              <p className="mx-auto max-w-[700px] text-lg text-slate-700 dark:text-slate-300 md:text-xl leading-relaxed">
                Streamline your inventory, track equipment lifecycles, and optimize resource allocation with our intelligent, data-driven platform.
              </p>
            </div>

            {/* Stats / Features Pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
              <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2 text-base font-semibold text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 shadow-md transition-all hover:shadow-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Secure Tracking
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-2 text-base font-semibold text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 shadow-md transition-all hover:shadow-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Real-time Analytics
              </div>
            </div>

            {/* Call to Action - More prominent */}
            <div className="mt-10 flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Link
                href="/login"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-blue-600 px-10 text-base font-semibold text-white shadow-xl shadow-primary/40 transition-all duration-300 ease-out hover:from-blue-600 hover:to-primary hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"
              >
                Login
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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