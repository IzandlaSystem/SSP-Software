'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockPlayers, Player } from '@/data';

interface LivePlayer extends Player {
  x: number;
  y: number;
  liveSpeed: number;
}

export default function LiveSessionPage() {
  const router = useRouter();

  // Session state
  const [sessionActive, setSessionActive] = React.useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = React.useState<number>(852); // Starts at 14:12 for realism
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string | null>('1'); // Default Marcus Vane
  const [sessionConfig, setSessionConfig] = React.useState<any>(null);

  // Initialize players list with live positional offsets
  const [livePlayers, setLivePlayers] = React.useState<LivePlayer[]>([]);

  // Load configuration from local storage if exists
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const configStr = localStorage.getItem('active_session_config');
      if (configStr) {
        setSessionConfig(JSON.parse(configStr));
      }
    }

    // Set initial realistic positions on a 100 x 64 football pitch grid
    const initialPositions = [
      { id: '1', x: 80, y: 32 }, // Marcus Vane (Forward) - near opponent box
      { id: '2', x: 55, y: 22 }, // Lucas Sterling (Midfielder) - midfield left
      { id: '3', x: 30, y: 18 }, // Trent Alexander (Defender) - back right
      { id: '4', x: 75, y: 14 }, // Christian Benteke (Forward) - flank left
      { id: '5', x: 50, y: 44 }, // Declan Rice (Midfielder) - defensive mid right
      { id: '6', x: 28, y: 46 }, // Virgil van Dijk (Defender) - back left
      { id: '7', x: 8,  y: 32 }, // Alisson Becker (Goalkeeper) - goal mouth
      { id: '8', x: 78, y: 48 }, // Son Heung-min (Forward) - flank right
    ];

    const initialLive = mockPlayers.map((player) => {
      const pos = initialPositions.find((p) => p.id === player.id) || { x: 50, y: 32 };
      return {
        ...player,
        x: pos.x,
        y: pos.y,
        liveSpeed: player.currentSpeed,
      };
    });
    setLivePlayers(initialLive);
  }, []);

  // Timer ticker and metric wiggler
  React.useEffect(() => {
    if (!sessionActive) return;

    const interval = setInterval(() => {
      // 1. Tick elapsed time
      setElapsedSeconds((prev) => prev + 1);

      // 2. Wiggle players metrics & positions
      setLivePlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          // Keep Goalkeeper relatively anchored in his box
          const isGK = player.position === 'Goalkeeper';
          
          // Random coordinates wiggle
          const dx = isGK ? (Math.random() - 0.5) * 0.8 : (Math.random() - 0.5) * 3;
          const dy = isGK ? (Math.random() - 0.5) * 0.6 : (Math.random() - 0.5) * 2.5;

          let newX = player.x + dx;
          let newY = player.y + dy;

          // Constraints so players stay inside the lines (viewBox 0 0 100 64)
          if (newX < 4) newX = 4;
          if (newX > 96) newX = 96;
          if (newY < 4) newY = 4;
          if (newY > 60) newY = 60;

          // Goalkeeper strict bounding box
          if (isGK) {
            if (newX > 16) newX = 16;
            if (newY < 18) newY = 18;
            if (newY > 46) newY = 46;
          }

          // Live speed wiggle (0m/s up to 9.5m/s)
          const speedChange = (Math.random() - 0.5) * 2;
          let newSpeed = Math.max(0, Math.min(9.5, player.liveSpeed + speedChange));
          
          // Round speeds and convert to one decimal
          newSpeed = parseFloat(newSpeed.toFixed(1));

          // Increment distance by speed delta
          const distanceGain = Math.round(newSpeed * 1.2);
          const newDistance = player.distance + distanceGain;

          // Check for sprints (> 5.5 m/s threshold)
          let sprints = player.sprintCount;
          if (newSpeed > 5.5 && player.liveSpeed <= 5.5) {
            sprints += 1;
          }

          // Workload index increment proportional to speed
          const workloadDelta = newSpeed > 6 ? 2 : newSpeed > 3 ? 1 : 0;
          const newWorkload = Math.min(100, player.workload + workloadDelta);

          // Update max speed if surpassed
          const maxSpeed = Math.max(player.maxSpeed, newSpeed);

          return {
            ...player,
            x: parseFloat(newX.toFixed(1)),
            y: parseFloat(newY.toFixed(1)),
            liveSpeed: newSpeed,
            distance: newDistance,
            maxSpeed: parseFloat(maxSpeed.toFixed(1)),
            sprintCount: sprints,
            workload: newWorkload,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get selected player details
  const selectedPlayer = livePlayers.find((p) => p.id === selectedPlayerId);

  // Terminate active live stream and route to summary dashboard
  const handleStopSession = () => {
    setSessionActive(false);

    // Save final stats into localStorage for Session Review
    if (typeof window !== 'undefined') {
      const summaryData = {
        title: sessionConfig?.title || 'training High-Press Transition',
        date: new Date().toLocaleDateString('en-GB'),
        durationMinutes: Math.floor(elapsedSeconds / 60),
        totalDistanceMeters: livePlayers.reduce((acc, p) => acc + p.distance, 0),
        intensityScore: sessionConfig?.intensity || 80,
        type: sessionConfig?.sessionType || 'training',
        drills: [
          {
            drillName: 'Dynamic Warmup & Positionings',
            durationMinutes: 20,
            targetDistanceMeters: 1500,
            targetMaxSpeedMps: 6.5,
          },
          {
            drillName: 'High-Velocity Pressure Blocks',
            durationMinutes: 25,
            targetDistanceMeters: 2800,
            targetMaxSpeedMps: 9.0,
          },
        ],
        athleteMetrics: livePlayers.map((p) => ({
          athleteId: p.id,
          athleteName: p.name,
          distanceMeters: p.distance,
          maxSpeedMps: p.maxSpeed,
          sprintCount: p.sprintCount,
          workloadIndex: p.workload,
          acwr: p.acwr,
        })),
      };
      localStorage.setItem('last_completed_session', JSON.stringify(summaryData));
    }

    router.push('/platform/coach/session-review');
  };

  // Compute live aggregates
  const squadTotalMeters = livePlayers.reduce((acc, p) => acc + p.distance, 0);
  const squadTotalSprints = livePlayers.reduce((acc, p) => acc + p.sprintCount, 0);
  const highestSpeed = livePlayers.reduce((max, p) => p.liveSpeed > max ? p.liveSpeed : max, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Live System Control Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs mb-1">
            <Icons.Radio className="h-4 w-4 text-brand-blue" />
            <span>Live Session Tracking</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            {sessionConfig?.title || 'Live Squad Session'}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Clean field view with live player positions and session records.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Session Timer */}
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl px-4 py-2 shadow-sm">
            <Icons.Timer className="h-4.5 w-4.5 text-brand-blue mr-2" />
            <span className="text-xl font-black text-zinc-900 dark:text-white">{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="flex bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-850 p-1 rounded-xl shadow-sm">
            {sessionActive ? (
              <button
                onClick={() => setSessionActive(false)}
                className="px-3.5 py-2 text-xs font-bold text-amber-700 hover:bg-zinc-350 dark:text-amber-400 dark:hover:text-white rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer dark:hover:bg-zinc-800"
              >
                <Icons.Pause className="h-4 w-4" />
                <span className=" text-[10px]">Pause</span>
              </button>
            ) : (
              <button
                onClick={() => setSessionActive(true)}
                className="px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-zinc-350 dark:text-emerald-400 dark:hover:text-white rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer dark:hover:bg-zinc-800"
              >
                <Icons.Play className="h-4 w-4" />
                <span className=" text-[10px]">Resume</span>
              </button>
            )}

            <button
              onClick={handleStopSession}
              className="px-4 py-2 text-xs bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow cursor-pointer text-[10px]"
            >
              <Icons.Square className="h-3.5 w-3.5 fill-current" />
              <span>Stop & Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pitch Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic SVG Football Pitch Visualizer */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3.5 mb-4">
            <div className="flex items-center space-x-2">
              <Icons.Map className="h-5 w-5 text-brand-blue" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">
                Live Squad Positional Grid
              </h3>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold">
              100m x 64m Pitch Grid
            </span>
          </div>

          {/* Styled High-Tech SVG Football Pitch */}
          <div className="platform-field relative aspect-[100/64] rounded-xl border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-inner select-none">
            {/* Grid line markings overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4%_6.25%] pointer-events-none opacity-30 dark:opacity-20" />
            
            <svg 
              viewBox="0 0 100 64" 
              className="absolute inset-0 w-full h-full text-zinc-300 dark:text-zinc-800 stroke-[0.35] fill-none"
            >
              {/* Pitch Boundaries */}
              <rect x="4" y="4" width="92" height="56" rx="1" stroke="currentColor" />

              {/* Halfway Line */}
              <line x1="50" y1="4" x2="50" y2="60" stroke="currentColor" />

              {/* Center Circle */}
              <circle cx="50" cy="32" r="9" stroke="currentColor" />
              <circle cx="50" cy="32" r="0.4" fill="currentColor" />

              {/* Left Penalty Area */}
              <rect x="4" y="16" width="16" height="32" stroke="currentColor" />
              <rect x="4" y="24" width="6" height="16" stroke="currentColor" />
              <circle cx="16" cy="32" r="0.4" fill="currentColor" />
              {/* Left Penalty Arc */}
              <path d="M 20 26.5 A 9 9 0 0 1 20 37.5" stroke="currentColor" />

              {/* Right Penalty Area */}
              <rect x="80" y="16" width="16" height="32" stroke="currentColor" />
              <rect x="90" y="24" width="6" height="16" stroke="currentColor" />
              <circle cx="84" cy="32" r="0.4" fill="currentColor" />
              {/* Right Penalty Arc */}
              <path d="M 80 26.5 A 9 9 0 0 0 80 37.5" stroke="currentColor" />

              {/* Left Corner Arcs */}
              <path d="M 4 5 A 1 1 0 0 0 5 4" stroke="currentColor" />
              <path d="M 4 59 A 1 1 0 0 1 5 60" stroke="currentColor" />

              {/* Right Corner Arcs */}
              <path d="M 96 5 A 1 1 0 0 1 95 4" stroke="currentColor" />
              <path d="M 96 59 A 1 1 0 0 0 95 60" stroke="currentColor" />
            </svg>

            {/* Interactive Player Dot Markers on Pitch */}
            {livePlayers.map((player) => {
              const isSelected = player.id === selectedPlayerId;
              const initials = player.name.split(' ').map((n) => n[0]).join('');
              
              return (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-1000 focus:outline-none"
                >
                  {/* Ripple for active runners */}
                  {player.liveSpeed > 5.5 && (
                    <span className="absolute inset-0 h-8 w-8 -m-1.5 rounded-full bg-brand-blue/15 dark:bg-brand-blue/20 animate-ping" />
                  )}

                  {/* Player Dot Body */}
                  <div className={`platform-player-marker rounded-full flex items-center justify-center font-bold transition-all border ${
                    isSelected 
                      ? 'bg-brand-blue text-white border-white scale-125 shadow z-30' 
                      : player.liveSpeed > 5.5
                      ? 'bg-amber-500 text-black border-white z-20 hover:scale-110 shadow'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 z-10 hover:scale-110 shadow-sm'
                  }`}>
                    {initials}
                  </div>

                  {/* Micro Tooltip */}
                  <span className="absolute top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[8px] font-bold text-zinc-700 dark:text-zinc-300 px-1 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-40">
                    {player.name.split(' ')[0]} ({player.liveSpeed} m/s)
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 inline-block" />
              <span>Jogging / Walking</span>
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block ml-3" />
              <span>Sprinting (&gt;5.5 m/s)</span>
            </span>
            <span>Click player tag to lock tracking dashboard</span>
          </div>
        </div>

        {/* Selected Player Live Drawer Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow flex flex-col justify-between">
          {selectedPlayer ? (
            <div className="space-y-5">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center space-x-3.5">
                  <div className="h-9 w-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center font-bold text-brand-blue">
                    #{selectedPlayer.squadNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{selectedPlayer.name}</h3>
                    <span className="text-[10px] font-bold text-zinc-500">{selectedPlayer.position}</span>
                  </div>
                </div>
                
                <span className={`h-2.5 w-2.5 rounded-full ${
                  selectedPlayer.liveSpeed > 5.5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`} />
              </div>

              {/* Dynamic Ticking Metric Indicators */}
              <div className="space-y-3.5">
                {/* 1. Live Speed */}
                <div className="platform-metric-card p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icons.Gauge className="h-4.5 w-4.5 text-zinc-500" />
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Current Velocity</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{selectedPlayer.liveSpeed}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-1 font-bold">m/s</span>
                  </div>
                </div>

                {/* 2. Live Cumulative Distance */}
                <div className="platform-metric-card p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icons.Milestone className="h-4.5 w-4.5 text-zinc-500" />
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Total Distance</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-zinc-900 dark:text-white">{selectedPlayer.distance}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-1 font-bold">m</span>
                  </div>
                </div>

                {/* 3. High Speed Sprints */}
                <div className="platform-metric-card p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icons.Zap className="h-4.5 w-4.5 text-zinc-500" />
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">High-Speed Sprints</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-600 dark:text-amber-500">{selectedPlayer.sprintCount}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-1 font-bold">Runs</span>
                  </div>
                </div>

                {/* 4. Live Workload Index */}
                <div className="platform-metric-card p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icons.Compass className="h-4.5 w-4.5 text-zinc-500" />
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Workload Index</span>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <div className="w-16 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="bg-brand-blue h-full transition-all duration-500" 
                        style={{ width: `${selectedPlayer.workload}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-zinc-900 dark:text-white">{selectedPlayer.workload}</span>
                  </div>
                </div>
              </div>

              {/* Speed Target constraint limit */}
              <div className="platform-metric-card p-4.5 rounded-xl space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-zinc-550 dark:text-zinc-500">
                  <span>Peak Speed Today</span>
                  <span className="text-zinc-900 dark:text-white">{selectedPlayer.maxSpeed} m/s</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-blue h-full" 
                    style={{ width: `${(selectedPlayer.maxSpeed / 10.0) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs">
              <Icons.Loader2 className="h-8 w-8 text-zinc-400 dark:text-zinc-700 animate-spin mx-auto mb-2" />
              <p>Acquiring sessional receiver lock...</p>
            </div>
          )}

          {/* status details */}
          <div className="mt-4 pt-3.5 border-t border-zinc-200 dark:border-zinc-850">
            <span className="text-[9px] text-zinc-500 block text-center">
              Session Tracking Status: Active
            </span>
          </div>
        </div>

      </div>

      {/* Aggregate Live Team Summary grid */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">
            Live Squad Session Log
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Summary metrics aggregated across all active trackers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="platform-metric-card p-4.5 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-500 block">Total Squad Distance</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-white mt-1 block">{(squadTotalMeters / 1000).toFixed(2)} km</span>
          </div>

          <div className="platform-metric-card p-4.5 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-500 block">Total Sprint Reps</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-500 mt-1 block">{squadTotalSprints} Runs</span>
          </div>

          <div className="platform-metric-card p-4.5 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-500 block">Max Velocity Recorded</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-white mt-1 block">{highestSpeed} m/s</span>
          </div>
        </div>
      </div>

    </div>
  );
}



