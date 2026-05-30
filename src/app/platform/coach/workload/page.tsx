'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
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

// Helper to generate rolling acute vs chronic workload points over 7 sessions
const getRollingWorkloadData = (acwr: number) => {
  const points = [];
  const baseChronic = 6200; // Chronic base workload (m)
  
  for (let i = 6; i >= 0; i--) {
    const sessionNum = 7 - i;
    // Walk the acute load relative to chronic to match acwr
    const acuteWiggle = Math.sin(i * 1.2) * 500;
    const sessionChronic = baseChronic + (Math.cos(i * 0.8) * 150);
    // Final acute value matches the target ACWR ratio at session 7
    let sessionAcute = sessionChronic * acwr;
    if (i > 0) {
      sessionAcute = sessionChronic * (acwr + (Math.sin(i) * 0.15));
    }

    points.push({
      session: `S-${sessionNum}`,
      'Acute (7d)': Math.round(sessionAcute),
      'Chronic (28d)': Math.round(sessionChronic)
    });
  }
  return points;
};

export default function WorkloadPage() {
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string>('1');

  const selectedPlayer = React.useMemo(() => {
    return mockPlayers.find((p) => p.id === selectedPlayerId) || mockPlayers[0];
  }, [selectedPlayerId]);

  const chartData = React.useMemo(() => {
    return getRollingWorkloadData(selectedPlayer.acwr);
  }, [selectedPlayer.acwr]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.Gauge className="h-4 w-4" />
            <span>Workload Strain dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Acute : Chronic Workload Index
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Model workload load indices. Balance acute workload loops (7-day rolling) against fitness chronic baselines (28-day rolling).
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Player Selector & Workload Detail Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar Roster Selector with micro ACWR indicators */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-zinc-200 pb-3">
            <h3 className="font-extrabold text-sm text-zinc-800">
              Roster ACWR Status
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Select player to load advanced rolling strain charts.</p>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {mockPlayers.map((player) => {
              const isSelected = player.id === selectedPlayerId;
              const isOptimal = player.acwr >= 0.8 && player.acwr <= 1.3;
              const isHigh = player.acwr > 1.3;

              return (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-blue/10 border-brand-blue text-white shadow shadow-red-500/5'
                      : 'bg-zinc-100 border-zinc-300 hover:border-zinc-750 text-zinc-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-black text-xs transition-all ${
                      isSelected ? 'bg-brand-blue/20 text-brand-blue border-brand-blue/35' : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                    }`}>
                      {player.squadNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-800">{player.name}</h4>
                      <span className="text-[9px] font-bold text-zinc-500">{player.position}</span>
                    </div>
                  </div>
                  
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    isOptimal
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isHigh
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {player.acwr.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rolling Load Chart and Stats Card */}
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-3.5 mb-5 gap-3">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-extrabold text-xs text-brand-blue">
                  #{selectedPlayer.squadNumber}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-800">
                    {selectedPlayer.name} Strain Profile
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Rolling Acute (7d) vs Chronic (28d) workload loads.</p>
                </div>
              </div>

              {/* Status Quotient */}
              <div className="text-right self-start sm:self-center">
                <span className="text-[10px] font-bold text-zinc-500 block">ACWR Status Quotient</span>
                <span className={`text-lg font-black border px-2.5 py-0.5 rounded inline-block mt-1 ${
                  selectedPlayer.acwr >= 0.8 && selectedPlayer.acwr <= 1.3
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : selectedPlayer.acwr > 1.3
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {selectedPlayer.acwr.toFixed(2)} (
                  {selectedPlayer.acwr >= 0.8 && selectedPlayer.acwr <= 1.3 ? 'Optimal' : selectedPlayer.acwr > 1.3 ? 'High Load' : 'Caution Underload'}
                  )
                </span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <ClientOnly>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAcute" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorChronic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="session" 
                    stroke="#71717a" 
                    fontSize={10} 
                    
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={10} 
                    
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      color: '#f4f4f5',
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'none', fontFamily: 'Arial, Helvetica, sans-serif', paddingTop: '10px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="Acute (7d)" 
                    stroke="#ef4444" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorAcute)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Chronic (28d)" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorChronic)" 
                  />
                  </AreaChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-300 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500">
            <div className="flex items-start space-x-2">
              <Icons.ShieldAlert className="h-4.5 w-4.5 text-zinc-600 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-extrabold text-zinc-700">Acute Strain:</span> rolling 7-day average: {Math.round(chartData[6]['Acute (7d)'])} meters. Represents current short-term workload levels.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Icons.TrendingUp className="h-4.5 w-4.5 text-zinc-600 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-extrabold text-zinc-700">Chronic strain:</span> rolling 28-day average: {Math.round(chartData[6]['Chronic (28d)'])} meters. Represents chronic baseline fitness.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}




