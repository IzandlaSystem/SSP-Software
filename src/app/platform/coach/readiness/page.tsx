'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import { mockPlayers, Player } from '@/data';

// Helper to generate realistic subjective scores out of 100 based on athlete Player availability status
const getSubjectiveScores = (player: Player) => {
  const isOptimal = player.availabilityStatus === 'Optimal';
  const isAdaptive = player.availabilityStatus === 'Adaptive';

  const baseWorkload = isOptimal ? 88 : isAdaptive ? 74 : 45;
  const baseloadBalance = isOptimal ? 85 : isAdaptive ? 70 : 40;
  const baseAvailability = isOptimal ? 90 : isAdaptive ? 78 : 55;
  const baseEnergy = isOptimal ? 86 : isAdaptive ? 72 : 48;

  // Add small random noise
  const noise = (id: string, salt: number) => {
    const code = id.charCodeAt(0) + salt;
    return (code % 11) - 5; // -5 to +5
  };

  return {
    workload: Math.max(20, Math.min(100, baseWorkload + noise(player.id, 1))),
    loadBalance: Math.max(20, Math.min(100, baseloadBalance + noise(player.id, 2))),
    availability: Math.max(20, Math.min(100, baseAvailability + noise(player.id, 3))),
    energy: Math.max(20, Math.min(100, baseEnergy + noise(player.id, 4)))
  };
};

export default function AvailabilityPage() {
  const [selectedFilter, setSelectedFilter] = React.useState<'All' | 'Optimal' | 'Adaptive' | 'Restricted'>('All');

  const rosterAvailability = React.useMemo(() => {
    return mockPlayers
      .filter((p) => selectedFilter === 'All' || p.availabilityStatus === selectedFilter)
      .map((player) => ({
        player,
        scores: getSubjectiveScores(player)
      }));
  }, [selectedFilter]);

  // Heat map cell color resolver
  const getCellClasses = (score: number) => {
    if (score >= 80) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    } else if (score >= 50) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    } else {
      return 'bg-rose-500/20 text-rose-450 border-rose-500/30 animate-pulse';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.Brain className="h-4 w-4" />
            <span>session preparation Matrix</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Availability & Session Readiness
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Evaluate roster self-reported session preparation indicators. Identify strain anomalies before scheduling high-velocity conditioning.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-zinc-50 border border-zinc-300 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 w-full sm:w-auto">
          {(['All', 'Optimal', 'Adaptive', 'Restricted'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                selectedFilter === filter ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-800'
              }`}
            >
              {filter === 'All' ? 'All Athletes' : filter}
            </button>
          ))}
        </div>

        {/* Legend bar */}
        <div className="flex items-center gap-3 bg-zinc-100 px-4 py-2 rounded-xl border border-zinc-300 self-start sm:self-center">
          <span className="text-[9px] font-bold text-zinc-500 mr-2">Heat levels:</span>
          <div className="flex gap-4 text-[10px] font-bold">
            <span className="flex items-center space-x-1.5 text-emerald-400"><span className="h-2.5 w-2.5 rounded bg-emerald-500/20 border border-emerald-500/35" /> <span>Optimal (&ge;80)</span></span>
            <span className="flex items-center space-x-1.5 text-amber-400"><span className="h-2.5 w-2.5 rounded bg-amber-500/20 border border-amber-500/35" /> <span>Caution (50-79)</span></span>
            <span className="flex items-center space-x-1.5 text-brand-cyan"><span className="h-2.5 w-2.5 rounded bg-brand-blue/20 border border-brand-blue/35" /> <span>Warning (&lt;50)</span></span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Grid table */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-xl">
        <div className="border-b border-zinc-200 pb-3 mb-5 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-zinc-800">
            Roster Availability & Readiness Heat-Grid
          </h3>
          <span className="text-[10px] text-zinc-500 font-bold">
            Daily logs index
          </span>
        </div>

        {/* Heat Map Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500 bg-zinc-100/20">
                <th className="py-4 pl-4 w-48">Athlete Name</th>
                <th className="py-4 text-center">workload status</th>
                <th className="py-4 text-center">load balance</th>
                <th className="py-4 text-center">availability status</th>
                <th className="py-4 text-center">Energy Levels</th>
                <th className="py-4 text-center pr-4">Coach Review Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {rosterAvailability.map(({ player, scores }) => {
                const globalAvailability = Math.round(
                  (scores.workload + scores.loadBalance + scores.availability + scores.energy) / 4
                );
                return (
                  <tr key={player.id} className="hover:bg-zinc-100/40 transition-colors">
                    {/* Athlete Info */}
                    <td className="py-4 pl-4 font-black text-white flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-brand-blue">
                        {player.squadNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-zinc-950">{player.name}</h4>
                        <span className="text-[9px] font-bold text-zinc-500 block">{player.position}</span>
                      </div>
                    </td>

                    {/* workload */}
                    <td className="py-4 text-center px-2">
                      <div className={`py-3 rounded-xl border font-black ${getCellClasses(scores.workload)}`}>
                        {scores.workload}%
                      </div>
                    </td>

                    {/* load balance */}
                    <td className="py-4 text-center px-2">
                      <div className={`py-3 rounded-xl border font-black ${getCellClasses(scores.loadBalance)}`}>
                        {scores.loadBalance}%
                      </div>
                    </td>

                    {/* availability */}
                    <td className="py-4 text-center px-2">
                      <div className={`py-3 rounded-xl border font-black ${getCellClasses(scores.availability)}`}>
                        {scores.availability}%
                      </div>
                    </td>

                    {/* Energy */}
                    <td className="py-4 text-center px-2">
                      <div className={`py-3 rounded-xl border font-black ${getCellClasses(scores.energy)}`}>
                        {scores.energy}%
                      </div>
                    </td>

                    {/* Global average availability */}
                    <td className="py-4 text-center pr-4 pl-2">
                      <span className={`inline-block font-black px-3 py-1.5 rounded-xl border text-sm ${
                        globalAvailability >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : globalAvailability >= 50
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                      }`}>
                        {globalAvailability}%
                      </span>
                    </td>
                  </tr>
                );
              })}

              {rosterAvailability.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500 text-xs">
                    <Icons.AlertCircle className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                    <p className="">No availability heat logs match the active filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}




