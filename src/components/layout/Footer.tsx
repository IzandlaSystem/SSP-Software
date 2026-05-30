import Link from 'next/link';
import { Activity, ArrowUpRight, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-14 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="mb-5 flex items-center gap-2.5">
            <span className="rounded-lg bg-[#0A0A0A] p-2 text-white dark:bg-white dark:text-zinc-950">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-zinc-950 dark:text-white">SSP Pro</span>
          </Link>
          <p className="max-w-md text-sm font-medium leading-7">
            Smart Sports Platform helps teams plan sessions, track movement, review performance, and understand progress over time.
          </p>
          <div className="mt-6 flex max-w-sm gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-sm dark:border-zinc-800 dark:bg-zinc-900" placeholder="Email address" />
            </div>
            <button className="rounded-lg bg-[#0A0A0A] px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-zinc-950">Join</button>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-black uppercase text-zinc-950 dark:text-white">Product</h3>
          <div className="grid gap-2 text-sm font-semibold">
            <Link href="/product">Product</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/solutions">Solutions</Link>
            <Link href="/technology">Technology</Link>
            <Link href="/login" className="inline-flex items-center gap-1">Launch Demo <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-black uppercase text-zinc-950 dark:text-white">More</h3>
          <div className="grid gap-2 text-sm font-semibold">
            <Link href="/coaches">Coaches</Link>
            <Link href="/athletes">Athletes</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-zinc-200 px-4 pt-6 text-xs font-medium text-zinc-500 sm:px-6 lg:px-8 dark:border-zinc-800">
        © {new Date().getFullYear()} Smart Sports Platform. Frontend demonstration with mock data.
      </div>
    </footer>
  );
}
