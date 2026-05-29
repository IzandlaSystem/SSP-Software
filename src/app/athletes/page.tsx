import { CheckCircle2, History, Lock, Smartphone, Target } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AthleteProgressSection, FeatureGrid, PageIntroVariant } from '@/components/marketing/BrandBlocks';

export default function AthletesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="For athletes"
        title="Your session, your goals, your progress."
        copy="Athletes get a clean personal performance app for device status, activity tracking, goals, feedback, and privacy controls."
        tone="dark"
      />
      <AthleteProgressSection />
      <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">Athlete moments</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal">A personal view for every session.</h2>
          </div>
          <FeatureGrid
            items={[
              { icon: Smartphone, title: 'Device status', copy: 'Know when the tracker concept is ready for a session.' },
              { icon: Target, title: 'Weekly goals', copy: 'See targets set by the coaching staff and current progress.' },
              { icon: CheckCircle2, title: 'Coach feedback', copy: 'Review session notes and next actions after training.' },
              { icon: History, title: 'Session history', copy: 'Look back at activity summaries and progress over time.' },
              { icon: Lock, title: 'Privacy controls', copy: 'Manage visibility and sharing controls from the athlete view.' },
            ]}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
