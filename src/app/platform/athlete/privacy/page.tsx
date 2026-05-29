'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  Trash2, 
  Download, 
  AlertTriangle
} from 'lucide-react';

export default function PrivacyPage() {
  // Privacy switch states
  const [optOutTrack, setOptOutTrack] = React.useState<boolean>(true);
  const [localOnly, setLocalOnly] = React.useState<boolean>(false);
  const [anonymizeProfile, setAnonymizeProfile] = React.useState<boolean>(true);

  // Status indicators
  const [wiped, setWiped] = React.useState<boolean>(false);
  const [exporting, setExporting] = React.useState<boolean>(false);

  const clearStorage = () => {
    if (confirm('CAUTION: This will wipe all sessional cache and device configurations from this browser. Proceed?')) {
      localStorage.clear();
      setWiped(true);
      setTimeout(() => setWiped(false), 3000);
    }
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      
      const mockData = {
        athlete: "Alex Long",
        role: "Midfielder #10",
        platform: "SSP Performance Platform",
        exportedAt: new Date().toISOString(),
        privacyStatus: "Active",
        privacyControls: {
          sessionalTrackingOnly: optOutTrack,
          localOnlyCaching: localOnly,
          anonymizeProfile: anonymizeProfile
        }
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(mockData, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `ssp-privacy-alex-long-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Overview</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Data Privacy & Security</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Manage sessional tracking permissions, browser session cache, and data transfer settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Privacy Switches */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-6">
            <div className="border-b border-zinc-300 pb-3 flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-brand-blue" />
              <h3 className="font-extrabold text-sm text-zinc-800">
                Privacy Controls
              </h3>
            </div>

            <div className="space-y-5">
              {/* Switch 1 */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-zinc-950">Sessional Tracking Limits</h4>
                  <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                    Restrict wearable data mapping. Ensures the tracking pod only records metrics during actively started sessional workouts.
                  </p>
                </div>
                <button
                  onClick={() => setOptOutTrack(!optOutTrack)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    optOutTrack ? 'bg-brand-blue' : 'bg-zinc-100 border-zinc-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    optOutTrack ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="h-[1px] bg-zinc-850"></div>

              {/* Switch 2 */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-zinc-950">Local Caching Only</h4>
                  <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                    Save sessional metrics exclusively on your local device. Workload files are not pushed to coaches until manually synced.
                  </p>
                </div>
                <button
                  onClick={() => setLocalOnly(!localOnly)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    localOnly ? 'bg-brand-blue' : 'bg-zinc-100 border-zinc-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    localOnly ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="h-[1px] bg-zinc-850"></div>

              {/* Switch 3 */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-zinc-950">Anonymized Profiles</h4>
                  <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                    Anonymize tracking files before transfer. Shared feeds display performance statistics indexed by playing position or squad number (#10) rather than full name text.
                  </p>
                </div>
                <button
                  onClick={() => setAnonymizeProfile(!anonymizeProfile)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    anonymizeProfile ? 'bg-brand-blue' : 'bg-zinc-100 border-zinc-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    anonymizeProfile ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-800 border-b border-zinc-300 pb-3">
              Data Actions
            </h3>

            <div className="space-y-3">
              {/* Data Export */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-800 border border-zinc-300 rounded-2xl text-xs font-black text-zinc-800 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Download className="h-4.5 w-4.5 text-zinc-600 group-hover:translate-y-0.5 transition-transform" />
                  <span className=" font-semibold">Export Sessional Logs</span>
                </div>
                <span className="text-[9px] font-bold text-zinc-500">
                  {exporting ? 'EXPORTING...' : 'JSON FILE'}
                </span>
              </button>

              {/* Destructive Clear */}
              <button
                onClick={clearStorage}
                className="w-full py-3 px-4 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/25 rounded-2xl text-xs font-black text-brand-cyan transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Trash2 className="h-4.5 w-4.5" />
                  <span className=" font-semibold">Clear Session Cache</span>
                </div>
                <span className="text-[9px] font-bold text-red-450">
                  CLEAR
                </span>
              </button>
            </div>

            {wiped && (
              <div className="bg-zinc-100 border border-zinc-300 rounded-2xl p-4 flex items-center space-x-3 text-brand-cyan text-xs font-bold animate-pulse">
                <AlertTriangle className="h-5 w-5" />
                <span>Session cache cleared.</span>
              </div>
            )}
          </div>

          {/* Explanation Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 flex items-start space-x-3 shadow-lg">
            <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-zinc-800">Secure Wireless Sync</h4>
              <p className="text-[10px] text-zinc-450 leading-relaxed mt-1 font-semibold">
                This platform implements secure, localized sessional sync networks. Workload and movement tracking metrics are strictly handled under sessional rules to respect athlete privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




