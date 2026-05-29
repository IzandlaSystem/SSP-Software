'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  History, 
  Filter, 
  Download, 
  ChevronRight, 
  Search, 
  Compass, 
  Zap, 
  Activity, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function HistoryPage() {
  const [filterType, setFilterType] = React.useState<string>('All');
  const [filterIntensity, setFilterIntensity] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [logs, setLogs] = React.useState<any[]>([]);

  // Default historical logs (last 30 days)
  const defaultLogs = [
    {
      date: 'May 24, 2026',
      type: 'Pitch Conditioning',
      distance: '5.80 km',
      maxSpeed: '8.1 m/s',
      sprints: 11,
      strain: '385',
      readinessScore: 84,
      intensity: 'High'
    },
    {
      date: 'May 22, 2026',
      type: 'Track Sprinting',
      distance: '3.10 km',
      maxSpeed: '8.4 m/s',
      sprints: 16,
      strain: '290',
      readinessScore: 78,
      intensity: 'High'
    },
    {
      date: 'May 20, 2026',
      type: 'Recovery Run',
      distance: '4.20 km',
      maxSpeed: '5.2 m/s',
      sprints: 2,
      strain: '180',
      readinessScore: 92,
      intensity: 'Low'
    },
    {
      date: 'May 18, 2026',
      type: 'training Drills',
      distance: '6.40 km',
      maxSpeed: '7.8 m/s',
      sprints: 9,
      strain: '410',
      readinessScore: 80,
      intensity: 'Medium'
    },
    {
      date: 'May 15, 2026',
      type: 'Pitch Conditioning',
      distance: '6.10 km',
      maxSpeed: '8.0 m/s',
      sprints: 12,
      strain: '402',
      readinessScore: 85,
      intensity: 'Medium'
    },
    {
      date: 'May 12, 2026',
      type: 'Track Sprinting',
      distance: '2.80 km',
      maxSpeed: '8.3 m/s',
      sprints: 14,
      strain: '265',
      readinessScore: 82,
      intensity: 'High'
    },
    {
      date: 'May 10, 2026',
      type: 'Recovery Run',
      distance: '4.50 km',
      maxSpeed: '5.4 m/s',
      sprints: 1,
      strain: '195',
      readinessScore: 95,
      intensity: 'Low'
    }
  ];

  // Sync / load logs from localStorage
  React.useEffect(() => {
    try {
      const storedLogsStr = localStorage.getItem('ssp-historical-logs');
      if (storedLogsStr) {
        const storedLogs = JSON.parse(storedLogsStr);
        // Merge stored logs with default logs, preventing duplicates when possible.
        setLogs([...storedLogs, ...defaultLogs]);
      } else {
        setLogs(defaultLogs);
      }
    } catch (e) {
      console.error(e);
      setLogs(defaultLogs);
    }
  }, []);

  // Filter & Search Logic
  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'All' || log.type === filterType;
    const matchesIntensity = filterIntensity === 'All' || log.intensity === filterIntensity;
    const matchesSearch = log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesIntensity && matchesSearch;
  });

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
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Training History</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Browse and filter historical session metrics logged in the past 30 days.
          </p>
        </div>

        {/* Download CSV Action */}
        <button
          onClick={() => alert('Exporting 30-day session history...')}
          className="shrink-0 px-4 py-2.5 bg-zinc-50 hover:bg-zinc-800 border border-zinc-200 rounded-xl text-xs font-black text-zinc-700 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>EXPORT SESSION DATA</span>
        </button>
      </div>

      {/* Grid: 30-day Totals Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 block">Total Session Volume</span>
            <span className="text-2xl font-black text-zinc-950 mt-1">32.9 km</span>
          </div>
          <Compass className="h-8 w-8 text-blue-500/20" />
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 block">Sprint Accumulations</span>
            <span className="text-2xl font-black text-zinc-950 mt-1">75 Sprints</span>
          </div>
          <Zap className="h-8 w-8 text-amber-500/20" />
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex items-center justify-between shadow">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 block">Load Balance Avg</span>
            <span className="text-2xl font-black text-zinc-950 mt-1">302 ARB</span>
          </div>
          <Activity className="h-8 w-8 text-purple-500/20" />
        </div>
      </div>

      {/* Filter Matrix Controls */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 gap-4 flex flex-col md:flex-row md:items-center justify-between shadow">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search dates, drills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-300 transition-all"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[10px] font-black text-zinc-500">Filters:</span>
          </div>

          {/* Drill type selector */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-350 focus:outline-none focus:border-zinc-300 transition-all cursor-pointer"
          >
            <option value="All">All Drill Types</option>
            <option value="Pitch Conditioning">Pitch Conditioning</option>
            <option value="Track Sprinting">Track Sprinting</option>
            <option value="Recovery Run">Recovery Run</option>
            <option value="training Drills">training Drills</option>
          </select>

          {/* Intensity selector */}
          <select
            value={filterIntensity}
            onChange={(e) => setFilterIntensity(e.target.value)}
            className="px-3 py-2 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-350 focus:outline-none focus:border-zinc-300 transition-all cursor-pointer"
          >
            <option value="All">All Intensities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Historical logs table/grid */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-300 bg-zinc-100/40 text-[10px] font-black text-zinc-500">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Drill Type</th>
                <th className="py-4 px-6">Distance</th>
                <th className="py-4 px-6">Max Velocity</th>
                <th className="py-4 px-6">Sprints</th>
                <th className="py-4 px-6">workload Load</th>
                <th className="py-4 px-6">Readiness Score</th>
                <th className="py-4 px-6 text-right">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-xs font-bold text-zinc-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No historical logs found matching the filter query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => (
                  <tr 
                    key={i} 
                    className="hover:bg-zinc-100/20 transition-all group"
                  >
                    <td className="py-4.5 px-6 text-zinc-600">{log.date}</td>
                    <td className="py-4.5 px-6 text-white tracking-tight">{log.type}</td>
                    <td className="py-4.5 px-6">{log.distance}</td>
                    <td className="py-4.5 px-6">{log.maxSpeed}</td>
                    <td className="py-4.5 px-6 text-zinc-600">{log.sprints} reps</td>
                    <td className="py-4.5 px-6">{log.strain} ARB</td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center space-x-1.5">
                        <div className="h-1.5 w-12 bg-zinc-100 rounded-full overflow-hidden border border-zinc-300">
                          <div 
                            className={`h-full rounded-full ${
                              log.readinessScore > 85 ? 'bg-emerald-500' : log.readinessScore > 75 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${log.readinessScore}%` }}
                          />
                        </div>
                        <span className=" text-zinc-600 text-[10px]">{log.readinessScore}%</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        log.intensity === 'High' 
                          ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' 
                          : log.intensity === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {log.intensity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




