import { ShieldCheck, Target, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FeatureGrid, PageIntroVariant, VisualPlaceholder } from '@/components/marketing/BrandBlocks';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="About SSP"
        title="Built to close the gap between training data and daily decisions."
        copy="SSP is built around one idea: team tracking should be clear enough for coaches and useful enough for athletes."
        tone="dark"
      />
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Why it exists</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">Performance tools should help the whole team understand the work.</h2>
            <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
              Coaches need a practical view of sessions. Athletes need feedback that makes sense. SSP brings those views together in a focused demo product.
            </p>
          </div>
          <VisualPlaceholder title="Coach and athlete gap" caption="Product vision" variant="field" />
        </div>
      </section>
      <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Principles</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal">Credible, focused, and easy to understand.</h2>
          </div>
          <FeatureGrid
            items={[
              { icon: Target, title: 'Movement-first', copy: 'Focus on session movement, targets, workload, and progress.' },
              { icon: Users, title: 'Team-aligned', copy: 'Connect the coach view and athlete view without adding workflow friction.' },
              { icon: ShieldCheck, title: 'Privacy-aware', copy: 'Use clear controls and avoid unsupported tracking claims.' },
            ]}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
