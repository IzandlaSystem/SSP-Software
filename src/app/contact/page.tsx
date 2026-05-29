'use client';

import * as React from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PageIntroVariant } from '@/components/marketing/BrandBlocks';

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="Request a demo"
        title="Talk to SSP about your team workflow."
        copy="Tell us what you want to review: coach planning, athlete progress, live tracking, or post-session summaries."
        tone="split"
      />
      <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">What happens next</p>
              <h2 className="text-4xl font-extrabold leading-tight tracking-normal">A focused product walkthrough.</h2>
              <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
                The demo request is simple: share your team context, then review the public product story and demo platform flow.
              </p>
            </div>
            {['Coach dashboard tour', 'Athlete app walkthrough', 'Session tracking review'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-zinc-800">{item}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_22px_70px_rgba(17,24,39,0.08)] sm:p-8">
          {submitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
              <h2 className="text-2xl font-black">Request received</h2>
              <p className="mt-2 text-sm font-medium text-zinc-600">Thanks. This demo form is frontend-only, but the flow is now ready for review.</p>
            </div>
          ) : (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label className="grid gap-2 text-xs font-bold text-zinc-700">
                Full name
                <input required className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950" />
              </label>
              <label className="grid gap-2 text-xs font-bold text-zinc-700">
                Email address
                <input required type="email" className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950" />
              </label>
              <label className="grid gap-2 text-xs font-bold text-zinc-700">
                Club or organization
                <input required className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950" />
              </label>
              <label className="grid gap-2 text-xs font-bold text-zinc-700">
                Interest
                <select className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950" defaultValue="Request a Demo">
                <option>Request a Demo</option>
                <option>Talk to SSP</option>
                <option>Explore the platform</option>
              </select>
              </label>
              <label className="grid gap-2 text-xs font-bold text-zinc-700">
                What would you like to review?
                <textarea className="min-h-32 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950" />
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-white">
                <Send className="h-4 w-4" /> Send Request
              </button>
            </form>
          )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
