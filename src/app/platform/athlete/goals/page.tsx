'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  Zap, 
  Award, 
  Activity,
  Compass,
  CheckCircle,
  Plus
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

export default function GoalsPage() {

  // Dynamic Goal data
  const goalsData = [
    {
      id: 'sprints',
      label: 'Sprint Targets',
      current: 12,
      target: 15,
      unit: 'sprints',
      pct: 80,
      color: '#f59e0b', // Amber
      icon: Zap
    },
    {
      id: 'loads',
      label: 'Total Session Loads',
      current: 412,
      target: 500,
      unit: 'ARB strain',
      pct: 82,
      color: '#155EEF', // Performance Blue
      icon: Activity
    },
    {
      id: 'distance',
      label: 'High-Intensity Dist.',
      current: 2.8,
      target: 4.0,
      unit: 'km in zone 3+',
      pct: 70,
      color: '#10b981', // Emerald
      icon: Compass
    }
  ];

  // Recharts week over week bar chart comparison
  const weeklyTrends = [
    { week: 'W1', sprints: 8, targetSprints: 15, loads: 320, targetLoads: 500, distance: 2.1, targetDist: 4.0 },
    { week: 'W2', sprints: 11, targetSprints: 15, loads: 410, targetLoads: 500, distance: 2.9, targetDist: 4.0 },
    { week: 'W3', sprints: 14, targetSprints: 15, loads: 480, targetLoads: 500, distance: 3.5, targetDist: 4.0 },
    { week: 'W4', sprints: 12, targetSprints: 15, loads: 412, targetLoads: 500, distance: 2.8, targetDist: 4.0 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Overview</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Milestones & Targets</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Track and configure sessional goals. Monitor progress rings and week-over-week performance thresholds.
          </p>
        </div>

        {/* Add goal button */}
        <button
          onClick={() => alert('New target threshold configurations require coach authorization.')}
          className="shrink-0 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-brand-blue/20 flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>PROPOSE NEW TARGET</span>
        </button>
      </div>

      {/* SVG Progress Rings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goalsData.map((goal) => {
          const Icon = goal.icon;
          const radius = 50;
          const stroke = 6;
          const normalizedRadius = radius - stroke * 2;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (goal.pct / 100) * circumference;

          return (
            <div 
              key={goal.id} 
              className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[280px] shadow-lg relative overflow-hidden group hover:border-zinc-300 transition-all"
            >
              {/* Background gradient flare */}
              <div 
                className="absolute inset-0 opacity-5 bg-radial from-transparent pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, ${goal.color} 0%, transparent 70%)` }}
              />

              <div className="w-full flex items-center justify-between z-10 border-b border-zinc-300 pb-3">
                <span className="text-[10px] font-black text-zinc-450">
                  {goal.label}
                </span>
                <Icon className="h-4 w-4" style={{ color: goal.color }} />
              </div>

              {/* Progress Ring Graphic */}
              <div className="relative my-4 flex items-center justify-center z-10">
                <svg
                  height={radius * 2}
                  width={radius * 2}
                  className="transform -rotate-90"
                >
                  {/* Track circle */}
                  <circle
                    stroke="#18181b"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  {/* Progress circle */}
                  <circle
                    stroke={goal.color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="transition-all duration-700 ease-in-out"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center">
                  <span className="text-xl font-black text-zinc-950 block">
                    {goal.pct}%
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 block">
                    COMPLETED
                  </span>
                </div>
              </div>

              {/* Stats detail footer */}
              <div className="w-full text-center z-10 pt-3 border-t border-zinc-300">
                <p className="text-sm font-black text-zinc-950">
                  {goal.current} <span className="text-zinc-500 font-normal text-xs">/ {goal.target} {goal.unit}</span>
                </p>
                <p className="text-[8px] font-bold text-zinc-500 mt-0.5">
                  WEEKLY TARGET BENCHMARK
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Over Week Comparative Charts */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="border-b border-zinc-300 pb-3 flex justify-between items-center">
          <h3 className="font-extrabold text-sm text-zinc-800 flex items-center space-x-2">
            <TrendingUp className="h-4.5 w-4.5 text-brand-blue" />
            <span>Weekly Sessional Load Trends</span>
          </h3>
          <span className="text-[9px] font-bold text-zinc-500">Comparison vs targets (May 2026)</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyTrends}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="week" 
                stroke="#a1a1aa" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
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
                      <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-xl shadow-2xl text-[10px] space-y-1.5">
                        <p className="font-extrabold text-zinc-950">WEEK {data.week}</p>
                        <p className="text-amber-400">SPRINTS: {data.sprints} / {data.targetSprints} reps</p>
                        <p className="text-brand-blue">LOAD STRAIN: {data.loads} / {data.targetLoads} ARB</p>
                        <p className="text-emerald-400">DIST. IN ZONE: {data.distance} / {data.targetDist} km</p>
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
              <Bar dataKey="loads" fill="#155EEF" name="Logged Load Strain" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="targetLoads" fill="#27272a" stroke="#155EEF" strokeWidth={1} name="Load Targets" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}




