'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Square, 
  Zap, 
  Compass, 
  Activity, 
  AlertTriangle, 
  Maximize2, 
  ArrowLeft,
  Smartphone,
  Gauge
} from 'lucide-react';

export default function LiveSessionOverviewPage() {
  const router = useRouter();

  // Active Session states
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(true);
  const [seconds, setSeconds] = React.useState<number>(0);
  const [distance, setDistance] = React.useState<number>(0);
  const [speed, setSpeed] = React.useState<number>(0);
  const [sprintCount, setSprintCount] = React.useState<number>(0);
  const [workloadStrain, setworkloadStrain] = React.useState<number>(0);
  const [maxSpeed, setMaxSpeed] = React.useState<number>(0);
  const [devicePaired, setDevicePaired] = React.useState<boolean>(false);
  const latestSpeedRef = React.useRef(0);

  // Check hardware pairing on load
  React.useEffect(() => {
    const isPaired = localStorage.getItem('ssp-device-connected') === 'true';
    setDevicePaired(isPaired);
  }, []);

  // Timer & Physics simulator interval
  React.useEffect(() => {
    let interval: any = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        // Increment time
        setSeconds(prev => prev + 1);

        // Simulate velocity fluctuations (m/s) between 0 and 8.5 m/s
        let currentVelocity = 0;
        const randomSeed = Math.random();
        
        if (randomSeed < 0.2) {
          // Standing or slow jogging
          currentVelocity = parseFloat((Math.random() * 2).toFixed(1));
        } else if (randomSeed < 0.75) {
          // Controlled steady-state running
          currentVelocity = parseFloat((3 + Math.random() * 3).toFixed(1));
        } else {
          // speed/Sprint burst
          currentVelocity = parseFloat((6 + Math.random() * 2.5).toFixed(1));
        }

        const previousVelocity = latestSpeedRef.current;
        latestSpeedRef.current = currentVelocity;
        setSpeed(currentVelocity);

        // Keep track of maximum velocity
        setMaxSpeed((previousMax) => Math.max(previousMax, currentVelocity));

        // Check if velocity qualifies as high-intensity sprint (> 6.5 m/s)
        if (currentVelocity > 6.5) {
          // Chance to register a sprint
          if (Math.random() > 0.65) {
            setSprintCount(s => s + 1);
          }
        }

        // Increment distance based on velocity (distance = speed * 1s)
        setDistance(d => parseFloat((d + currentVelocity).toFixed(1)));

        // Increment workload strain based on Performance workload forces
        // Sudden velocity changes represent higher structural workload loads
        const changeFactor = Math.abs(currentVelocity - previousVelocity) * 1.5;
        const baselineStrain = currentVelocity * 0.15;
        setworkloadStrain(m => parseFloat((m + baselineStrain + changeFactor).toFixed(1)));

      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Controller Actions
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setSpeed(0);
  };

  const handleEnd = () => {
    // Save session performance details to local storage
    const sessionSummary = {
      durationSeconds: seconds,
      distance: (distance / 1000).toFixed(2), // store in km
      maxSpeed: maxSpeed > 0 ? maxSpeed.toFixed(1) : speed.toFixed(1),
      sprints: sprintCount,
      strain: workloadStrain.toFixed(0),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('ssp-last-session', JSON.stringify(sessionSummary));
    localStorage.setItem('ssp-unsynced-session', JSON.stringify(sessionSummary));
    
    // Redirect to review page
    router.push('/platform/athlete/session-review');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top bar header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Dashboard</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Live Session Feed</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            High-contrast visual dashboard designed for real-time legibility under bright pitch sunlight.
          </p>
        </div>

        {/* Connection health */}
        <div className="shrink-0 flex items-center space-x-2 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-2xl">
          <Smartphone className={`h-4.5 w-4.5 ${devicePaired ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
          <span className="text-xs font-black text-zinc-800">
            {devicePaired ? 'TRACKER CONNECTED' : 'USING SESSION SIMULATOR'}
          </span>
        </div>
      </div>

      {/* Main large-font sunlight-legible dashboard display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Large Metric: Velocity and Chrono (Main Panel) */}
        <div className="md:col-span-2 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 lg:p-8 flex flex-col justify-between min-h-[380px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center z-10 border-b border-zinc-300 pb-4">
            <div>
              <span className="text-[10px] font-black text-zinc-600">DATA STREAM</span>
              <h3 className="text-xs font-bold text-zinc-950 mt-0.5">PerformanceS VELOCITY PROFILE</h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
              !isActive ? 'bg-zinc-100 text-zinc-500' : isPaused ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 animate-pulse'
            }`}>
              {!isActive ? 'STANDBY' : isPaused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>

          {/* Core Velocity read out */}
          <div className="my-8 text-center z-10">
            <span className="text-[10px] font-black text-zinc-500 block">CURRENT SPEED</span>
            <span className="text-8xl lg:text-9xl font-black tracking-tight text-zinc-950 block">
              {speed.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-brand-cyan block mt-1">METERS PER SECOND (M/S)</span>
          </div>

          {/* Chrono Footer */}
          <div className="flex justify-between items-center border-t border-zinc-300 pt-4 z-10">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-500 block">STOPWATCH</span>
              <span className="text-3xl font-black text-zinc-950 tracking-tight">{formatTime(seconds)}</span>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[9px] font-bold text-zinc-500 block">PEAK SPEED</span>
              <span className="text-3xl font-black text-zinc-950 tracking-tight">{maxSpeed.toFixed(1)} <span className="text-xs text-zinc-450 font-normal">m/s</span></span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics (Climbing Accumulators) */}
        <div className="space-y-4">
          
          {/* Distance Climber */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg flex flex-col justify-between min-h-[120px] relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-zinc-600">Session Distance</span>
              <Compass className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 block">
                {distance.toFixed(0)}
              </span>
              <span className="text-[9px] font-bold text-zinc-500">METERS CLIMBING</span>
            </div>
          </div>

          {/* Sprint Trigger */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg flex flex-col justify-between min-h-[120px] relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-zinc-600">Sprint Count</span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 block">
                {sprintCount}
              </span>
              <span className="text-[9px] font-bold text-zinc-500">ACCELERATIVE RUNS (&gt;6.5 M/S)</span>
            </div>
          </div>

          {/* workload Strain accumulators */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg flex flex-col justify-between min-h-[120px] relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-zinc-600">workload Strain</span>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 block">
                {workloadStrain.toFixed(0)}
              </span>
              <span className="text-[9px] font-bold text-zinc-500">ARBITRARY STRUCTURAL FORCE LOAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sunlight Legibility Mode & training Controls */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-start space-x-3 max-w-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="text-xs font-black text-zinc-800">field-side Controls</h4>
            <p className="text-[10px] text-zinc-450 leading-relaxed mt-1 font-semibold">
              Tap "Start Session" to connect live activity tracking. Ending your workout will automatically save your session summary and open the post-session review.
            </p>
          </div>
        </div>

        {/* Dashboard control buttons */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-blue hover:bg-brand-blue/90 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-brand-blue/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="h-4 w-4" />
              <span>START SESSION</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={handleStart}
                  className="px-5 py-3.5 bg-zinc-100 border border-zinc-200 text-zinc-800 hover:bg-zinc-800 active:scale-95 font-black text-xs rounded-2xl flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  <span>RESUME</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-5 py-3.5 bg-zinc-100 border border-zinc-200 text-amber-400 hover:bg-zinc-800 active:scale-95 font-black text-xs rounded-2xl flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Pause className="h-4 w-4" />
                  <span>PAUSE</span>
                </button>
              )}
              <button
                onClick={handleEnd}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-blue hover:bg-brand-blue/90 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer animate-pulse"
              >
                <Square className="h-4 w-4" />
                <span>END & SAVE SESSION</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}




