'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RefreshCw, 
  Wifi, 
  HardDrive, 
  CheckCircle, 
  Layers, 
  Database,
  Radio,
  FileCode,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function SessionSyncPage() {
  const [syncing, setSyncing] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [statusText, setStatusText] = React.useState<string>('Local session queued. Ready to sync.');
  const [success, setSuccess] = React.useState<boolean>(false);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Unsynced sessions queue
  const [packets, setPackets] = React.useState<any[]>([
    { id: '1', name: 'Session 26-05-2026', size: '12.4 MB', type: 'Session data package', timestamp: '2026-05-26T18:30:00Z' },
    { id: '2', name: 'Drill Calibrations', size: '1.8 MB', type: 'Session movement metrics', timestamp: '2026-05-26T14:15:00Z' }
  ]);

  React.useEffect(() => {
    const timers = timersRef.current;
    // Check if there's a custom session logged from the live simulator
    const unsyncedSession = localStorage.getItem('ssp-unsynced-session');
    if (unsyncedSession) {
      try {
        const parsed = JSON.parse(unsyncedSession);
        const customPacket = {
          id: 'custom',
          name: `Session ${new Date(parsed.timestamp).toLocaleDateString('en-GB')}`,
          size: `${parsed.strain ? (parseFloat(parsed.strain) * 0.03).toFixed(1) : '12.4'} MB`,
          type: 'Live session data',
          timestamp: parsed.timestamp
        };
        setPackets((currentPackets) => [customPacket, ...currentPackets]);
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      timers.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startSessionSync = () => {
    setSyncing(true);
    setSuccess(false);
    setProgress(0);
    setStatusText('Connecting to paired SSP tracker...');

    // Progress animation for session file upload
    const startTimer = setTimeout(() => {
      setStatusText('Connection ready. Uploading session files...');
      
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            finalizeSync();
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }, 1500);
    timersRef.current.push(startTimer);
  };

  const finalizeSync = () => {
    setStatusText('Finalizing session upload...');

    const finalizeTimer = setTimeout(() => {
      setSyncing(false);
      setSuccess(true);
      setStatusText('Sync complete.');
      setPackets([]);
      
      // Clear unsynced items from storage
      localStorage.removeItem('ssp-unsynced-session');
    }, 1500);
    timersRef.current.push(finalizeTimer);
  };

  const generateMockPacket = () => {
    setSuccess(false);
    setStatusText('Local session queued. Ready to sync.');
    setPackets([
      { id: Date.now().toString(), name: `Session ${new Date().toLocaleDateString('en-GB')}`, size: '10.8 MB', type: 'Session movement file', timestamp: new Date().toISOString() }
    ]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Overview</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Offline Sync</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Simulate local sync uploads for cached session data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns: Queued Packet Buffer */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-300 pb-3">
              <h3 className="font-extrabold text-sm text-zinc-800 flex items-center space-x-2">
                <Layers className="h-4.5 w-4.5 text-brand-blue" />
                <span>Queued Session Files</span>
              </h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-500">
                {packets.length} Files Pending
              </span>
            </div>

            {packets.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="h-12 w-12 text-emerald-400 animate-bounce" />
                <div>
                  <h4 className="text-sm font-black text-zinc-950">All sessions synced</h4>
                  <p className="text-[10px] text-zinc-500 max-w-sm mt-1">
                    All session files have been successfully synced to the coach view.
                  </p>
                </div>
                <button
                  onClick={generateMockPacket}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-800 text-zinc-700 border border-zinc-300 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Queue Test Session</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {packets.map((packet) => (
                  <div 
                    key={packet.id}
                    className="bg-zinc-100/80 border border-zinc-300 rounded-2xl p-4 flex items-center justify-between transition-all hover:border-zinc-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-350">
                        <FileCode className="h-5 w-5 text-brand-cyan" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-zinc-950">{packet.name}</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{packet.type}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-zinc-950 bg-zinc-50 border border-zinc-300 px-3 py-1 rounded-xl">
                      {packet.size}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sync status */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-800 border-b border-zinc-300 pb-3">
              Wireless Upload Status
            </h3>

            {syncing ? (
              <div className="space-y-4 py-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-600">{statusText}</span>
                  <span className="text-zinc-950">{progress}%</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-300">
                  <div 
                    className="h-full bg-brand-blue rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center space-x-2 text-[9px] text-zinc-500">
                  <RefreshCw className="h-3 w-3 animate-spin text-amber-500" />
                  <span>Preparing session movement data - sync active</span>
                </div>
              </div>
            ) : success ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/25">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Sync complete</h4>
                    <p className="text-[10px] text-emerald-400 mt-0.5">Session files are available in the coach view.</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Synced
                </span>
              </div>
            ) : (
              <div className="py-2.5">
                <button
                  onClick={startSessionSync}
                  disabled={packets.length === 0}
                  className={`w-full py-4.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 border shadow-lg ${
                    packets.length === 0
                      ? 'bg-zinc-100 border-zinc-300 text-zinc-650 cursor-not-allowed'
                      : 'bg-brand-blue hover:bg-brand-blue/90 active:scale-98 text-white border-brand-blue/20 shadow-brand-blue/15 cursor-pointer'
                  }`}
                >
                  <Wifi className="h-4.5 w-4.5" />
                  <span>Sync Session Files</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hardware stats */}
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-5">
            <h3 className="font-extrabold text-sm text-zinc-800 border-b border-zinc-300 pb-3">
              Storage Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-zinc-100 rounded-2xl border border-zinc-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                    <HardDrive className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-500 block">Local Storage</span>
                    <span className="text-sm font-black text-zinc-950">96% Free</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-zinc-600 bg-zinc-50 border border-zinc-300 px-2 py-0.5 rounded">
                  15.2 GB Free
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-zinc-100 rounded-2xl border border-zinc-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <Database className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-500 block">Sync Quality</span>
                    <span className="text-sm font-black text-zinc-950">Ready</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Healthy
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-zinc-100 rounded-2xl border border-zinc-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                    <Radio className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-500 block">Tracker Sync</span>
                    <span className="text-sm font-black text-zinc-950">Ready</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-zinc-600 bg-zinc-50 border border-zinc-300 px-2 py-0.5 rounded">
                  Wireless
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 flex items-start space-x-3 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-zinc-800">Storage Reminder</h4>
              <p className="text-[10px] text-zinc-450 leading-relaxed mt-1 font-semibold">
                Local session storage has enough room for upcoming sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






