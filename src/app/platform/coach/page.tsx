'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/performance/ClientOnly';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { mockPlayers, Player } from '@/data';

// Custom data for Squad Workload Trend (Daily workload load index vs Subjective Intensity)
const workloadTrend = [
  { day: 'Mon (05/18)', load: 420, intensity: 4.5 },
  { day: 'Tue (05/19)', load: 680, intensity: 7.2 },
  { day: 'Wed (05/20)', load: 880, intensity: 8.5 },
  { day: 'Thu (05/21)', load: 310, intensity: 3.8 },
  { day: 'Fri (05/22)', load: 450, intensity: 5.0 },
  { day: 'Sat (05/23)', load: 950, intensity: 9.0 },
  { day: 'Sun (05/24)', load: 150, intensity: 2.0 },
  { day: 'Mon (05/25)', load: 820, intensity: 8.2 },
];

export default function CoachOverviewPage() {
  const [selectedMetric, setSelectedMetric] = React.useState<'distance' | 'maxSpeed' | 'workload' | 'acwr'>('distance');
  const [sessionActive, setSessionActive] = React.useState<boolean>(false);

  // Compute stats
  const totalRoster = mockPlayers.length;
  const avgACWR = parseFloat(
    (mockPlayers.reduce((acc, curr) => acc + curr.acwr, 0) / totalRoster).toFixed(2)
  );
  const squadavailabilityAvg = 84; // 84% average availability from requirements

  // Filters out high risk ACWR players (> 1.3)
  const alertPlayers = mockPlayers.filter((p) => p.acwr >= 1.3);

  const getMetricLabel = (m: string) => {
    switch (m) {
      case 'distance': return 'Distance (m)';
      case 'maxSpeed': return 'Max Speed (m/s)';
      case 'workload': return 'Workload Index';
      case 'acwr': return 'ACWR';
      default: return '';
    }
  };

  const getMetricValue = (player: Player, m: 'distance' | 'maxSpeed' | 'workload' | 'acwr') => {
    if (m === 'distance') return `${player.distance} m`;
    if (m === 'maxSpeed') return `${player.maxSpeed} m/s`;
    if (m === 'workload') return `${player.workload}`;
    if (m === 'acwr') return player.acwr.toFixed(2);
    return '';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs mb-1">
            <Icons.Layers className="h-4 w-4 text-brand-blue" />
            <span>SSP Coach Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            Performance Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time sessional workloads, player metrics, and acute:chronic training ratios.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 px-3 py-1.5">
              Live Feed
            </span>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center space-x-1.5 transition-all ${
              sessionActive 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                : 'bg-zinc-200 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
            }`}>
              <span className={`h-2 w-2 rounded-full inline-block ${sessionActive ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-zinc-400 dark:bg-zinc-600'}`}></span>
              <span className=" text-[10px] font-bold">{sessionActive ? 'ACTIVE' : 'IDLE / READY'}</span>
            </div>
          </div>

          <button
            onClick={() => setSessionActive(!sessionActive)}
            className="px-4 py-2 text-xs bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            {sessionActive ? 'STANDBY Tracking' : 'Wake Tracking Device'}
          </button>
        </div>
      </div>

      {/* Squad Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.Users className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Total Active Roster</p>
          <p className="text-3xl font-black text-zinc-950 dark:text-white mt-2">{totalRoster}</p>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/5 px-2 py-0.5 rounded w-fit border border-emerald-200 dark:border-emerald-500/10">
            <Icons.CheckCircle className="h-3 w-3" />
            <span>All Devices Paired</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.Activity className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Avg Squad ACWR</p>
          <p className="text-3xl font-black text-zinc-950 dark:text-white mt-2">{avgACWR}</p>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/5 px-2 py-0.5 rounded w-fit border border-amber-200 dark:border-amber-500/10">
            <Icons.AlertTriangle className="h-3 w-3" />
            <span>Optimal Zone (0.8 - 1.3)</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.TrendingUp className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Squad Availability Avg</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{squadavailabilityAvg}%</p>
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/5 px-2 py-0.5 rounded w-fit border border-emerald-200 dark:border-emerald-500/10">
            <Icons.TrendingUp className="h-3 w-3" />
            <span>+2.4% vs Last Cycle</span>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icons.Radio className="h-16 w-16 text-zinc-950 dark:text-white" />
          </div>
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Session Status</p>
          <p className="text-3xl font-black text-zinc-950 dark:text-white mt-2">{sessionActive ? 'Active' : 'STANDBY'}</p>
          <div className={`flex items-center space-x-1.5 mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-fit border ${
            sessionActive 
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/10' 
              : 'text-zinc-500 bg-zinc-100 border-zinc-200 dark:text-zinc-500 dark:bg-zinc-800/50 dark:border-zinc-700/50'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${sessionActive ? 'bg-emerald-500 dark:bg-emerald-400 animate-ping' : 'bg-zinc-400 dark:bg-zinc-600'}`}></span>
            <span>{sessionActive ? 'Live Stream Active' : 'System Ready'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Workload Trend Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Workload Trend Chart Card */}
        <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Icons.LineChart className="h-5 w-5 text-brand-blue" />
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                  Squad Workload Trend & Intensity
                </h3>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                Last 8 Sessions
              </span>
            </div>
            
            <div className="h-64 w-full">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workloadTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--zinc-500)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--zinc-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--zinc-200)" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="var(--zinc-550)" 
                    fontSize={10} 
                    tickLine={false} 
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--brand-blue)" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--zinc-600)" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--zinc-100)', 
                      borderColor: 'var(--zinc-200)',
                      borderRadius: '12px',
                      color: 'var(--zinc-950)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: 'var(--zinc-600)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'none', paddingTop: '10px' }} />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="load" 
                    name="workload Load (m)"
                    stroke="var(--brand-blue)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLoad)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="intensity" 
                    name="Subjective Intensity (1-10)"
                    stroke="var(--zinc-500)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorIntensity)" 
                  />
                  </AreaChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center space-x-1">
              <Icons.Info className="h-3.5 w-3.5 text-zinc-400" />
              <span>Sessional training strain comparison.</span>
            </span>
            <div className="flex gap-4">
              <Link 
                href="/platform/coach/analytics" 
                className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
              >
                Deep Analytics &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ACWR Alerts Panel */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Icons.AlertOctagon className="h-5 w-5 text-rose-500" />
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                  Workload Alerts
                </h3>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200 dark:bg-rose-500/10 dark:text-rose-500 dark:border-rose-500/20">
                {alertPlayers.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {alertPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500/30 p-3.5 rounded-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{player.name}</span>
                      <span className="text-[10px] block text-zinc-500 font-medium">{player.position} • Squad #{player.squadNumber}</span>
                    </div>
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20">
                      ACWR: {player.acwr.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      Status: {player.status}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center space-x-1 border border-amber-200 dark:text-amber-500 dark:bg-amber-500/10 dark:border-amber-500/20">
                      <Icons.ShieldAlert className="h-3 w-3" />
                      <span>Recovery Suggested</span>
                    </span>
                  </div>
                </div>
              ))}
              
              {alertPlayers.length === 0 && (
                <div className="text-center py-8 text-zinc-500 text-xs space-y-2">
                  <Icons.CheckCircle className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p>All players are in optimal workload ACWR zones.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Link 
              href="/platform/coach/workload"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all border border-zinc-350 dark:border-zinc-800 font-bold"
            >
              <Icons.Shield className="h-4 w-4 text-brand-blue" />
              <span>Configure Thresholds</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Roster Performance Metrics Grid */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5 gap-4">
          <div className="flex items-center space-x-2">
            <Icons.Gauge className="h-5 w-5 text-brand-blue" />
            <div>
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                Squad Metrics Dashboard
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Toggle filter keys to evaluate current roster performance.</p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {(['distance', 'maxSpeed', 'workload', 'acwr'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedMetric === m 
                    ? 'bg-brand-blue text-white shadow' 
                    : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {m === 'distance' && 'Distance'}
                {m === 'maxSpeed' && 'Max Speed'}
                {m === 'workload' && 'Workload Index'}
                {m === 'acwr' && 'ACWR'}
              </button>
            ))}
          </div>
        </div>

        {/* Players Grid with dynamic metric view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPlayers.map((player) => {
            const hasAlert = player.acwr >= 1.3;
            return (
              <div 
                key={player.id} 
                className={`bg-zinc-100 dark:bg-zinc-950 rounded-xl p-4 border transition-all ${
                  hasAlert 
                    ? 'border-rose-500/20 hover:border-rose-500/40 shadow-sm shadow-rose-500/5' 
                    : 'border-zinc-200 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center font-bold text-xs text-brand-blue">
                      {player.squadNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{player.name}</h4>
                      <span className="text-[10px] block text-zinc-500 font-bold">{player.position}</span>
                    </div>
                  </div>

                  <span className={`h-2.5 w-2.5 rounded-full ${
                    player.availabilityStatus === 'Optimal' 
                      ? 'bg-emerald-500' 
                      : player.availabilityStatus === 'Adaptive' 
                      ? 'bg-amber-500' 
                      : 'bg-rose-500 animate-pulse'
                  }`} title={`Availability: ${player.availabilityStatus}`} />
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-bold">
                    {getMetricLabel(selectedMetric)}
                  </span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">
                    {getMetricValue(player, selectedMetric)}
                  </span>
                </div>

                <div className="mt-3.5 flex gap-2">
                  <Link 
                    href={`/platform/coach/athlete/${player.id}`}
                    className="w-full py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[10px] font-bold text-zinc-650 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-white transition-all text-center border border-zinc-300 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct CTA Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/platform/coach/new-session"
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-brand-blue/40 p-6 rounded-2xl shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-brand-blue transition-colors">
              New Session
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create sessional plans, player constraints, and active metrics.
            </p>
          </div>
          <div className="bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white p-3 rounded-xl transition-all shadow-md">
            <Icons.PlusCircle className="h-6 w-6" />
          </div>
        </Link>

        <Link 
          href="/platform/coach/live-session"
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/40 p-6 rounded-2xl shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Live Squad Tracking
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              View live sessional active metrics, positioning layouts, and sprint logs.
            </p>
          </div>
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-black p-3 rounded-xl transition-all shadow-md">
            <Icons.Radio className="h-6 w-6" />
          </div>
        </Link>
      </div>

    </div>
  );
}



