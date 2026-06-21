'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import { mockPlayers, Player } from '@/data';

// Helper to calculate average of a numeric property in a cohort
const getCohortAvg = (cohort: Player[], key: keyof Player) => {
  if (cohort.length === 0) return 0;
  return cohort.reduce((acc, p) => acc + (p[key] as number), 0) / cohort.length;
};

// Helper to calculate standard deviation of a numeric property in a cohort
const getCohortSD = (cohort: Player[], key: keyof Player, avg: number) => {
  if (cohort.length <= 1) return 1; // Avoid divide by 0/trivial SD
  const variance = cohort.reduce((acc, p) => acc + Math.pow((p[key] as number) - avg, 2), 0) / cohort.length;
  return Math.sqrt(variance) || 1;
};

export default function BenchmarkingPage() {
  const [activeTab, setActiveTab] = React.useState<'Forward' | 'Midfielder' | 'Defender'>('Forward');

  // Filter cohort
  const cohort = React.useMemo(() => {
    return mockPlayers.filter((p) => p.position === activeTab);
  }, [activeTab]);

  // Cohort statistics
  const stats = React.useMemo(() => {
    const avgDist = getCohortAvg(cohort, 'distance');
    const sdDist = getCohortSD(cohort, 'distance', avgDist);

    const avgSprints = getCohortAvg(cohort, 'sprintCount');
    const sdSprints = getCohortSD(cohort, 'sprintCount', avgSprints);

    const avgSpeed = getCohortAvg(cohort, 'maxSpeed');
    const sdSpeed = getCohortSD(cohort, 'maxSpeed', avgSpeed);

    return {
      dist: { avg: avgDist, sd: sdDist },
      sprints: { avg: avgSprints, sd: sdSprints },
      speed: { avg: avgSpeed, sd: sdSpeed }
    };
  }, [cohort]);

  // Calculate standard deviations score helper
  const getDeviationText = (value: number, avg: number, sd: number) => {
    const dev = (value - avg) / sd;
    const sign = dev >= 0 ? '+' : '';
    return {
      text: `${sign}${dev.toFixed(1)} SD`,
      val: dev
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.GitCompare className="h-4 w-4" />
            <span>Cohort Comparison Suite</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Positional Benchmarking
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Evaluate standard deviation margins. Compare roster performance relative to position cohorts.
          </p>
        </div>
      </div>

      {/* Cohort Selector Tabs */}
      <div className="bg-zinc-50 border border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
          {(['Forward', 'Midfielder', 'Defender'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow' 
                  : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {tab}s ({mockPlayers.filter((p) => p.position === tab).length})
            </button>
          ))}
        </div>

        {/* Informative Label */}
        <span className="text-[10px] text-zinc-500 font-bold flex items-center space-x-1.5 self-start sm:self-center">
          <Icons.Info className="h-4 w-4 text-zinc-600" />
          <span>Deviations computed from standard cohort limits.</span>
        </span>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] font-bold text-zinc-500 block">Cohort Distance Mean</span>
          <span className="text-2xl font-black text-zinc-950 mt-1 block">
            {Math.round(stats.dist.avg).toLocaleString()} m
          </span>
          <span className="text-[9px] text-zinc-500 block mt-1">Standard Dev: Â±{Math.round(stats.dist.sd)}m</span>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] font-bold text-zinc-500 block">Cohort Sprints Mean</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">
            {stats.sprints.avg.toFixed(1)} Runs
          </span>
          <span className="text-[9px] text-zinc-500 block mt-1">Standard Dev: Â±{stats.sprints.sd.toFixed(1)}</span>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl shadow-md">
          <span className="text-[10px] font-bold text-zinc-500 block">Cohort Peak Velocity Mean</span>
          <span className="text-2xl font-black text-zinc-950 mt-1 block">
            {stats.speed.avg.toFixed(2)} m/s
          </span>
          <span className="text-[9px] text-zinc-500 block mt-1">Standard Dev: Â±{stats.speed.sd.toFixed(2)}</span>
        </div>
      </div>

      {/* Cohort Leaderboard Grid */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
        <div className="border-b border-zinc-200 pb-3 mb-5 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-zinc-800">
            {activeTab} Leaderboard Rankings
          </h3>
          <span className="text-[10px] text-zinc-500 font-bold">
            Roster standard deviation offsets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500">
                <th className="pb-3 pl-2">Athlete</th>
                <th className="pb-3 text-right">Distance (m)</th>
                <th className="pb-3 text-right">Distance SD Offset</th>
                <th className="pb-3 text-right">Sprints</th>
                <th className="pb-3 text-right">Sprints SD Offset</th>
                <th className="pb-3 text-right">Peak Velocity</th>
                <th className="pb-3 text-right pr-2">Velocity SD Offset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {cohort
                .sort((a, b) => b.distance - a.distance) // Default rank by distance ran
                .map((player) => {
                  const distDev = getDeviationText(player.distance, stats.dist.avg, stats.dist.sd);
                  const sprintDev = getDeviationText(player.sprintCount, stats.sprints.avg, stats.sprints.sd);
                  const speedDev = getDeviationText(player.maxSpeed, stats.speed.avg, stats.speed.sd);

                  return (
                    <tr key={player.id} className="hover:bg-zinc-100/40 transition-colors">
                      {/* Name */}
                      <td className="py-4 pl-2 font-black text-zinc-950 dark:text-white flex items-center space-x-3.5">
                        <div className="h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-[10px] text-brand-blue">
                          {player.squadNumber}
                        </div>
                        <span>{player.name}</span>
                      </td>

                      {/* Distance */}
                      <td className="py-4 text-right font-semibold text-zinc-850 dark:text-zinc-200">{player.distance} m</td>
                      <td className="py-4 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          distDev.val >= 0.5
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : distDev.val <= -0.5
                            ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                            : 'bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-zinc-300/40'
                        }`}>
                          {distDev.text}
                        </span>
                      </td>

                      {/* Sprints */}
                      <td className="py-4 text-right font-semibold text-zinc-850 dark:text-zinc-200">{player.sprintCount}</td>
                      <td className="py-4 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          sprintDev.val >= 0.5
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : sprintDev.val <= -0.5
                            ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                            : 'bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-zinc-300/40'
                        }`}>
                          {sprintDev.text}
                        </span>
                      </td>

                      {/* Peak Velocity */}
                      <td className="py-4 text-right font-semibold text-zinc-850 dark:text-zinc-200">{player.maxSpeed} m/s</td>
                      <td className="py-4 text-right font-bold pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          speedDev.val >= 0.5
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : speedDev.val <= -0.5
                            ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                            : 'bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 border-zinc-300/40'
                        }`}>
                          {speedDev.text}
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




