'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend
} from 'recharts';
import { mockPlayers } from '@/data';

export default function AnalyticsPage() {
  const [metricX, setMetricX] = React.useState<'workload' | 'distance' | 'maxSpeed'>('workload');
  const [metricY, setMetricY] = React.useState<'sprintCount' | 'workload' | 'distance'>('sprintCount');

  // Map players data to scatter plot format
  const scatterData = React.useMemo(() => {
    return mockPlayers.map((player) => ({
      name: player.name,
      x: player[metricX],
      y: player[metricY as 'sprintCount' | 'workload' | 'distance'],
      position: player.position,
      squadNumber: player.squadNumber
    }));
  }, [metricX, metricY]);

  const getMetricLabel = (m: string) => {
    switch (m) {
      case 'workload': return 'workload Workload Index';
      case 'distance': return 'Total Distance (m)';
      case 'maxSpeed': return 'Peak Velocity (m/s)';
      case 'sprintCount': return 'Sprint Repetitions';
      default: return m;
    }
  };

  // Color mapping based on positions
  const getPositionColor = (pos: string) => {
    switch (pos) {
      case 'Forward': return '#06B6D4'; // Cyan
      case 'Midfielder': return '#155EEF'; // Performance Blue
      case 'Defender': return '#64748B'; // Slate
      case 'Goalkeeper': return '#93C5FD'; // Ice Blue
      default: return '#cbd5e1';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.BarChart3 className="h-4 w-4" />
            <span>Performance workloads</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Roster Advanced Analytics
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Analyze workload correlations. Cross-reference sprint volume, running volumes, and strain parameters.
          </p>
        </div>
      </div>

      {/* Axis Controls Toolbar */}
      <div className="bg-zinc-50 border border-zinc-300 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* X Axis selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 block">Correlation Dimension (X-Axis)</label>
            <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              {(['workload', 'distance', 'maxSpeed'] as const).map((xVal) => (
                <button
                  key={xVal}
                  onClick={() => setMetricX(xVal)}
                  className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    metricX === xVal ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-800'
                  }`}
                >
                  {xVal === 'workload' ? 'Workload' : xVal === 'distance' ? 'Distance' : 'Max Speed'}
                </button>
              ))}
            </div>
          </div>

          {/* Y Axis selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 block">Impact Metric (Y-Axis)</label>
            <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              {(['sprintCount', 'workload', 'distance'] as const)
                .filter((yVal) => yVal !== metricX) // Avoid plotting x vs x
                .map((yVal) => (
                  <button
                    key={yVal}
                    onClick={() => setMetricY(yVal)}
                    className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      metricY === yVal ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-800'
                    }`}
                  >
                    {yVal === 'sprintCount' ? 'Sprints' : yVal === 'workload' ? 'Workload' : 'Distance'}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Legend representation */}
        <div className="flex items-center gap-3 bg-zinc-100 px-4 py-2.5 rounded-xl border border-zinc-300 self-start md:self-center">
          <span className="text-[9px] font-bold text-zinc-500 mr-2">Positional Colors:</span>
          <div className="flex flex-wrap gap-3 text-[10px] font-bold">
            <span className="flex items-center space-x-1 text-brand-cyan"><span className="h-2 w-2 rounded-full bg-brand-blue" /> <span>FWD</span></span>
            <span className="flex items-center space-x-1 text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-500" /> <span>MID</span></span>
            <span className="flex items-center space-x-1 text-blue-400"><span className="h-2 w-2 rounded-full bg-blue-500" /> <span>DEF</span></span>
            <span className="flex items-center space-x-1 text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-500" /> <span>GK</span></span>
          </div>
        </div>
      </div>

      {/* Main Scatter plot card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
        <div className="border-b border-zinc-200 pb-3 mb-5 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-zinc-800">
            Workload Correlation Scatter (Roster Mapping)
          </h3>
          <span className="text-[10px] text-zinc-500 font-bold">
            Performance plot
          </span>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={getMetricLabel(metricX)} 
                stroke="#71717a" 
                fontSize={10} 
                
                tickLine={false} 
                label={{ value: getMetricLabel(metricX), fill: '#71717a', fontSize: 10, fontFamily: 'Arial, Helvetica, sans-serif', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={getMetricLabel(metricY)} 
                stroke="#71717a" 
                fontSize={10} 
                
                tickLine={false}
                axisLine={false}
                label={{ value: getMetricLabel(metricY), fill: '#71717a', angle: -90, fontSize: 10, fontFamily: 'Arial, Helvetica, sans-serif', position: 'left', offset: 0 }}
              />
              <ZAxis type="number" range={[100, 100]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#e4e4e7' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-3 shadow-2xl text-[10px] text-zinc-700 space-y-1">
                        <p className="font-black text-zinc-950 text-xs">{data.name} (#{data.squadNumber})</p>
                        <p className="text-zinc-500">{data.position}</p>
                        <div className="pt-2 border-t border-zinc-900 mt-2 space-y-1">
                          <p>{getMetricLabel(metricX)}: <span className="font-black text-zinc-950">{data.x}</span></p>
                          <p>{getMetricLabel(metricY)}: <span className="font-black text-zinc-950">{data.y}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Players" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getPositionColor(entry.position)} 
                    stroke="#18181b" 
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-300 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500">
          <div className="flex items-start space-x-2">
            <Icons.Info className="h-4.5 w-4.5 text-zinc-600 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-extrabold text-zinc-700">Workload Interpretation:</span> Players grouped in the upper-right quadrant demonstrate exceptional high-velocity capacities coupled with heavy workload strain tolerances.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Icons.Compass className="h-4.5 w-4.5 text-zinc-600 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-extrabold text-zinc-700">Bilateral Balances:</span> Goalkeeper positions correctly cluster at minimal velocity/running ranges. Midfielder groups demonstrate deep running volumes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}




