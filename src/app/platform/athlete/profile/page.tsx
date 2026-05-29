'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  UserCheck, 
  Save, 
  Activity, 
  Award, 
  Compass, 
  CheckCircle,
  Shield,
  Gauge
} from 'lucide-react';

export default function ProfilePage() {
  // Profile settings state
  const [name, setName] = React.useState<string>('Alex Long');
  const [squadNumber, setSquadNumber] = React.useState<number>(10);
  const [position, setPosition] = React.useState<string>('Midfielder');
  const [height, setHeight] = React.useState<number>(182); // cm
  const [weight, setWeight] = React.useState<number>(78); // kg
  const [metricUnit, setMetricUnit] = React.useState<string>('Metric');

  // Success indicator
  const [saved, setSaved] = React.useState<boolean>(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);

    // Save profile metadata to local storage
    const profileMeta = {
      name,
      squadNumber,
      position,
      height,
      weight,
      metricUnit,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('ssp-athlete-profile', JSON.stringify(profileMeta));

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  React.useEffect(() => {
    const cachedProfile = localStorage.getItem('ssp-athlete-profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setName(parsed.name || 'Alex Long');
        setSquadNumber(parsed.squadNumber || 10);
        setPosition(parsed.position || 'Midfielder');
        setHeight(parsed.height || 182);
        setWeight(parsed.weight || 78);
        setMetricUnit(parsed.metricUnit || 'Metric');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-700 font-bold text-xs">
            <Link href="/platform/athlete" className="flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Overview</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">Athlete Bio Profile</h1>
          <p className="text-xs lg:text-sm text-zinc-600 font-medium">
            Configure sessional tracking constants including mass index, training field positioning, and units.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Biography form (2 Cols) */}
        <form onSubmit={saveProfile} className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-lg space-y-6">
            <div className="border-b border-zinc-300 pb-3 flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-brand-blue" />
              <h3 className="font-extrabold text-sm text-zinc-800">
                Physical Specifications Form
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-250 focus:outline-none focus:border-zinc-300 transition-all"
                />
              </div>

              {/* Squad Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600">Squad Number</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="99"
                  value={squadNumber}
                  onChange={(e) => setSquadNumber(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-250 focus:outline-none focus:border-zinc-300 transition-all"
                />
              </div>

              {/* Position */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600">Squad Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-350 focus:outline-none focus:border-zinc-300 transition-all cursor-pointer"
                >
                  <option value="Forward">Forward</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                </select>
              </div>

              {/* Metric Units */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600">Measurement Unit System</label>
                <select
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-350 focus:outline-none focus:border-zinc-300 transition-all cursor-pointer"
                >
                  <option value="Metric">Metric (m/s, km, cm, kg)</option>
                  <option value="Imperial">Imperial (mph, miles, inches, lbs)</option>
                </select>
              </div>

              {/* Height */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600">
                  Athlete Height {metricUnit === 'Metric' ? '(cm)' : '(inches)'}
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-250 focus:outline-none focus:border-zinc-300 transition-all"
                />
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600">
                  Athlete Mass {metricUnit === 'Metric' ? '(kg)' : '(lbs)'}
                </label>
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-250 focus:outline-none focus:border-zinc-300 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-300 flex justify-between items-center">
              <span className="text-[9px] text-zinc-550">
                All weights are utilized strictly for performance force & strain calculations.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-brand-blue/20 flex items-center space-x-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>SAVE PROFILE PREFERENCES</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Visual Bio Card mockup */}
        <div className="space-y-6">
          {/* Card Mockup */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[340px] group hover:border-zinc-750 transition-all">
            
            {/* Visual background graphics */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 select-none pointer-events-none opacity-5">
              <Shield className="w-64 h-64 text-brand-blue" />
            </div>

            <div className="flex justify-between items-start z-10">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-blue text-white p-1 rounded-lg">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-zinc-350">SSP ROSTER PROFILE</span>
              </div>
              <span className="text-3xl font-black text-brand-blue tracking-tight">#{squadNumber}</span>
            </div>

            <div className="my-6 z-10">
              <span className="text-xs font-black text-brand-cyan block">{position}</span>
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 mt-1">{name}</h2>
              <p className="text-[10px] text-zinc-500 font-bold mt-1">FC UNITED ATHLETE CORE</p>
            </div>

            {/* Specifications metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-300 z-10">
              <div className="p-3.5 bg-zinc-100 rounded-2xl border border-zinc-300">
                <span className="text-[9px] font-bold text-zinc-500 block mb-0.5">HEIGHT CONSTANT</span>
                <span className="text-sm font-black text-zinc-950">{height} <span className="text-[10px] font-normal text-zinc-450">{metricUnit === 'Metric' ? 'cm' : 'in'}</span></span>
              </div>
              <div className="p-3.5 bg-zinc-100 rounded-2xl border border-zinc-300">
                <span className="text-[9px] font-bold text-zinc-500 block mb-0.5">MASS INDEX</span>
                <span className="text-sm font-black text-zinc-950">{weight} <span className="text-[10px] font-normal text-zinc-450">{metricUnit === 'Metric' ? 'kg' : 'lbs'}</span></span>
              </div>
            </div>

            {saved && (
              <div className="absolute inset-0 bg-zinc-100/95 z-20 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-200">
                <CheckCircle className="h-12 w-12 text-emerald-400 animate-bounce mb-3" />
                <h4 className="text-sm font-black text-zinc-950">PREFERENCES WRITTEN</h4>
                <p className="text-[10px] text-zinc-500 font-semibold mt-1">Local cached settings updated successfully.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




