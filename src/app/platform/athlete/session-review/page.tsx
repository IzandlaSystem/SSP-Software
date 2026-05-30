'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientOnly from '@/components/performance/ClientOnly';

import { 
  ArrowLeft as ArrowLeftIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  Compass as CompassIcon, 
  Zap as ZapIcon, 
  Activity as ActivityIcon, 
  Sliders as SlidersIcon, 
  Save as SaveIcon, 
  CheckCircle as CheckCircleIcon,
  RefreshCw as RefreshCwIcon,
  Info as InfoIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function PostSessionReviewPage() {
  const router = useRouter();

  // Load session from local storage or use defaults
  const [session, setSession] = React.useState<any>({
    durationSeconds: 2700, // 45m
    distance: '6.20',
    maxSpeed: '8.2',
    sprints: 12,
    strain: '412',
    timestamp: new Date().toISOString()
  });

  // Slider States
  const [workload, setWorkload] = React.useState<number>(8);
  const [trainingloadBalanceScale, setTrainingloadBalanceScale] = React.useState<number>(6);
  const [loadBalance, setloadBalance] = React.useState<number>(5);
  const [availability, setAvailability] = React.useState<number>(4);

  // Sync state
  const [syncing, setSyncing] = React.useState<boolean>(false);
  const [syncStep, setSyncStep] = React.useState<string>('');
  const [success, setSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    const lastSessionStr = localStorage.getItem('ssp-last-session');
    if (lastSessionStr) {
      try {
        setSession(JSON.parse(lastSessionStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Format MM:SS for display
  const formatDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  // Recharts target thresholds comparison data
  // Since units differ, we normalize to target percentage (100 = target)
  const chartData = [
    {
      metric: 'Distance',
      actual: parseFloat(session.distance),
      target: 5.5, // Coach set 5.5km
      unit: 'km'
    },
    {
      metric: 'Peak Velocity',
      actual: parseFloat(session.maxSpeed),
      target: 8.0, // Coach set 8.0 m/s
      unit: 'm/s'
    },
    {
      metric: 'Sprint Reps',
      actual: session.sprints,
      target: 15, // Coach set 15 sprints
      unit: 'reps'
    }
  ];

  // Save session preparation + Sync Metrics flow
  const handleSaveAndSync = () => {
    setSyncing(true);
    setSyncStep('Preparing session summary...');
    
    // Simulate step 1
    setTimeout(() => {
      setSyncStep('Syncing session summary...');
      
      // Simulate step 2
      setTimeout(() => {
        setSyncStep('Preparing session metrics...');
        
        // Simulate step 3
        setTimeout(() => {
          setSyncStep('Saving post-session readiness summary...');
          
          // Successful save
          setTimeout(() => {
            setSyncing(false);
            setSuccess(true);
            
            // Push to historical logs array in localStorage
            const newLog = {
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              type: 'Pitch Conditioning',
              distance: `${session.distance} km`,
              maxSpeed: `${session.maxSpeed} m/s`,
              sprints: session.sprints,
              strain: session.strain,
              readinessScore: Math.round(((11 - trainingloadBalanceScale) + workload + (11 - loadBalance) + (11 - availability)) * 2.5), // Readiness Score out of 100
              intensity: session.sprints > 10 ? 'High' : 'Medium'
            };
            
            try {
              const prevLogsStr = localStorage.getItem('ssp-historical-logs');
              const prevLogs = prevLogsStr ? JSON.parse(prevLogsStr) : [];
              localStorage.setItem('ssp-historical-logs', JSON.stringify([newLog, ...prevLogs]));
              
              // Clear current active session keys
              localStorage.removeItem('ssp-last-session');
              localStorage.removeItem('ssp-unsynced-session');
            } catch (e) {
              console.error(e);
            }

            // Redirect back to overview or history after brief display
            setTimeout(() => {
              router.push('/platform/athlete/history');
            }, 1500);

          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeftIcon className="h-3 w-3" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Post-Session Review</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Compare session outputs against goals and submit your post-session availability profile.
          </p>
        </div>
      </div>

      {/* Grid: Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] font-bold text-zinc-500 block">Duration Logged</span>
          <span className="text-2xl font-black text-zinc-950">{formatDuration(session.durationSeconds)}</span>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] font-bold text-zinc-500 block">Total Distance</span>
          <span className="text-2xl font-black text-zinc-950">{session.distance} km</span>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] font-bold text-zinc-500 block">High Speed peak</span>
          <span className="text-2xl font-black text-zinc-950">{session.maxSpeed} m/s</span>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] font-bold text-zinc-500 block">Workload Index</span>
          <span className="text-2xl font-black text-zinc-950">{session.strain} ARB</span>
        </div>
      </div>

      {/* Main layout columns: Chart and Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recharts Target vs Actual Comparison */}
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-6">
          <div className="border-b border-zinc-300 pb-3 flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-zinc-800 flex items-center space-x-2">
              <ActivityIcon className="h-4.5 w-4.5 text-brand-blue" />
              <span>Target Achievement Thresholds</span>
            </h3>
            <span className="text-[9px] font-bold text-zinc-500">Coach Dan Profile targets</span>
          </div>

          <div className="h-72 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="metric" 
                  stroke="#a1a1aa" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => String(val)} 
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(39, 39, 42, 0.3)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-xl shadow-2xl text-[10px] space-y-1">
                          <p className="font-extrabold text-zinc-950">{data.metric}</p>
                          <p className="text-emerald-400">ACTUAL: {data.actual} {data.unit}</p>
                          <p className="text-brand-cyan">TARGET: {data.target} {data.unit}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px', textTransform: 'none' }} 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                />
                <Bar dataKey="actual" fill="#3b82f6" name="Logged Actuals" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Bar dataKey="target" fill="#27272a" stroke="#155EEF" strokeWidth={1} name="Coach Targets" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        {/* Right Column: Subjective Questionnaire Sliders */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-300 pb-3">
              <h3 className="font-extrabold text-sm text-zinc-800 flex items-center space-x-2">
                <SlidersIcon className="h-4.5 w-4.5 text-brand-blue" />
                <span>session preparation</span>
              </h3>
            </div>
            
            <p className="text-[10px] text-zinc-600 font-semibold leading-relaxed">
              Submit a quick post-session check-in to complete your review.
            </p>

            <div className="space-y-4 pt-2">
              {/* workload slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-350">workload status</span>
                  <span className="text-zinc-950">{workload}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={workload} 
                  onChange={(e) => setWorkload(parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-zinc-100 rounded-lg h-2 border border-zinc-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-zinc-500">
                  <span>Poor</span>
                  <span>Restful</span>
                </div>
              </div>

              {/* Training Load Balance slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-350">Training Load Balance</span>
                  <span className="text-zinc-950">{trainingloadBalanceScale}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={trainingloadBalanceScale} 
                  onChange={(e) => setTrainingloadBalanceScale(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-zinc-100 rounded-lg h-2 border border-zinc-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-zinc-500">
                  <span>Optimal</span>
                  <span>Imbalanced</span>
                </div>
              </div>

              {/* load balance slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-350">Session Readiness</span>
                  <span className="text-zinc-950">{loadBalance}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={loadBalance} 
                  onChange={(e) => setloadBalance(parseInt(e.target.value))}
                  className="w-full accent-red-500 bg-zinc-100 rounded-lg h-2 border border-zinc-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-zinc-500">
                  <span>Standard</span>
                  <span>High Readiness</span>
                </div>
              </div>

              {/* availability slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-350">availability status</span>
                  <span className="text-zinc-950">{availability}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={availability} 
                  onChange={(e) => setAvailability(parseInt(e.target.value))}
                  className="w-full accent-purple-500 bg-zinc-100 rounded-lg h-2 border border-zinc-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-zinc-500">
                  <span>Calm</span>
                  <span>High Tension</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync action button */}
          <div className="pt-6 border-t border-zinc-300 space-y-3">
            {syncing ? (
              <div className="bg-zinc-100 border border-zinc-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <RefreshCwIcon className="h-4 w-4 text-amber-500 animate-spin" />
                  <span className="text-[10px] font-bold text-zinc-700">SYNCING SESSION SUMMARY</span>
                </div>
                <p className="text-[9px] text-zinc-600">{syncStep}</p>
                <div className="h-1 bg-zinc-50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 animate-pulse w-2/3" />
                </div>
              </div>
            ) : success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center space-x-3 text-emerald-400">
                <CheckCircleIcon className="h-5 w-5 animate-bounce" />
                <div>
                  <h4 className="text-xs font-black">Session synced</h4>
                  <p className="text-[9px] text-emerald-500 mt-0.5">Summary added to coach view</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSaveAndSync}
                className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue/90 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-brand-blue/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <SaveIcon className="h-4.5 w-4.5" />
                <span>SAVE & SYNC WORKOUT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





