import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  AthleteProgressSection,
  CoachWorkflowSection,
  DemoCTASection,
  FeatureGrid,
  PlatformPreviewBand,
  SportsCampaignHero,
  defaultFeatures,
} from '@/components/marketing/BrandBlocks';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <SportsCampaignHero />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Device + platform</p>
            <h2 className="text-4xl font-black leading-none tracking-normal sm:text-5xl">A simple loop for every training session.</h2>
          </div>
          <FeatureGrid items={defaultFeatures} />
        </div>
      </section>

      <section className="bg-[#0A0A0A] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase text-[#D7FF3F]">The performance tracking problem</p>
            <h2 className="text-4xl font-black leading-none sm:text-6xl">Teams need clarity, not another busy dashboard.</h2>
            <p className="max-w-xl text-base font-medium leading-8 text-zinc-300">
              SSP keeps the workflow practical: set targets before training, track movement during the session, then review clean summaries after the work is done.
            </p>
          </div>
          <div className="grid gap-3">
            {['Squad targets are easy to set before training.', 'Athletes see clear personal progress.', 'Coaches review workload and next steps in one place.'].map((copy) => (
              <div key={copy} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-[#D7FF3F]" />
                <span className="text-sm font-semibold text-zinc-100">{copy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CoachWorkflowSection />
      <AthleteProgressSection />
      <PlatformPreviewBand />
      <DemoCTASection title="See the coach and athlete journeys." />
      <Footer />
    </div>
  );
}
