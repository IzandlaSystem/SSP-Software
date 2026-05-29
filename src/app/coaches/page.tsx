import { BarChart3, ClipboardCheck, Radio, Target, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CoachWorkflowSection, FeatureGrid, PageIntroVariant } from '@/components/marketing/BrandBlocks';

export default function CoachesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="For coaches"
        title="Run training with a clearer view of the squad."
        copy="Plan sessions, monitor squad visibility, set targets, review workload, and keep athletes aligned."
        tone="split"
      />
      <CoachWorkflowSection />
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Coach tools</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal">Built around the training week.</h2>
          </div>
          <FeatureGrid
            items={[
              { icon: Target, title: 'Session planning', copy: 'Create structured sessions and define clear targets before training.' },
              { icon: Radio, title: 'Live squad tracking', copy: 'Follow player outputs during training in a calm, readable view.' },
              { icon: ClipboardCheck, title: 'Post-session review', copy: 'Review target progress, notes, and next steps after each session.' },
              { icon: Users, title: 'Squad roster', copy: 'Keep player profiles, status, and history easy to scan.' },
              { icon: BarChart3, title: 'Analytics', copy: 'Use clear charts to understand team and position trends.' },
            ]}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
