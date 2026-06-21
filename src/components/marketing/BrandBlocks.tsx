import Link from 'next/link';
import type * as React from 'react';
import { Activity, ArrowRight, BarChart3, CheckCircle2, Cpu, LineChart, Route, ShieldCheck, Smartphone, Target, Users } from 'lucide-react';

export const marketingPalette = {
  ink: '#0A0A0A',
  graphite: '#1F2937',
  offWhite: '#F7F5EF',
  border: '#E5E7EB',
  blue: '#2563EB',
  lime: '#D7FF3F',
};

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-bold text-zinc-700 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
      {children}
    </span>
  );
}

export function CTAButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1F2937]">
        Launch Demo
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href="/product" className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-50">
        Explore Product
      </Link>
    </div>
  );
}

export function ProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute right-0 top-10 hidden h-24 w-24 rounded-full bg-[#D7FF3F] md:block" />
      <div className="relative overflow-hidden rounded-[22px] border border-zinc-200 bg-white p-4 shadow-[0_28px_80px_rgba(17,24,39,0.14)]">
        <div className="grid gap-4 md:grid-cols-[0.78fr_1.22fr]">
          <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] p-5 text-white">
            <div className="absolute -right-10 -top-8 h-28 w-28 rounded-full border border-white/10" />
            <div className="mb-10 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7FF3F] text-[#0A0A0A]">
                <Cpu className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold text-zinc-300">Ready</span>
            </div>
            <p className="text-xs font-semibold text-zinc-400">SSP tracker concept</p>
            <h3 className="mt-1 text-[1.65rem] font-extrabold leading-[1.02]">Device, athlete app, coach platform.</h3>
            <div className="mt-7 grid grid-cols-2 gap-2 text-[10px] font-bold text-zinc-300">
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">Session ready</span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">Team aligned</span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F7F5EF] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">Training path</span>
              <span className="text-xs font-bold text-[#2563EB]">Live session</span>
            </div>
            <svg viewBox="0 0 320 180" className="h-44 w-full">
              <rect x="8" y="8" width="304" height="164" rx="12" fill="none" stroke="#D9D9D6" strokeWidth="2" />
              <line x1="160" y1="8" x2="160" y2="172" stroke="#D9D9D6" strokeWidth="2" />
              <circle cx="160" cy="90" r="34" fill="none" stroke="#D9D9D6" strokeWidth="2" />
              <path d="M45 132 C88 48, 124 42, 163 91 S233 146, 282 58" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
              <circle cx="45" cy="132" r="8" fill="#0A0A0A" />
              <circle cx="163" cy="91" r="8" fill="#D7FF3F" stroke="#0A0A0A" strokeWidth="3" />
              <circle cx="282" cy="58" r="8" fill="#0A0A0A" />
            </svg>
            <div className="mt-1 grid grid-cols-2 gap-2 text-[10px] font-bold text-zinc-600">
              <span className="rounded-lg bg-white px-3 py-2">Movement path</span>
              <span className="rounded-lg bg-white px-3 py-2">Field context</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            ['6.8 km', 'Distance'],
            ['14', 'Sprints'],
            ['82%', 'Target'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-lg font-black text-zinc-950">{value}</p>
              <p className="text-xs font-semibold text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-[#F8FAFC] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#2563EB]" />
              <span className="text-xs font-extrabold text-zinc-900">Coach preview</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-500">Post-session</span>
          </div>
          <div className="flex h-16 items-end gap-2">
            {[34, 52, 44, 68, 58, 76, 61, 84].map((height, index) => (
              <div key={index} className="flex-1 rounded-t bg-[#2563EB]" style={{ height: `${height}%`, opacity: index === 7 ? 1 : 0.22 + index * 0.08 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-zinc-950">{children}</div>;
}

export function Hero({
  eyebrow,
  title,
  copy,
  visual = true,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  visual?: boolean;
}) {
  return (
    <section className="bg-[#F7F5EF] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-7">
          <Pill>{eyebrow}</Pill>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.01] tracking-normal text-[#0A0A0A] sm:text-6xl lg:text-[4.9rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-[1.05rem] font-medium leading-8 text-zinc-700">{copy}</p>
          <CTAButtons />
        </div>
        {visual ? <ProductVisual /> : null}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-zinc-950 sm:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 text-base font-medium leading-7 text-zinc-600">{copy}</p> : null}
    </div>
  );
}

export function FeatureGrid({ items }: { items: Array<{ title: string; copy: string; icon?: React.ComponentType<{ className?: string }> }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon ?? Activity;
        return (
          <div key={item.title} className="rounded-lg border border-zinc-200 bg-white p-7 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
            <Icon className="mb-5 h-6 w-6 text-[#2563EB]" />
            <h3 className="text-lg font-extrabold text-zinc-950">{item.title}</h3>
            <p className="mt-3 text-sm font-medium leading-6 text-zinc-600">{item.copy}</p>
          </div>
        );
      })}
    </div>
  );
}

export const defaultFeatures = [
  { title: 'Plan sessions', copy: 'Build simple session targets by player, position, or squad group.', icon: Target },
  { title: 'Track movement', copy: 'Capture distance, speed zones, sprint counts, and session workload.', icon: Route },
  { title: 'Review performance', copy: 'Compare target progress and trends after each training session.', icon: LineChart },
];

export const audienceFeatures = [
  { title: 'For coaches', copy: 'Create sessions, monitor squad workload, and review players who need attention.', icon: Users },
  { title: 'For athletes', copy: 'Check device status, understand goals, and review personal progress.', icon: Smartphone },
  { title: 'Privacy-aware', copy: 'SSP focuses on session data and clear controls for athletes and teams.', icon: ShieldCheck },
];

export function SportsCampaignHero() {
  return (
    <section className="bg-[#F7F5EF] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-7">
          <Pill>SSP performance technology</Pill>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.01] tracking-normal text-[#0A0A0A] sm:text-6xl lg:text-[4.9rem]">
            Performance tracking built for teams.
          </h1>
          <p className="max-w-2xl text-[1.05rem] font-medium leading-8 text-zinc-700">
            SSP helps coaches and athletes plan sessions, track movement, review performance, and understand progress over time.
          </p>
          <CTAButtons />
        </div>
        <ProductVisual />
      </div>
    </section>
  );
}

export function PageIntroVariant({
  eyebrow,
  title,
  copy,
  tone = 'light',
}: {
  eyebrow: string;
  title: string;
  copy: string;
  tone?: 'light' | 'dark' | 'split';
}) {
  const dark = tone === 'dark';
  return (
    <section className={`${dark ? 'bg-[#0A0A0A] text-white' : 'bg-white text-zinc-950'} px-4 py-16 sm:px-6 lg:px-8`}>
      <div className={`mx-auto grid max-w-7xl gap-10 ${tone === 'split' ? 'lg:grid-cols-[0.75fr_1.25fr]' : 'lg:grid-cols-[0.85fr_1.15fr]'} items-end`}>
        <div>
          <p className={`mb-4 text-xs font-black uppercase ${dark ? 'text-[#D7FF3F]' : 'text-[#2563EB]'}`}>{eyebrow}</p>
          <h1 className="text-4xl font-extrabold leading-[1.03] tracking-normal sm:text-6xl">{title}</h1>
        </div>
        <p className={`max-w-2xl text-base font-medium leading-8 ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>{copy}</p>
      </div>
    </section>
  );
}

export function VisualPlaceholder({
  title,
  caption,
  variant = 'field',
}: {
  title: string;
  caption: string;
  variant?: 'field' | 'device' | 'app';
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-[#F7F5EF] p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-extrabold text-zinc-950">{title}</span>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-zinc-500">{caption}</span>
      </div>
      {variant === 'device' ? (
        <div className="mx-auto flex h-64 max-w-sm items-center justify-center">
          <div className="relative h-44 w-32 rounded-[2rem] bg-[#0A0A0A] p-4 shadow-2xl">
            <div className="absolute -right-5 top-8 h-16 w-16 rounded-full border border-white/10" />
            <div className="flex h-full flex-col justify-between rounded-[1.4rem] border border-white/10 p-4 text-white">
              <Cpu className="h-7 w-7 text-[#D7FF3F]" />
              <div>
                <p className="text-[10px] font-bold text-zinc-400">SSP tracker</p>
                <p className="mt-1 text-2xl font-extrabold leading-none">Ready</p>
              </div>
            </div>
          </div>
        </div>
      ) : variant === 'app' ? (
        <div className="grid gap-3 md:grid-cols-2">
          {['Device ready', 'Weekly target', 'Coach note', 'Session history'].map((item, index) => (
            <div key={item} className="rounded-xl bg-white p-4">
              <div className={`mb-8 h-2 rounded-full ${index === 1 ? 'bg-[#D7FF3F]' : 'bg-[#2563EB]'}`} style={{ width: `${56 + index * 10}%` }} />
              <p className="text-sm font-extrabold text-zinc-950">{item}</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">Clear athlete view</p>
            </div>
          ))}
        </div>
      ) : (
        <svg viewBox="0 0 520 260" className="h-72 w-full">
          <rect x="12" y="12" width="496" height="236" rx="18" fill="#FFFFFF" stroke="#D9D9D6" strokeWidth="2" />
          <line x1="260" y1="12" x2="260" y2="248" stroke="#D9D9D6" strokeWidth="2" />
          <circle cx="260" cy="130" r="48" fill="none" stroke="#D9D9D6" strokeWidth="2" />
          <path d="M70 190 C110 70, 176 70, 224 130 S342 210, 440 68" fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
          <circle cx="70" cy="190" r="10" fill="#0A0A0A" />
          <circle cx="224" cy="130" r="10" fill="#D7FF3F" stroke="#0A0A0A" strokeWidth="3" />
          <circle cx="440" cy="68" r="10" fill="#0A0A0A" />
        </svg>
      )}
    </div>
  );
}

export function ProductSystemDiagram() {
  const nodes = [
    ['Tracker concept', 'Session movement capture', Cpu],
    ['Athlete app', 'Status, goals, feedback', Smartphone],
    ['Coach platform', 'Plan, compare, review', Users],
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">System overview</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">The product is three connected views.</h2>
            <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
              SSP presents the tracker concept, athlete experience, and coach platform as one simple operating loop for training.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-[#F7F5EF] p-5 shadow-[0_22px_70px_rgba(17,24,39,0.09)]">
            <div className="grid gap-4 md:grid-cols-3">
              {nodes.map(([title, copy, Icon], index) => {
                const NodeIcon = Icon as typeof Cpu;
                return (
                  <div key={title as string} className="relative rounded-2xl bg-white p-5">
                    {index < nodes.length - 1 ? <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-[#0A0A0A] p-1 text-white md:block" /> : null}
                    <NodeIcon className="mb-10 h-7 w-7 text-[#2563EB]" />
                    <h3 className="text-lg font-extrabold text-zinc-950">{title as string}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">{copy as string}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl bg-[#0A0A0A] p-5 text-white">
              <p className="text-xs font-bold text-[#D7FF3F]">Shared session record</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Distance', 'Sprints', 'Workload'].map((item, index) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-extrabold">{index === 0 ? '6.8 km' : index === 1 ? '14' : '82%'}</p>
                    <p className="text-xs font-semibold text-zinc-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DevicePlatformSplit() {
  return (
    <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <VisualPlaceholder title="Tracker concept" caption="Device view" variant="device" />
        <div className="grid gap-6">
          {[
            ['Coach view', 'Create sessions, select players, set targets, and review the squad after training.'],
            ['Athlete view', 'Check tracker status, start activity tracking, view goals, and read coach feedback.'],
            ['Shared workflow', 'Both views stay focused on the same session record so teams stay aligned.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_12px_35px_rgba(17,24,39,0.05)]">
              <h3 className="text-2xl font-extrabold text-zinc-950">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-7 text-zinc-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSteps() {
  const steps = [
    ['Plan', 'Create the session, choose the squad, and set clear targets.'],
    ['Track', 'Capture movement during training in the live session view.'],
    ['Review', 'Compare target progress in coach and athlete summaries.'],
    ['Improve', 'Use trends to shape the next session and keep players aligned.'],
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase text-[#D7FF3F]">Plan to progress</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">One training loop, four clear moments.</h2>
            </div>
            <div className="grid gap-4">
              {steps.map(([title, copy], index) => (
                <div key={title} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-[4rem_1fr] sm:items-center">
                  <span className="text-4xl font-extrabold text-[#D7FF3F]">0{index + 1}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold">{title}</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-zinc-300">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CoachWorkflowSection() {
  const rows = [
    ['Before training', 'Plan sessions, group players, and set clear targets.'],
    ['During training', 'Track live squad movement and spot players needing review.'],
    ['After training', 'Compare players, monitor workload, and share next steps.'],
  ];

  return (
    <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_22px_70px_rgba(17,24,39,0.08)]">
          <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-4">
            <h2 className="text-2xl font-extrabold">Coach workflow board</h2>
            <span className="rounded-full bg-[#F7F5EF] px-3 py-1 text-[10px] font-bold text-zinc-600">Training day</span>
          </div>
          <div className="space-y-4">
            {rows.map(([title, copy], index) => (
              <div key={title} className="grid gap-4 rounded-2xl border border-zinc-200 p-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] text-sm font-extrabold text-white">{index + 1}</span>
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-950">{title}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-zinc-600">{copy}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <p className="text-xs font-black uppercase text-[#2563EB]">For performance staff</p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">A practical view of the whole squad.</h2>
          <p className="text-base font-medium leading-8 text-zinc-600">
            Coaches need fast decisions: who is on target, who needs review, and what the next session should look like.
          </p>
          <Link href="/platform/coach" className="inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-7 py-3 text-sm font-bold text-white">
            Open Coach Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AthleteProgressSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs font-black uppercase text-[#2563EB]">Athlete experience</p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">Personal progress without the noise.</h2>
          <p className="text-base font-medium leading-8 text-zinc-600">
            The athlete view keeps sessions simple: tracker status, live activity, weekly goals, coach feedback, and history.
          </p>
          <Link href="/platform/athlete" className="inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-7 py-3 text-sm font-bold text-white">
            Open Athlete Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <VisualPlaceholder title="Personal performance app" caption="Athlete view" variant="app" />
      </div>
    </section>
  );
}

export function PlatformPreviewBand() {
  return (
    <section className="bg-[#0A0A0A] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="mb-3 text-xs font-black uppercase text-[#D7FF3F]">Platform preview</p>
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">The operating system behind the product story.</h2>
          <p className="mt-5 text-base font-medium leading-8 text-zinc-300">
            Launch the demo to move through coach and athlete journeys using mock session data.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white p-4 text-zinc-950">
          <div className="grid gap-3 md:grid-cols-3">
            {['Coach dashboard', 'Live tracking', 'Athlete goals'].map((title, index) => (
              <div key={title} className="rounded-2xl border border-zinc-200 bg-[#F8FAFC] p-5">
                <div className={`mb-8 h-2 rounded-full ${index === 1 ? 'bg-[#D7FF3F]' : 'bg-[#2563EB]'}`} style={{ width: `${62 + index * 12}%` }} />
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-5 text-zinc-500">Clean dashboard proof, not the whole public-site identity.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DemoCTASection({ title = 'Ready to see SSP in motion?' }: { title?: string }) {
  return (
    <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <Route className="mb-6 h-9 w-9 text-[#2563EB]" />
        <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-zinc-600">
          Open the demo platform to explore the coach and athlete workflows with mock data only.
        </p>
        <div className="mt-8">
          <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#1F2937]">
            Launch Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
