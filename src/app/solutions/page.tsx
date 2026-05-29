import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, History, Smartphone, Target, Users, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AthleteProgressSection, CoachWorkflowSection, PageIntroVariant, VisualPlaceholder } from '@/components/marketing/BrandBlocks';

const coachItems = [
  ['Plan sessions', 'Build training sessions, assign players, and set clear targets.', Target],
  ['Track the squad', 'Follow live movement and see which players need review.', Users],
  ['Review the work', 'Compare players, monitor workload, and support coaching decisions.', BarChart3],
];

const athleteItems = [
  ['Check status', 'Know when the tracker concept and session view are ready.', Smartphone],
  ['Track activity', 'Follow distance, speed zones, sprint counts, and session workload.', Zap],
  ['Understand progress', 'Review goals, coach feedback, and session history over time.', History],
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="Solutions"
        title="One product story for coaches and athletes."
        copy="SSP connects the performance staff workflow with the athlete experience, so the same session record supports planning, tracking, review, and progress."
        tone="split"
      />

      <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_22px_70px_rgba(17,24,39,0.08)]">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Coach experience</p>
                <h2 className="text-4xl font-extrabold leading-tight tracking-normal">Run the training week with clarity.</h2>
              </div>
              <ClipboardCheck className="h-8 w-8 shrink-0 text-[#2563EB]" />
            </div>
            <div className="space-y-4">
              {coachItems.map(([title, copy, Icon]) => {
                const ItemIcon = Icon as typeof Target;
                return (
                  <div key={title as string} className="flex gap-4 rounded-2xl border border-zinc-200 p-4">
                    <ItemIcon className="mt-1 h-5 w-5 shrink-0 text-[#2563EB]" />
                    <div>
                      <h3 className="text-base font-extrabold text-zinc-950">{title as string}</h3>
                      <p className="mt-1 text-sm font-medium leading-6 text-zinc-600">{copy as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/coaches" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-950">
              View coach detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-[#0A0A0A] p-6 text-white shadow-[0_22px_70px_rgba(17,24,39,0.14)]">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-black uppercase text-[#D7FF3F]">Athlete experience</p>
                <h2 className="text-4xl font-extrabold leading-tight tracking-normal">Make progress easier to understand.</h2>
              </div>
              <Smartphone className="h-8 w-8 shrink-0 text-[#D7FF3F]" />
            </div>
            <div className="space-y-4">
              {athleteItems.map(([title, copy, Icon]) => {
                const ItemIcon = Icon as typeof Target;
                return (
                  <div key={title as string} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <ItemIcon className="mt-1 h-5 w-5 shrink-0 text-[#D7FF3F]" />
                    <div>
                      <h3 className="text-base font-extrabold">{title as string}</h3>
                      <p className="mt-1 text-sm font-medium leading-6 text-zinc-300">{copy as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/athletes" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
              View athlete detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">How both sides connect</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">A shared session record keeps everyone aligned.</h2>
            <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
              Coaches plan and review. Athletes track and understand progress. SSP keeps both experiences focused on the same session story.
            </p>
            <div className="mt-7 grid gap-3">
              {['Plan sessions before training', 'Track movement during the session', 'Review performance after the work'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-zinc-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <VisualPlaceholder title="Coach and athlete connection" caption="Shared workflow" variant="field" />
        </div>
      </section>

      <CoachWorkflowSection />
      <AthleteProgressSection />

      <section className="bg-[#F7F5EF] px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl">Review both demo journeys.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-zinc-600">
            Launch the demo gateway to continue as a coach or athlete using mock data.
          </p>
          <Link href="/login" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1F2937]">
            Launch Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
