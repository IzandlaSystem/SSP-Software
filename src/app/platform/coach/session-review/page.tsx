'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import ClientOnly from '@/components/performance/ClientOnly';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';

const RechartsResponsiveContainer = ResponsiveContainer as any;
const RechartsRadarChart = RadarChart as any;
const RechartsPolarGrid = PolarGrid as any;
const RechartsPolarAngleAxis = PolarAngleAxis as any;
const RechartsPolarRadiusAxis = PolarRadiusAxis as any;
const RechartsRadar = Radar as any;
const RechartsTooltip = Tooltip as any;
const RechartsLegend = Legend as any;

export default function SessionReviewPage() {
  const [sessionData, setSessionData] = React.useState<any>(null);
  const [coachNotes, setCoachNotes] = React.useState<string>('');
  
  // Custom interactive modal states
  const [actionType, setActionType] = React.useState<'save' | 'export' | 'sync' | null>(null);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  // Load last session data from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('last_completed_session');
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionData(JSON.parse(stored));
      } else {
        // High quality fallback mock data
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionData({
          title: 'training High-Press Transition',
          date: new Date().toLocaleDateString('en-GB'),
          durationMinutes: 75,
          totalDistanceMeters: 51200,
          intensityScore: 82,
          type: 'training',
          drills: [
            { drillName: 'Dynamic Warmup & Positionings', durationMinutes: 20, targetDistanceMeters: 1500, targetMaxSpeedMps: 6.5 },
            { drillName: 'High-Velocity Pressure Blocks', durationMinutes: 25, targetDistanceMeters: 2800, targetMaxSpeedMps: 9.0 },
            { drillName: 'Large-Sided Positional Rondo', durationMinutes: 30, targetDistanceMeters: 3100, targetMaxSpeedMps: 8.5 }
          ],
          athleteMetrics: [
            { athleteName: 'Marcus Vane', distanceMeters: 6900, maxSpeedMps: 8.8, sprintCount: 15, workloadIndex: 88, acwr: 1.15 },
            { athleteName: 'Lucas Sterling', distanceMeters: 8100, maxSpeedMps: 7.8, sprintCount: 9, workloadIndex: 94, acwr: 1.62 },
            { athleteName: 'Trent Alexander', distanceMeters: 6100, maxSpeedMps: 8.2, sprintCount: 12, workloadIndex: 72, acwr: 0.98 },
            { athleteName: 'Declan Rice', distanceMeters: 9200, maxSpeedMps: 7.9, sprintCount: 16, workloadIndex: 90, acwr: 1.20 }
          ]
        });
      }
    }
  }, []);

  // Targets vs Achievement comparison array for Radar chart (normalized scores 0-100)
  const radarComparisonData = [
    { metric: 'Avg Distance', Target: 80, Achievement: 86 },
    { metric: 'Peak Velocity', Target: 85, Achievement: 92 },
    { metric: 'Sprint Count', Target: 75, Achievement: 80 },
    { metric: 'Workload Index', Target: 70, Achievement: 84 },
    { metric: 'ACWR Index', Target: 90, Achievement: 78 }
  ];

  const handleAction = (type: 'save' | 'export' | 'sync') => {
    setActionType(type);
    setIsProcessing(true);
    setIsSuccess(false);

    // Simulate server transaction spinner
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Auto clear success indicator banner after 4 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setActionType(null);
      }, 4000);
    }, 1800);
  };

  if (!sessionData) {
    return (
      <div className="flex h-screen bg-zinc-100 items-center justify-center">
        <Icons.Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  // Calculate aggregates
  const rosterSize = sessionData.athleteMetrics.length;
  const avgDistance = Math.round(
    sessionData.athleteMetrics.reduce((acc: number, m: any) => acc + m.distanceMeters, 0) / rosterSize
  );
  const avgMaxSpeed = parseFloat(
    (sessionData.athleteMetrics.reduce((acc: number, m: any) => acc + m.maxSpeedMps, 0) / rosterSize).toFixed(1)
  );
  const totalSprints = sessionData.athleteMetrics.reduce((acc: number, m: any) => acc + m.sprintCount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Custom React Alert Banner (glowing banner status replacement) */}
      {isSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-zinc-50 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Icons.CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-950">
                {actionType === 'save' && 'Session Review Saved'}
                {actionType === 'export' && 'PDF Export Compiled'}
                {actionType === 'sync' && 'Cloud Roster Synchronised'}
              </h4>
              <p className="text-[10px] text-zinc-600 leading-normal mt-1">
                {actionType === 'save' && 'Session review saved successfully.'}
                {actionType === 'export' && 'Performance charts, player tables, and notes exported to CSV/PDF.'}
                {actionType === 'sync' && 'Session summary shared with the team demo.'}
              </p>
            </div>
            <button 
              onClick={() => setIsSuccess(false)}
              className="text-zinc-500 hover:text-zinc-700 transition-colors p-1"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay spinner for actions */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl text-center max-w-xs space-y-4 shadow-2xl">
            <Icons.Loader2 className="h-10 w-10 text-brand-blue animate-spin mx-auto" />
            <h4 className="text-xs font-black text-zinc-950">
              {actionType === 'save' && 'Saving session review...'}
              {actionType === 'export' && 'Compiling pdf workbook...'}
              {actionType === 'sync' && 'Preparing team summary...'}
            </h4>
            <p className="text-[10px] text-zinc-500">Saving session review, please stand by...</p>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.ClipboardCheck className="h-4 w-4" />
            <span>Analysis dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Post-Session Review
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Evaluate squad performance indexes against planned targets. Record training reflections.
          </p>
        </div>

        {/* Custom Actions bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('sync')}
            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Icons.RefreshCcw className="h-4 w-4" />
            <span>Sync Data</span>
          </button>

          <button
            onClick={() => handleAction('export')}
            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Icons.Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleAction('save')}
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition-all hover:scale-[1.02] shadow shadow-brand-blue/25 cursor-pointer flex items-center space-x-1.5"
          >
            <Icons.Check className="h-4 w-4" />
            <span>Save reflections</span>
          </button>
        </div>
      </div>

      {/* Main Grid split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Comparison: Targets vs Achievement (Radar Chart) */}
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Icons.Target className="h-5 w-5 text-brand-blue" />
                <h3 className="font-extrabold text-base text-zinc-800">
                  Target Constraints vs Actual Achievement
                </h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold">
                Layered radar index
              </span>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ClientOnly>
                <RechartsResponsiveContainer width="100%" height="100%">
                  <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarComparisonData}>
                  <RechartsPolarGrid stroke="#27272a" />
                  <RechartsPolarAngleAxis 
                    dataKey="metric" 
                    stroke="#71717a" 
                    fontSize={10} 
                    
                  />
                  <RechartsPolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    stroke="#27272a" 
                    fontSize={8} 
                    tick={false}
                  />
                  <RechartsRadar 
                    name="Target Constraints" 
                    dataKey="Target" 
                    stroke="#155EEF" 
                    fill="#155EEF" 
                    fillOpacity={0.15} 
                  />
                  <RechartsRadar 
                    name="Actual Achievement" 
                    dataKey="Achievement" 
                    stroke="#06B6D4" 
                    fill="#06B6D4" 
                    fillOpacity={0.4} 
                  />
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      color: '#f4f4f5',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontSize: '11px'
                    }}
                  />
                  <RechartsLegend 
                    wrapperStyle={{ 
                      fontSize: '10px', 
                      textTransform: 'none', 
                      fontFamily: 'Arial, Helvetica, sans-serif', 
                      paddingTop: '10px' 
                    }} 
                  />
                  </RechartsRadarChart>
                </RechartsResponsiveContainer>
              </ClientOnly>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-300 text-xs text-zinc-500 flex items-center space-x-1.5">
            <Icons.Info className="h-4 w-4 text-zinc-600" />
            <span>Scores normalized out of 100. Squad outperformed target benchmarks on speed and workload outputs.</span>
          </div>
        </div>

        {/* Reflection Notes Card & Training Details */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-200 pb-3">
              <h3 className="font-extrabold text-base text-zinc-800">
                Reflections & Notes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Write training reflections for athletic progression indexes.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600">Training Session Notes</label>
                <textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  rows={6}
                  placeholder="Record squad workload thresholds, drill effectiveness, and session observations..."
                  className="w-full bg-zinc-100 border border-zinc-200 focus:border-brand-blue rounded-xl p-3.5 text-xs text-white focus:outline-none font-semibold resize-none leading-relaxed"
                />
              </div>

              <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 space-y-2">
                <h4 className="text-[10px] font-black text-zinc-600">Quick Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'High Intensity', 
                    'Perfect Pressing', 
                    'Slight Overload', 
                    'Adaptation Zone'
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCoachNotes((prev) => prev + ` [${tag}] `)}
                      className="px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 text-[9px] font-bold text-zinc-700 hover:text-white transition-all cursor-pointer"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-zinc-300">
            <p className="text-[9px] text-zinc-500 leading-normal">
              Notes saved in the dashboard are shared with individual athlete profile history.
            </p>
          </div>
        </div>
      </div>

      {/* Roster Detailed Performance Breakdown */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
        <div className="border-b border-zinc-200 pb-3.5 mb-4">
          <h3 className="font-extrabold text-base text-zinc-800">
            Session Summary Log: {sessionData.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Recorded metrics across all successfully synchronized active player pods.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-100 p-4.5 rounded-xl border border-zinc-300">
            <span className="text-[10px] font-bold text-zinc-500 block">Sync date</span>
            <span className="text-xl font-black text-zinc-950 mt-1 block">{sessionData.date}</span>
          </div>

          <div className="bg-zinc-100 p-4.5 rounded-xl border border-zinc-300">
            <span className="text-[10px] font-bold text-zinc-500 block">Tracked squad avg distance</span>
            <span className="text-xl font-black text-zinc-950 mt-1 block">{avgDistance} meters</span>
          </div>

          <div className="bg-zinc-100 p-4.5 rounded-xl border border-zinc-300">
            <span className="text-[10px] font-bold text-zinc-500 block">Total High-speed sprints</span>
            <span className="text-xl font-black text-amber-500 mt-1 block">{totalSprints} Runs</span>
          </div>

          <div className="bg-zinc-100 p-4.5 rounded-xl border border-zinc-300">
            <span className="text-[10px] font-bold text-zinc-500 block">Average peak velocity</span>
            <span className="text-xl font-black text-zinc-950 mt-1 block">{avgMaxSpeed} m/s</span>
          </div>
        </div>

        {/* Sleek details table of all athletes */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500">
                <th className="pb-3 pl-2">Athlete Name</th>
                <th className="pb-3 text-right">Distance (m)</th>
                <th className="pb-3 text-right">Peak Velocity (m/s)</th>
                <th className="pb-3 text-right">Sprint Count</th>
                <th className="pb-3 text-right">Workload Index</th>
                <th className="pb-3 text-right pr-2">ACWR Quotient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {sessionData.athleteMetrics.map((player: any, idx: number) => {
                const isOptimal = player.acwr >= 0.8 && player.acwr <= 1.3;
                const isHigh = player.acwr > 1.3;
                return (
                  <tr key={idx} className="hover:bg-zinc-100/40 transition-colors">
                    <td className="py-3 pl-2 font-black text-white">{player.athleteName}</td>
                    <td className="py-3 text-right font-semibold text-zinc-800">{player.distanceMeters} m</td>
                    <td className="py-3 text-right font-semibold text-zinc-800">{player.maxSpeedMps} m/s</td>
                    <td className="py-3 text-right font-semibold text-zinc-800">{player.sprintCount}</td>
                    <td className="py-3 text-right font-semibold text-zinc-800">{player.workloadIndex}</td>
                    <td className="py-3 text-right pr-2">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${
                        isOptimal
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isHigh
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {player.acwr.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}





