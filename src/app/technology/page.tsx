import { Database, LayoutDashboard, RefreshCw, Smartphone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FeatureGrid, PageIntroVariant, ProductSystemDiagram } from '@/components/marketing/BrandBlocks';

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <PageIntroVariant
        eyebrow="Technology"
        title="Product architecture without hardware overclaiming."
        copy="SSP is presented as a frontend demonstration: tracker concept, athlete app, coach platform, and local sync simulation."
        tone="split"
      />
      <ProductSystemDiagram />
      <section className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#2563EB]">System pieces</p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal">Clear components, careful claims.</h2>
            <p className="mt-5 text-base font-medium leading-8 text-zinc-600">
              The technology page explains the demo flow without unsupported hardware specifications.
            </p>
          </div>
          <FeatureGrid
            items={[
              { icon: Smartphone, title: 'Tracking device concept', copy: 'A product placeholder for the wearable experience shown in the demo.' },
              { icon: LayoutDashboard, title: 'Coach dashboard', copy: 'Session planning, live tracking, review, workload, readiness, and analytics.' },
              { icon: Database, title: 'Mock data model', copy: 'Frontend-only data used to demonstrate the product flow.' },
              { icon: RefreshCw, title: 'Local sync simulation', copy: 'A calm upload and device status experience without real integrations.' },
            ]}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
