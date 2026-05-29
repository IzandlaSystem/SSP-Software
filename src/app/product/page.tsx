import Link from 'next/link';
import { ArrowRight, GitCompare, Route, Target } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { DevicePlatformSplit, FeatureGrid, PageIntroVariant, ProductSystemDiagram } from '@/components/marketing/BrandBlocks';

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="Product"
        title="Device-led tracking with a coach-ready platform."
        copy="SSP connects a wearable tracking concept, athlete app, and coach dashboard into one clear workflow for team performance."
        tone="split"
      />
      <ProductSystemDiagram />
      <DevicePlatformSplit />
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Product capabilities</p>
              <h2 className="text-4xl font-extrabold leading-tight tracking-normal">Simple metrics, clear decisions.</h2>
            </div>
            <FeatureGrid
              items={[
                { icon: Target, title: 'Plan targets', copy: 'Set distance, sprint, and workload goals before training begins.' },
                { icon: Route, title: 'Track movement', copy: 'Capture the session outputs that matter for field-based team sport.' },
                { icon: GitCompare, title: 'Compare progress', copy: 'Review player, position, and squad trends over time.' },
              ]}
            />
          </div>
        </div>
      </section>
      <section className="bg-[#0A0A0A] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#D7FF3F]">Connected roles</p>
            <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">Coach and athlete views support the same session.</h2>
          </div>
          <div className="grid gap-4">
          {[
            ['Coach dashboard', 'Session setup, live squad tracking, post-session review, workload, readiness, and messages.'],
            ['Athlete app', 'Device status, activity tracking, session history, goals, sync, privacy controls, and profile settings.'],
            ['Shared data view', 'Clean summaries that keep the team aligned without unsupported tracking claims.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-zinc-300">{copy}</p>
            </div>
          ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-7 py-3 text-sm font-bold text-white">
          Launch Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      <Footer />
    </div>
  );
}
