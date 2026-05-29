'use client';

import * as React from 'react';
import PlatformSidebar from '@/components/layout/PlatformSidebar';
import PlatformTopbar from '@/components/layout/PlatformTopbar';

export default function CoachPlatformLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="platform-shell flex h-screen bg-[#F7F7F5] text-zinc-900 font-sans overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full">
        <PlatformSidebar role="coach" />
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Responsive Topbar */}
        <PlatformTopbar role="coach" onMenuClick={() => setMobileOpen(true)} />

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-64 h-full relative animate-in slide-in-from-left duration-250 shrink-0">
              <PlatformSidebar 
                role="coach" 
                onLinkClick={() => setMobileOpen(false)} 
                onClose={() => setMobileOpen(false)} 
              />
            </div>
            {/* Clickable Backdrop to Close */}
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Content Portal */}
        <main className="flex-1 overflow-y-auto bg-[#F7F7F5] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}



