'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'thresholds' | 'hardware' | 'compliance'>('thresholds');

  // Threshold States
  const [warningAcwr, setWarningAcwr] = React.useState<number>(1.3);
  const [criticalAcwr, setCriticalAcwr] = React.useState<number>(1.5);
  const [distThreshold, setDistThreshold] = React.useState<number>(8500);

  // Hardware States
  const [trackingMode, setTrackingMode] = React.useState<'Standard' | 'Enhanced'>('Standard');
  const [deviceSyncEnabled, setDeviceSyncEnabled] = React.useState<boolean>(true);
  const [alertBeeps, setAlertBeeps] = React.useState<boolean>(false);

  // Privacy States
  const [retentionPeriod, setRetentionPeriod] = React.useState<string>('365');
  const [anonymizeData, setAnonymizeData] = React.useState<boolean>(true);

  // Custom Success Alert
  const [showSavedAlert, setShowSavedAlert] = React.useState<boolean>(false);

  const handleSaveSettings = () => {
    setShowSavedAlert(true);
    setTimeout(() => {
      setShowSavedAlert(false);
    }, 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Dynamic Success Alert Banner */}
      {showSavedAlert && (
        <div className="bg-zinc-50 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Icons.Check className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-950">
                System Parameters Synchronised
              </h4>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                New session targets and thresholds applied to active squad views.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowSavedAlert(false)}
            className="text-zinc-500 hover:text-zinc-700 transition-colors p-1"
          >
            <Icons.X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.Settings className="h-4 w-4" />
            <span>Platform Preferences</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            System Control Settings
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Configure sessional warning limits, toggle device tracking modes, and manage storage compliance variables.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition-all hover:scale-[1.02] shadow shadow-brand-blue/25 cursor-pointer flex items-center space-x-1.5 self-start md:self-center"
        >
          <Icons.Save className="h-4 w-4" />
          <span>Save parameters</span>
        </button>
      </div>

      {/* Configuration tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="bg-zinc-50 border border-zinc-300 p-4 rounded-2xl shadow-xl space-y-1.5 h-fit">
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'thresholds'
                ? 'bg-brand-blue text-white'
                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-800/40'
            }`}
          >
            <Icons.Sliders className="h-4 w-4 shrink-0" />
            <span>Roster Thresholds</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'hardware'
                ? 'bg-brand-blue text-white'
                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-800/40'
            }`}
          >
            <Icons.Cpu className="h-4 w-4 shrink-0" />
            <span>Tracker Devices</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-brand-blue text-white'
                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-800/40'
            }`}
          >
            <Icons.Lock className="h-4 w-4 shrink-0" />
            <span>Privacy & Data Settings</span>
          </button>
        </div>

        {/* Tab content panel */}
        <div className="lg:col-span-3 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xl min-h-[380px] flex flex-col justify-between">
          
          {/* Tab 1: Roster Thresholds */}
          {activeTab === 'thresholds' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-zinc-200 pb-3">
                <h3 className="text-base font-black text-zinc-950">Workload Alarm Thresholds</h3>
                <p className="text-xs text-zinc-600 mt-0.5">Control filters that trigger elevated ACWR alerts on the main dashboard.</p>
              </div>

              <div className="space-y-5">
                {/* Warning ACWR limit */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 space-y-3">
                  <div className="flex justify-between items-baseline text-xs font-bold text-zinc-600">
                    <span className="flex items-center space-x-1.5">
                      <Icons.AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Warning ACWR Boundary</span>
                    </span>
                    <span className="text-amber-500 text-sm font-black">{warningAcwr.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.4"
                    step="0.05"
                    value={warningAcwr}
                    onChange={(e) => setWarningAcwr(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[9px] text-zinc-500">
                    Ratios above this margin trigger caution badges on squad leaderboards.
                  </p>
                </div>

                {/* Critical ACWR limit */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 space-y-3">
                  <div className="flex justify-between items-baseline text-xs font-bold text-zinc-600">
                    <span className="flex items-center space-x-1.5">
                      <Icons.AlertOctagon className="h-4 w-4 text-brand-blue animate-pulse" />
                      <span>Critical Rest Limit</span>
                    </span>
                    <span className="text-brand-blue text-sm font-black">{criticalAcwr.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.4"
                    max="1.8"
                    step="0.05"
                    value={criticalAcwr}
                    onChange={(e) => setCriticalAcwr(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <p className="text-[9px] text-zinc-500">
                    Ratios above this limit flag the athlete with &quot;Recovery suggested (coaching note only)&quot; immediately.
                  </p>
                </div>

                {/* Roster Distance Warning limit */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 space-y-3">
                  <div className="flex justify-between items-baseline text-xs font-bold text-zinc-600">
                    <span>Target Distance warning limit</span>
                    <span className="text-zinc-950 text-sm font-black">{distThreshold} m</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="12000"
                    step="500"
                    value={distThreshold}
                    onChange={(e) => setDistThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <p className="text-[9px] text-zinc-500">
                    Bilateral workload volumes exceeding this value alarm during live sessions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Hardware Settings */}
          {activeTab === 'hardware' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-zinc-200 pb-3">
                <h3 className="text-base font-black text-zinc-950">Wearable Pod Sync</h3>
                <p className="text-xs text-zinc-600 mt-0.5">Control sessional tracking features and device sync behaviors.</p>
              </div>

              <div className="space-y-4">
                {/* 1. Tracking mode selector */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Tracking Accuracy</h4>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Enhanced mode increases tracking detail but halves battery lifespan.
                    </p>
                  </div>
                  <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-200">
                    {['Standard', 'Enhanced'].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setTrackingMode(rate as 'Standard' | 'Enhanced')}
                        className={`px-4 py-2 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                          trackingMode === rate ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Device receiver lock switch */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Device Receiver Lock</h4>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Secure position tracking markers. Lock sensor tracking inside pitch boundaries.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeviceSyncEnabled(!deviceSyncEnabled)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                      deviceSyncEnabled ? 'bg-brand-blue' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded-full bg-white transition-transform ${
                      deviceSyncEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 3. Audio Alarm switch */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Vibration warnings</h4>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Enable wearable pod status feedback if warning limits are breached.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlertBeeps(!alertBeeps)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                      alertBeeps ? 'bg-brand-blue' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded-full bg-white transition-transform ${
                      alertBeeps ? 'translate-x-5.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Privacy Compliance */}
          {activeTab === 'compliance' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-zinc-200 pb-3">
                <h3 className="text-base font-black text-zinc-950">Privacy Controls Settings</h3>
                <p className="text-xs text-zinc-600 mt-0.5">Control storage retention schedules and session data export preferences.</p>
              </div>

              <div className="space-y-4">
                {/* 1. Retention period select */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Automatic Deletion Schedule</h4>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Purge sessional history after set period.
                    </p>
                  </div>
                  <select
                    value={retentionPeriod}
                    onChange={(e) => setRetentionPeriod(e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue font-extrabold cursor-pointer"
                  >
                    <option value="90">90 Days Cycle</option>
                    <option value="180">180 Days Cycle</option>
                    <option value="365">1 Year Cycle</option>
                    <option value="infinite">Keep indefinitely</option>
                  </select>
                </div>

                {/* 2. Anonymous transmission toggler */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Anonymous Session Sync</h4>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Sync session logs using anonymous device IDs instead of athlete names.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnonymizeData(!anonymizeData)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                      anonymizeData ? 'bg-brand-blue' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 rounded-full bg-white transition-transform ${
                      anonymizeData ? 'translate-x-5.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* 3. Export Privacy workbook */}
                <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-300 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-950">Privacy Data Portability</h4>
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Download complete session history for review.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Exporting complete Privacy data portfolio...')}
                    className="px-4 py-2 border border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-700 hover:text-white rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
                  >
                    Export Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save notice */}
          <div className="mt-8 pt-4 border-t border-zinc-300 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Settings profile: team demo</span>
            <span>Device sync active</span>
          </div>

        </div>
      </div>

    </div>
  );
}





