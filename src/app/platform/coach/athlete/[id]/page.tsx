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
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  ReferenceLine
} from 'recharts';
import { mockPlayers, Player } from '@/data';

// Helper to generate dynamic 14-day ACWR trend
const getAcwrTrend = (baseAcwr: number) => {
  const trend = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const dateStr = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    // Random walks around base acwr
    const wiggle = (Math.sin(i * 0.8) * 0.15) + ((Math.random() - 0.5) * 0.08);
    trend.push({
      date: dateStr,
      ACWR: parseFloat((baseAcwr + wiggle).toFixed(2)),
      highLimit: 1.3,
      lowLimit: 0.8
    });
  }
  return trend;
};

// Helper to generate 7-day work profile
const getWeeklyWorkload = (position: string) => {
  const isForward = position === 'Forward';
  const isMid = position === 'Midfielder';
  const isGK = position === 'Goalkeeper';

  const baseDist = isGK ? 2000 : isMid ? 8500 : isForward ? 7000 : 5500;
  const baseSpeed = isGK ? 5.8 : isForward ? 8.8 : isMid ? 8.0 : 8.2;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, idx) => {
    const distWiggle = Math.round((Math.sin(idx) * 0.15 + (Math.random() * 0.1)) * baseDist);
    const speedWiggle = parseFloat(((Math.cos(idx) * 0.08 + (Math.random() * 0.05)) * baseSpeed).toFixed(1));
    return {
      day,
      Distance: baseDist + distWiggle,
      'Peak Velocity': Math.min(10.2, baseSpeed + speedWiggle)
    };
  });
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AthleteDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  
  // Find athlete or fallback to Marcus Vane (id: '1')
  const player = mockPlayers.find((p) => p.id === id) || mockPlayers[0];

  // Notes state
  const [newNote, setNewNote] = React.useState<string>('');
  const [notesHistory, setNotesHistory] = React.useState<string[]>([
    'Demonstrated excellent explosive speed in training transition loops. Max speed achieved near peak limit.',
    'Bilateral workload is monitored. Monitor compliance with sessional sprint targets.',
    'Monitor trend: ACWR is creeping above baseline indicators. Suggest training load review for tomorrow\'s sessions. Not a medical assessment.'
  ]);

  // Handle adding notes
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setNotesHistory([newNote.trim(), ...notesHistory]);
      setNewNote('');
    }
  };

  const acwrTrendData = React.useMemo(() => getAcwrTrend(player.acwr), [player.acwr]);
  const weeklyWorkloadData = React.useMemo(() => getWeeklyWorkload(player.position), [player.position]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header Nav */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center font-black text-2xl text-brand-blue shadow-md">
            #{player.squadNumber}
          </div>
          <div>
            <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-0.5">
              <Icons.UserCheck className="h-4 w-4" />
              <span>Athlete Performance Profile</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950">
              {player.name}
            </h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              Squad Number #{player.squadNumber} • Position: {player.position}
            </p>
          </div>
        </div>

        <Link 
          href="/platform/coach/squad" 
          className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-zinc-50 hover:bg-zinc-800 text-zinc-700 border border-zinc-200 transition-all cursor-pointer"
        >
          &larr; Back to Squad Roster
        </Link>
      </div>

      {/* Main Profile Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Core Performance Summaries */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-extrabold text-xs text-zinc-600 border-b border-zinc-300 pb-2">
            Performance Summary
          </h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">14d Distance</span>
              <span className="text-xl font-black text-zinc-955">{(player.distance * 2.4).toLocaleString(undefined, {maximumFractionDigits:0})} m</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">Max Speed limit</span>
              <span className="text-xl font-black text-zinc-955">{player.maxSpeed.toFixed(1)} m/s</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">Sprints Indexed</span>
              <span className="text-xl font-black text-amber-500">{player.sprintCount} Runs</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">Current Load Status</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border mt-1.5 ${
                player.status === 'Ready'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : player.status === 'Recovery'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
              }`}>
                {player.status}
              </span>
            </div>
          </div>
        </div>

        {/* session preparation Scores */}
        <div className="md:col-span-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-300 pb-2">
            <h3 className="font-extrabold text-xs text-zinc-600">
              session preparation Indicators
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
              Average: 86%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* workload status */}
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 block">workload status</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-zinc-955">90%</span>
                <span className="text-[9px] text-emerald-400">Excellent</span>
              </div>
              <div className="w-full bg-zinc-50 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[90%]" />
              </div>
            </div>

            {/* Load Balance */}
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 block">load balance</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-zinc-955">82%</span>
                <span className="text-[9px] text-emerald-400">Minimal</span>
              </div>
              <div className="w-full bg-zinc-50 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[82%]" />
              </div>
            </div>

            {/* availability */}
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 block">availability status</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-zinc-955">88%</span>
                <span className="text-[9px] text-emerald-400">Decompressed</span>
              </div>
              <div className="w-full bg-zinc-50 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[88%]" />
              </div>
            </div>

            {/* Energy Levels */}
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 block">Energy Levels</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-zinc-955">84%</span>
                <span className="text-[9px] text-emerald-400">Optimal</span>
              </div>
              <div className="w-full bg-zinc-50 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[84%]" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Visual Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Workload Bar Chart */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-zinc-200 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.BarChart3 className="h-5 w-5 text-brand-blue" />
              <h3 className="font-extrabold text-base text-zinc-800">
                7-Day Workload & Velocity Profile
              </h3>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold">
              Distance vs Peak speed
            </span>
          </div>

          <div className="h-64 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#71717a" 
                  fontSize={10} 
                  
                  tickLine={false} 
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#155EEF" 
                  fontSize={10} 
                  
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#06B6D4" 
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
                <Bar 
                  yAxisId="left" 
                  dataKey="Distance" 
                  name="Meters Ran"
                  fill="#155EEF" 
                  radius={[4, 4, 0, 0]} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="Peak Velocity" 
                  name="Peak Speed (m/s)"
                  stroke="#06B6D4" 
                  strokeWidth={2.5} 
                  dot={{ r: 3 }} 
                />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        {/* 14-Day ACWR Rolling Index Chart */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-zinc-200 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.TrendingUp className="h-5 w-5 text-brand-blue" />
              <h3 className="font-extrabold text-base text-zinc-800">
                14-Day Rolling ACWR Index
              </h3>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold">
              ACWR Review Indicator
            </span>
          </div>

          <div className="h-64 w-full">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acwrTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={10} 
                  
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  
                  tickLine={false}
                  axisLine={false}
                  domain={[0.4, 2.0]}
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
                
                {/* Horizontal reference lines for monitoring review prompts */}
                <ReferenceLine y={1.3} label={{ value: 'MONITOR TREND FLAG (1.3)', fill: '#f59e0b', fontSize: 8, fontFamily: 'Arial, Helvetica, sans-serif', position: 'top' }} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={0.8} label={{ value: 'BASELINE LIMIT (0.8)', fill: '#3b82f6', fontSize: 8, fontFamily: 'Arial, Helvetica, sans-serif', position: 'bottom' }} stroke="#3b82f6" strokeDasharray="3 3" />
                
                <Line 
                  type="monotone" 
                  dataKey="ACWR" 
                  name="ACWR Review Indicator"
                  stroke="#155EEF" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                </LineChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

      </div>

      {/* Coaching Reflections & Historical Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Save notes form */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-zinc-200 pb-3 mb-4">
            <h3 className="font-extrabold text-base text-zinc-800">
              Log Coach Note
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Append new physical observations or threshold updates.</p>
          </div>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-600">Observations</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={5}
                placeholder="Log running form, caution status, or recovery updates..."
                className="w-full bg-zinc-100 border border-zinc-200 focus:border-brand-blue rounded-xl p-3.5 text-xs text-white focus:outline-none font-semibold resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer"
            >
              Commit Note
            </button>
          </form>
        </div>

        {/* Historical Log list */}
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-zinc-200 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-zinc-800">
              Observations History
            </h3>
            <span className="text-[10px] text-zinc-500 font-bold">
              {notesHistory.length} Comments logged
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {notesHistory.map((note, idx) => (
              <div key={idx} className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 space-y-2">
                <div className="flex justify-between items-center text-[9px] text-zinc-500">
                  <span className="font-extrabold text-brand-blue">Coach Administration</span>
                  <span>Logged {idx === 0 ? 'Just now' : idx === 1 ? '2 days ago' : '4 days ago'}</span>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-semibold">{note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}



