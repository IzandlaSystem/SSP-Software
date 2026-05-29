'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Link2, 
  RefreshCw, 
  Smartphone, 
  CheckCircle, 
  Signal, 
  Battery, 
  Cpu, 
  AlertTriangle, 
  ArrowLeft,
  XCircle,
  Radio
} from 'lucide-react';

export default function DevicePairingPage() {
  const [scanning, setScanning] = React.useState<boolean>(false);
  const [connecting, setConnecting] = React.useState<boolean>(false);
  const [paired, setPaired] = React.useState<boolean>(false);
  const [discovered, setDiscovered] = React.useState<boolean>(false);
  
  const [batteryLevel] = React.useState<number>(98);

  // Sync state on load
  React.useEffect(() => {
    const isPaired = localStorage.getItem('ssp-device-connected') === 'true';
    setPaired(isPaired);
    if (isPaired) {
      setDiscovered(true);
    }
  }, []);

  // Simulator Actions
  const startScan = () => {
    setScanning(true);
    setDiscovered(false);
    setPaired(false);
    
    // Discovered after 3 seconds of scanning
    setTimeout(() => {
      setScanning(false);
      setDiscovered(true);
    }, 3000);
  };

  const connectDevice = () => {
    setConnecting(true);
    
    // Connects after 2.5 seconds
    setTimeout(() => {
      setConnecting(false);
      setPaired(true);
      
      const deviceDetails = {
        name: 'SSP Tracker V2 (SN-8942-X)',
        connectionStatus: 'Active',
        trackingMode: 'Standard',
        syncStatus: 'Ready',
        battery: 98,
        pairedAt: new Date().toISOString()
      };
      
      localStorage.setItem('ssp-device-connected', 'true');
      localStorage.setItem('ssp-device-details', JSON.stringify(deviceDetails));
    }, 2500);
  };

  const disconnectDevice = () => {
    setPaired(false);
    setDiscovered(false);
    localStorage.removeItem('ssp-device-connected');
    localStorage.removeItem('ssp-device-details');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Overview</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">SSP Device Pairing</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Connect your SSP tracker for session movement tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Device search simulation */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between min-h-[420px] shadow-lg">
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-zinc-800 flex items-center justify-between">
              <span>Tracker Search</span>
              {scanning && <span className="text-[10px] text-emerald-600">Searching...</span>}
            </h3>
            <p className="text-xs text-zinc-500">
              Searches for nearby SSP trackers. Keep your tracker close by.
            </p>
          </div>

          {/* Graphical search simulator */}
          <div className="my-8 flex justify-center items-center">
            <div className="w-52 h-52 rounded-full border border-zinc-200 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
              
              {/* Concentric grid rings */}
              <div className="absolute w-40 h-40 rounded-full border border-zinc-300/60 pointer-events-none"></div>
              <div className="absolute w-28 h-28 rounded-full border border-zinc-200/40 pointer-events-none"></div>
              <div className="absolute w-16 h-16 rounded-full border border-zinc-300/20 pointer-events-none"></div>
              
              {/* Search progress sweep */}
              {scanning && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent origin-center animate-spin" 
                  style={{ animationDuration: '2.5s' }}
                />
              )}

              {/* Central search node */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow">
                <Link2 className={`h-5 w-5 ${scanning ? 'text-emerald-600' : paired ? 'text-emerald-600' : 'text-zinc-500'}`} />
              </div>

              {/* Scanning found dot */}
              {discovered && !scanning && (
                <div className="absolute top-1/4 right-1/4 w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={startScan}
            disabled={scanning || connecting}
            className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 border shadow-lg ${
              scanning 
                ? 'bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <Radio className={`h-4.5 w-4.5 ${scanning ? 'text-emerald-600' : 'text-zinc-600'}`} />
            <span>{scanning ? 'Searching for tracker...' : 'Search for tracker'}</span>
          </button>
        </div>

        {/* Right Column: Connection Listing & Lock Status */}
        <div className="space-y-6">
          
          {/* Default Discovery Listing */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-800">
              Available Devices
            </h3>

            {scanning ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-zinc-500 animate-spin" />
                <p className="text-xs text-zinc-600">Looking for nearby SSP trackers...</p>
              </div>
            ) : discovered && !paired ? (
              <div className="space-y-3">
                <div className="bg-zinc-100/80 border border-zinc-300 rounded-2xl p-4 flex items-center justify-between transition-all hover:border-zinc-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-350">
                      <Smartphone className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-950">SSP Tracker V2</h4>
                      <p className="text-[10px] text-zinc-500">SN-8942-X</p>
                      
                      {/* Signal & Battery metrics */}
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="text-[9px] font-bold text-zinc-600 flex items-center space-x-0.5">
                          <Signal className="h-3 w-3 text-emerald-400" />
                          <span>Status: Ready</span>
                        </span>
                        <span className="text-[9px] font-bold text-zinc-600 flex items-center space-x-0.5">
                          <Battery className="h-3 w-3 text-emerald-400" />
                          <span>{batteryLevel}%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={connectDevice}
                    disabled={connecting}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    {connecting ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span>Connect</span>
                    )}
                  </button>
                </div>
              </div>
            ) : paired ? (
              <div className="bg-zinc-100/80 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-950">SSP Tracker Active</h4>
                      <p className="text-[9px] text-emerald-400 font-extrabold">
                        Connected and ready
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={disconnectDevice}
                    className="p-1 rounded hover:bg-brand-blue/10 text-zinc-500 hover:text-brand-cyan transition-all"
                    title="Disconnect Device"
                  >
                    <XCircle className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="h-[1px] bg-zinc-50"></div>

                {/* Connection metrics */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-zinc-50 border border-zinc-300 rounded-xl">
                    <span className="text-[9px] font-bold text-zinc-500 block mb-1">Signal Status</span>
                    <span className="text-sm font-black text-zinc-950">Connected</span>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-300 rounded-xl">
                    <span className="text-[9px] font-bold text-zinc-500 block mb-1">Tracking Mode</span>
                    <span className="text-sm font-black text-zinc-950">Standard</span>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-300 rounded-xl">
                    <span className="text-[9px] font-bold text-zinc-500 block mb-1">Sync Status</span>
                    <span className="text-sm font-black text-emerald-600">Ready</span>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-300 rounded-xl">
                    <span className="text-[9px] font-bold text-zinc-500 block mb-1">Battery</span>
                    <span className="text-sm font-black text-zinc-950">{batteryLevel}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Cpu className="h-8 w-8 text-zinc-650" />
                <p className="text-xs font-bold text-zinc-600">Ready to search</p>
                <p className="text-[10px] text-zinc-500 max-w-[220px]">
                  Select search to find nearby tracking units.
                </p>
              </div>
            )}
          </div>

          {/* Quick Informational Notice */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 flex items-start space-x-3 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-zinc-800">Tracking Reminder</h4>
              <p className="text-[10px] text-zinc-450 leading-relaxed mt-1 font-semibold">
                For best session tracking, fit the wearable securely and start activity from an open training area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






