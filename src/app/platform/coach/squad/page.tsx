'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { mockPlayers, Player } from '@/data';

export default function SquadRosterPage() {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [positionFilter, setPositionFilter] = React.useState<string>('All');
  const [statusFilter, setStatusFilter] = React.useState<string>('All');

  // Filtering players logic
  const filteredPlayers = mockPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
    const matchesStatus = statusFilter === 'All' || player.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.Users className="h-4 w-4" />
            <span>Squad Administration</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Squad Roster Management
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Track performance trends, manage device pairing, and monitor squad availability benchmarks.
          </p>
        </div>

        {/* Quick Action */}
        <Link 
          href="/platform/coach/new-session"
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold rounded-xl transition-all hover:scale-[1.02] shadow shadow-brand-blue/25 cursor-pointer flex items-center space-x-1.5 self-start md:self-center"
        >
          <Icons.PlusCircle className="h-4 w-4" />
          <span>Design Session</span>
        </Link>
      </div>

      {/* Roster Filters Toolbar */}
      <div className="bg-zinc-50 border border-zinc-300 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 border border-zinc-200 focus:border-brand-blue rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none font-semibold"
            placeholder="Search roster by athlete name..."
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Position Selector */}
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map((pos) => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  positionFilter === pos
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-600 hover:text-zinc-800'
                }`}
              >
                {pos === 'All' ? 'All Positions' : pos + 's'}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {['All', 'Ready', 'Recovery', 'High Load'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-600 hover:text-zinc-800'
                }`}
              >
                {st === 'All' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roster table Content */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500 bg-zinc-100/30">
                <th className="py-4 pl-6 w-16">Squad #</th>
                <th className="py-4 pl-4">Athlete</th>
                <th className="py-4">Position</th>
                <th className="py-4 text-center">Duty Status</th>
                <th className="py-4 text-right">Distance (m)</th>
                <th className="py-4 text-right">Max Speed</th>
                <th className="py-4 text-right">Sprints</th>
                <th className="py-4 text-right">Workload</th>
                <th className="py-4 text-center">ACWR Index</th>
                <th className="py-4 pr-6 text-right">dashboard Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredPlayers.map((player) => {
                const isOptimal = player.acwr >= 0.8 && player.acwr <= 1.3;
                const isCaution = player.acwr > 1.3 && player.acwr < 1.5;
                const isHigh = player.acwr >= 1.5;

                return (
                  <tr key={player.id} className="hover:bg-zinc-100/40 transition-colors">
                    {/* Squad Number */}
                    <td className="py-4.5 pl-6 font-black text-zinc-600 text-sm">
                      {player.squadNumber.toString().padStart(2, '0')}
                    </td>
                    
                    {/* Athlete Name */}
                    <td className="py-4.5 pl-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-brand-blue">
                          {player.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-zinc-950">{player.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-medium">Last Act: {player.lastSession}</span>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-4.5">
                      <span className="text-[10px] font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300">
                        {player.position}
                      </span>
                    </td>

                    {/* Duty Status */}
                    <td className="py-4.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                        player.status === 'Ready'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : player.status === 'Recovery'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                      }`}>
                        {player.status}
                      </span>
                    </td>

                    {/* Distance */}
                    <td className="py-4.5 text-right font-semibold text-zinc-800">
                      {player.distance.toLocaleString()} m
                    </td>

                    {/* Max Speed */}
                    <td className="py-4.5 text-right font-semibold text-zinc-800">
                      {player.maxSpeed.toFixed(1)} m/s
                    </td>

                    {/* Sprints */}
                    <td className="py-4.5 text-right font-semibold text-zinc-800">
                      {player.sprintCount}
                    </td>

                    {/* Workload */}
                    <td className="py-4.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className=" font-semibold text-zinc-800">{player.workload}</span>
                        <div className="w-10 bg-zinc-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-blue h-full" 
                            style={{ width: `${player.workload}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* ACWR Index */}
                    <td className="py-4.5 text-center">
                      <span className={`font-black px-2.5 py-0.5 rounded text-[10px] border ${
                        isOptimal
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isCaution
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/25 animate-pulse'
                      }`}>
                        {player.acwr.toFixed(2)}
                      </span>
                    </td>

                    {/* Action dashboard Link */}
                    <td className="py-4.5 pr-6 text-right">
                      <Link 
                        href={`/platform/coach/athlete/${player.id}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-800 text-[10px] font-extrabold text-zinc-600 hover:text-white transition-all border border-zinc-300 hover:border-zinc-300"
                      >
                        dashboard
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-zinc-500 text-xs">
                    <Icons.AlertCircle className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                    <p className="">No roster records match active search query or filters.</p>
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




