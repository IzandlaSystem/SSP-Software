import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PageIntroVariant, ProcessSteps, VisualPlaceholder } from '@/components/marketing/BrandBlocks';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="How it works"
        title="Plan. Track. Review. Improve."
        copy="A process-led view of how a training session moves from setup to useful post-session insight."
        tone="dark"
      />
      <ProcessSteps />
      <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <VisualPlaceholder title="Session flow" caption="From field to review" variant="field" />
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">What changes after training</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">The work becomes easier to understand.</h2>
            <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
              Coaches can compare players, athletes can see progress, and the team has a clearer view of what to do next.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
