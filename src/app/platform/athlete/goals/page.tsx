'use client';

import * as React from 'react';
import Link from 'next/link';
import ClientOnly from '@/components/performance/ClientOnly';
import { 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  Zap, 
  Activity,
  Compass,
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
import { DEMO_ATHLETE_ID, getActiveSessionForAthlete, getTargetForAthlete, getTargetProgress, mockGoals, PlannedSessionConfig } from '@/data';

export default function GoalsPage() {
  const [activeConfig, setActiveConfig] = React.useState<PlannedSessionConfig | null>(null);
  const [lastSession, setLastSession] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      setActiveConfig(getActiveSessionForAthlete(DEMO_ATHLETE_ID));
      const last = localStorage.getItem('ssp-last-session');
      setLastSession(last ? JSON.parse(last) : null);
    } catch {
      setActiveConfig(null);
      setLastSession(null);
    }
  }, []);

  const isAssigned = !!(activeConfig && activeConfig.selectedPlayerIds?.includes(DEMO_ATHLETE_ID));
  const activeTarget = getTargetForAthlete(isAssigned ? activeConfig : null, DEMO_ATHLETE_ID);
  const currentDistance = Number(lastSession?.distanceMeters || 0);
  const currentSprints = Number(lastSession?.sprints || 0);
  const currentWorkload = Number(lastSession?.strain || 0);

  // Dynamic Goal data
  const goalsData = [
    {
      id: 'distance',
      label: 'Session Distance',
      current: currentDistance,
      target: activeTarget.distanceMeters,
      unit: 'm',
      pct: getTargetProgress(currentDistance, activeTarget.distanceMeters),
      color: '#10b981',
      icon: Compass
    },
    {
      id: 'sprints',
      label: 'Sprint Efforts',
      current: currentSprints,
      target: activeTarget.sprintCount,
      unit: 'above threshold',
      pct: getTargetProgress(currentSprints, activeTarget.sprintCount),
      color: '#f59e0b', // Amber
      icon: Zap
    },
    {
      id: 'loads',
      label: 'Workload Target',
      current: currentWorkload,
      target: activeTarget.workloadIndex,
      unit: 'index',
      pct: getTargetProgress(currentWorkload, activeTarget.workloadIndex),
      color: '#155EEF', // Performance Blue
      icon: Activity
    },
    ...mockGoals
      .filter((goal) => goal.assignedTo === DEMO_ATHLETE_ID)
      .slice(0, 1)
      .map((goal) => ({
        id: goal.id,
        label: goal.title,
        current: goal.currentValue,
        target: goal.targetValue,
        unit: goal.unit,
        pct: getTargetProgress(goal.currentValue, goal.targetValue),
        color: '#64748b',
        icon: Target,
      }))
  ];

  // Recharts week over week bar chart comparison
  const weeklyTrends = [
    { week: 'W1', sprints: 8, targetSprints: activeTarget.sprintCount, loads: 62, targetLoads: activeTarget.workloadIndex, distance: 5100, targetDist: activeTarget.distanceMeters },
    { week: 'W2', sprints: 11, targetSprints: activeTarget.sprintCount, loads: 70, targetLoads: activeTarget.workloadIndex, distance: 5800, targetDist: activeTarget.distanceMeters },
    { week: 'W3', sprints: 14, targetSprints: activeTarget.sprintCount, loads: 78, targetLoads: activeTarget.workloadIndex, distance: 6400, targetDist: activeTarget.distanceMeters },
    { week: 'W4', sprints: 12, targetSprints: activeTarget.sprintCount, loads: 74, targetLoads: activeTarget.workloadIndex, distance: 6200, targetDist: activeTarget.distanceMeters }
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
            Track coach-set session targets and personal progress indicators.
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
                  ACTIVE TARGET
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
          <ClientOnly>
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
                        <p className="text-amber-400">SPRINT EFFORTS: {data.sprints} / {data.targetSprints}</p>
                        <p className="text-brand-blue">WORKLOAD: {data.loads} / {data.targetLoads}</p>
                        <p className="text-emerald-400">DISTANCE: {data.distance} / {data.targetDist} m</p>
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
              <Bar dataKey="loads" fill="#155EEF" name="Logged Workload" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="targetLoads" fill="#27272a" stroke="#155EEF" strokeWidth={1} name="Load Targets" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}




