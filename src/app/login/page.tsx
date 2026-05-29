import Link from 'next/link';
import { ArrowRight, BarChart3, Smartphone, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-zinc-950">
      <Navbar />
      <main className="mx-auto grid min-h-[74vh] max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <p className="mb-4 text-xs font-black uppercase text-[#2563EB]">Demo platform</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl">Choose the role you want to review.</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-zinc-600">
            This is a frontend-only demonstration using mock data. No registration or backend connection is required.
          </p>
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <BarChart3 className="mt-1 h-6 w-6 text-[#2563EB]" />
              <div>
                <h2 className="text-lg font-extrabold">Premium demo entry</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-zinc-600">
                  Open either side of the product to review how coaches and athletes move through the same session story.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Link href="/platform/coach" className="group rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_18px_50px_rgba(17,24,39,0.08)] transition hover:-translate-y-1 hover:shadow-xl">
            <Users className="mb-12 h-8 w-8 text-[#2563EB]" />
            <p className="mb-3 text-xs font-black uppercase text-zinc-500">Performance staff</p>
            <h2 className="text-3xl font-extrabold leading-tight">Continue as Coach</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-zinc-600">Plan sessions, monitor the squad, review workload, and open analytics.</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Open coach view <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
          <Link href="/platform/athlete" className="group rounded-2xl border border-zinc-200 bg-[#0A0A0A] p-7 text-white shadow-[0_18px_50px_rgba(17,24,39,0.14)] transition hover:-translate-y-1 hover:shadow-xl">
            <Smartphone className="mb-12 h-8 w-8 text-[#D7FF3F]" />
            <p className="mb-3 text-xs font-black uppercase text-zinc-400">Player view</p>
            <h2 className="text-3xl font-extrabold leading-tight">Continue as Athlete</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-zinc-300">Check device status, track activity, review goals, and manage profile settings.</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">Open athlete view <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
