'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import { useRouter } from 'next/navigation';
import { defaultSessionTarget, mockPlayers, normalizeSessionConfig, upsertActiveSession } from '@/data';

type SessionType = 'training' | 'match';

export default function CreateTrainingSessionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Step 1 State: Details
  const [title, setTitle] = React.useState<string>('Training High-Press Transition');
  const [description, setDescription] = React.useState<string>('Focusing on explosive counter-pressing and 3-second recovery runs in the final third.');
  const [coachNotes, setCoachNotes] = React.useState<string>('');
  const [distanceClassification, setDistanceClassification] = React.useState<string>('Standard Distance (5000m - 7500m)');
  const [sessionDate, setSessionDate] = React.useState<string>('2026-05-27');
  const [plannedStartTime, setPlannedStartTime] = React.useState<string>('15:30');
  const [plannedEndTime, setPlannedEndTime] = React.useState<string>('16:45');
  const [sessionCategory, setSessionCategory] = React.useState<string>('Attacking transition');
  const [sport, setSport] = React.useState<string>('Football');
  const [ageGroup, setAgeGroup] = React.useState<string>('U18');
  const [level, setLevel] = React.useState<string>('Academy');
  const [duration, setDuration] = React.useState<number>(75);
  const [intensity, setIntensity] = React.useState<number>(80);
  const [sessionType, setSessionType] = React.useState<SessionType>('training');

  // Step 2 State: Squad
  const [positionFilter, setPositionFilter] = React.useState<string>('All');
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>(
    mockPlayers.map((p) => p.id) // Default to all selected
  );

  // Step 3 State: Target Constraints
  const [targetDistance, setTargetDistance] = React.useState<number>(6500);
  const [targetSprints, setTargetSprints] = React.useState<number>(12);
  const [maxSpeedLimit, setMaxSpeedLimit] = React.useState<number>(8.5);
  const [targetWorkload, setTargetWorkload] = React.useState<number>(80);
  const [customOverrides, setCustomOverrides] = React.useState<Record<string, any>>({});

  // Step 4 State: Loading trigger
  const [isActivating, setIsActivating] = React.useState<boolean>(false);

  // Handlers for Step 2
  const togglePlayer = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = mockPlayers
      .filter((p) => positionFilter === 'All' || p.position === positionFilter)
      .map((p) => p.id);

    const allFilteredAreSelected = filteredIds.every((id) => selectedPlayers.includes(id));

    if (allFilteredAreSelected) {
      // Unselect all filtered
      setSelectedPlayers((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered (avoid duplicates)
      setSelectedPlayers((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const toggleOverride = (playerId: string) => {
    setCustomOverrides((prev) => {
      if (prev[playerId]) {
        const next = { ...prev };
        delete next[playerId];
        return next;
      } else {
        return {
          ...prev,
          [playerId]: {
            distanceMeters: targetDistance,
            sprintCount: targetSprints,
            maxSpeedMps: maxSpeedLimit,
            workloadIndex: targetWorkload,
            durationMinutes: duration,
          },
        };
      }
    });
  };

  const updateOverrideField = (playerId: string, field: string, value: number) => {
    setCustomOverrides((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleActivateSession = () => {
    setIsActivating(true);
    
    // Store in localStorage to pass state to the live session
    if (typeof window !== 'undefined') {
      const squadTargets = {
        ...defaultSessionTarget,
        distanceMeters: targetDistance,
        sprintCount: targetSprints,
        maxSpeedMps: maxSpeedLimit,
        workloadIndex: targetWorkload,
        durationMinutes: duration,
      };
      const createdAt = new Date().toISOString();
      const activeSessionData = normalizeSessionConfig({
        id: `sess-${Date.now()}`,
        title,
        description,
        duration,
        plannedDurationMinutes: duration,
        intensity,
        sessionType,
        sessionCategory,
        sessionDate,
        plannedStartTime,
        plannedEndTime,
        sport,
        ageGroup,
        level,
        selectedPlayerIds: selectedPlayers,
        squadTarget: squadTargets,
        squadTargets,
        individualTargets: customOverrides,
        objectives: description,
        sessionObjectives: description,
        coachNotes: coachNotes,
        isActive: true,
        startTime: createdAt,
        distanceClassification,
        createdAt,
        status: 'active',
      });
      
      upsertActiveSession(activeSessionData);
    }

    setTimeout(() => {
      setIsActivating(false);
      router.push('/platform/coach/live-session');
      window.setTimeout(() => {
        if (window.location.pathname !== '/platform/coach/live-session') {
          window.location.assign('/platform/coach/live-session');
        }
      }, 250);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs mb-1">
            <Icons.PlusCircle className="h-4 w-4" />
            <span>SSP Coach Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            New Session
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Design upcoming sessions, apply workload constraints, and pair player wearable devices.
          </p>
        </div>
      </div>

      {/* Modern 4-Step Stepper Progress Bar */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          {/* Connector lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand-blue -translate-y-1/2 transition-all duration-300 z-0" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${
              currentStep >= 1 
                ? 'bg-brand-blue text-white border-brand-blue' 
                : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-500 dark:border-zinc-800'
            }`}>
              1
            </div>
            <span className={`text-[10px] font-bold mt-2 ${
              currentStep >= 1 ? 'text-brand-blue font-black' : 'text-zinc-500'
            }`}>Details</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${
              currentStep >= 2 
                ? 'bg-brand-blue text-white border-brand-blue' 
                : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-500 dark:border-zinc-850'
            }`}>
              2
            </div>
            <span className={`text-[10px] font-bold mt-2 ${
              currentStep >= 2 ? 'text-brand-blue font-black' : 'text-zinc-500'
            }`}>Squad</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${
              currentStep >= 3 
                ? 'bg-brand-blue text-white border-brand-blue' 
                : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-500 dark:border-zinc-850'
            }`}>
              3
            </div>
            <span className={`text-[10px] font-bold mt-2 ${
              currentStep >= 3 ? 'text-brand-blue font-black' : 'text-zinc-500'
            }`}>Targets</span>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${
              currentStep === 4 
                ? 'bg-brand-blue text-white border-brand-blue' 
                : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-500 dark:border-zinc-850'
            }`}>
              4
            </div>
            <span className={`text-[10px] font-bold mt-2 ${
              currentStep === 4 ? 'text-brand-blue font-black' : 'text-zinc-500'
            }`}>Preview</span>
          </div>
        </div>
      </div>

      {/* Stepper Content Cards */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px] flex flex-col justify-between">
        
        {/* Step 1: Session Details */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 1: {sessionType === 'training' ? 'Training' : 'Match'} Session Details</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Classify session category and define general duration goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Session Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-blue font-semibold"
                    placeholder="Enter session focus..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Session Objectives</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-blue font-semibold resize-none"
                    placeholder="Describe session details..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Session Date</label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Planned Start</label>
                    <input
                      type="time"
                      value={plannedStartTime}
                      onChange={(e) => setPlannedStartTime(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Planned End</label>
                    <input
                      type="time"
                      value={plannedEndTime}
                      onChange={(e) => setPlannedEndTime(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Coach Notes</label>
                  <textarea
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-blue font-semibold resize-none"
                    placeholder="Add notes for review..."
                  />
                </div>
              </div>

              <div className="space-y-5 bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450 block">Session Classification</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['training', 'match'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSessionType(type)}
                        className={`py-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          sessionType === type
                            ? 'bg-brand-blue text-white border-brand-blue shadow'
                            : 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        {type === 'training' ? 'Training' : 'Match'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450 block">Session Category</label>
                    <input
                      type="text"
                      value={sessionCategory}
                      onChange={(e) => setSessionCategory(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450 block">Sport</label>
                    <input
                      type="text"
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450 block">Age Group</label>
                    <input
                      type="text"
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450 block">Level</label>
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450 block">Distance Classification</label>
                  <select
                    value={distanceClassification}
                    onChange={(e) => setDistanceClassification(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="Low Volume (<5000m)">Low Volume (&lt;5000m)</option>
                    <option value="Standard Distance (5000m - 7500m)">Standard Distance (5000m - 7500m)</option>
                    <option value="High Volume (>7500m)">High Volume (&gt;7500m)</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-650 dark:text-zinc-450">
                    <span>Duration Target</span>
                    <span className="text-brand-blue">{duration} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-650 dark:text-zinc-450">
                    <span>Target Intensity</span>
                    <span className="text-brand-blue">{intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Squad Selector */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 2: Squad Selector</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Select active players. Devices will pair and connect on activation.</p>
              </div>

              {/* Position Filter Tabs */}
              <div className="flex bg-zinc-200 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-300 dark:border-zinc-800 self-start sm:self-center">
                {['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPositionFilter(pos)}
                    className={`px-3 py-1.5 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                      positionFilter === pos
                        ? 'bg-brand-blue text-white'
                        : 'text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-250'
                    }`}
                  >
                    {pos === 'All' ? 'All' : pos + 's'}
                  </button>
                ))}
              </div>
            </div>

            {/* Selection Options */}
            <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">
                {selectedPlayers.length} of {mockPlayers.length} players selected
              </span>

              <button
                type="button"
                onClick={selectAllFiltered}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
              >
                Toggle Selection
              </button>
            </div>

            {/* Players Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {mockPlayers
                .filter((p) => positionFilter === 'All' || p.position === positionFilter)
                .map((player) => {
                  const isSelected = selectedPlayers.includes(player.id);
                  return (
                    <div
                      key={player.id}
                      onClick={() => togglePlayer(player.id)}
                      className={`cursor-pointer rounded-xl p-4 border flex items-center justify-between transition-all select-none ${
                        isSelected
                          ? 'bg-brand-blue/5 border-brand-blue text-brand-blue dark:bg-brand-blue/10 dark:text-white shadow-sm'
                          : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-bold text-xs transition-all ${
                          isSelected ? 'bg-brand-blue/20 text-brand-blue border-brand-blue/30' : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800'
                        }`}>
                          {player.squadNumber}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{player.name}</h4>
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">{player.position}</span>
                        </div>
                      </div>
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-brand-blue border-brand-blue text-white' : 'border-zinc-300 dark:border-zinc-800'
                      }`}>
                        {isSelected && <Icons.Check className="h-3 w-3" />}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Step 3: Target Constraints */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 3: Target Constraints</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Establish session performance targets. These represent target indicators for the drills.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Constraint 1: Distance Target */}
              <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-900 pb-2">
                  <Icons.Milestone className="h-5 w-5 text-brand-blue" />
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Distance Target</h4>
                </div>
                <div className="text-center py-4">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">{targetDistance}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-450 block mt-1 font-bold">Meters</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="2000"
                    max="12000"
                    step="250"
                    value={targetDistance}
                    onChange={(e) => setTargetDistance(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>2000m</span>
                    <span>12000m</span>
                  </div>
                </div>
              </div>

              {/* Constraint 2: Sprint Efforts */}
              <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-900 pb-2">
                  <Icons.Flame className="h-5 w-5 text-brand-blue" />
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Sprint Efforts</h4>
                </div>
                <div className="text-center py-4">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">{targetSprints}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-450 block mt-1 font-bold">Above threshold</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={targetSprints}
                    onChange={(e) => setTargetSprints(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>2</span>
                    <span>30 efforts</span>
                  </div>
                </div>
              </div>

              {/* Constraint 3: Max Velocity Target */}
              <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-900 pb-2">
                  <Icons.Gauge className="h-5 w-5 text-brand-blue" />
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Max Velocity Target</h4>
                </div>
                <div className="text-center py-4">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">{maxSpeedLimit}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-450 block mt-1 font-bold">m/s target</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={maxSpeedLimit}
                    onChange={(e) => setMaxSpeedLimit(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>5.0 m/s</span>
                    <span>10.0 m/s</span>
                  </div>
                </div>
              </div>

              {/* Constraint 4: Workload Target */}
              <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-900 pb-2">
                  <Icons.Activity className="h-5 w-5 text-brand-blue" />
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Workload Target</h4>
                </div>
                <div className="text-center py-4">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">{targetWorkload}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-450 block mt-1 font-bold">Index</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={targetWorkload}
                    onChange={(e) => setTargetWorkload(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>20</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Targets Customization Area */}
            <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-900 pb-2">
                <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">Individual Target Overrides</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Customize individual performance targets for selected players in this session.</p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {mockPlayers
                  .filter((p) => selectedPlayers.includes(p.id))
                  .map((player) => {
                    const isCustom = !!customOverrides[player.id];
                    const playerOverride = customOverrides[player.id];
                    return (
                      <div key={player.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-full bg-brand-blue/15 text-brand-blue flex items-center justify-center font-bold text-[10px]">
                              {player.squadNumber}
                            </div>
                            <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-250">{player.name}</span>
                            <span className="text-[9px] font-bold text-zinc-500">{player.position}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => toggleOverride(player.id)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black cursor-pointer border transition-all ${
                              isCustom
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-zinc-100 text-zinc-650 border-zinc-300 hover:bg-zinc-250 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                            }`}
                          >
                            {isCustom ? 'Reset to Squad Target' : 'Customize Target'}
                          </button>
                        </div>

                        {isCustom && playerOverride && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-250 dark:border-zinc-850">
                            {/* Distance */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-extrabold text-zinc-500">
                                <span>Distance</span>
                                <span className="text-brand-blue">{playerOverride.distanceMeters}m</span>
                              </div>
                              <input
                                type="range"
                                min="2000"
                                max="12000"
                                step="250"
                                value={playerOverride.distanceMeters}
                                onChange={(e) => updateOverrideField(player.id, 'distanceMeters', Number(e.target.value))}
                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue"
                              />
                            </div>

                            {/* Sprints */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-extrabold text-zinc-500">
                                <span>Sprint Efforts</span>
                                <span className="text-brand-blue">{playerOverride.sprintCount}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={playerOverride.sprintCount}
                                onChange={(e) => updateOverrideField(player.id, 'sprintCount', Number(e.target.value))}
                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue"
                              />
                            </div>

                            {/* Max Speed */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-extrabold text-zinc-500">
                                <span>Max Speed</span>
                                <span className="text-brand-blue">{playerOverride.maxSpeedMps} m/s</span>
                              </div>
                              <input
                                type="range"
                                min="5.0"
                                max="10.0"
                                step="0.1"
                                value={playerOverride.maxSpeedMps}
                                onChange={(e) => updateOverrideField(player.id, 'maxSpeedMps', Number(e.target.value))}
                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue"
                              />
                            </div>

                            {/* Workload */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-extrabold text-zinc-500">
                                <span>Workload Index</span>
                                <span className="text-brand-blue">{playerOverride.workloadIndex}</span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={playerOverride.workloadIndex}
                                onChange={(e) => updateOverrideField(player.id, 'workloadIndex', Number(e.target.value))}
                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue"
                              />
                            </div>
                          </div>
                        )}

                        {!isCustom && (
                          <p className="text-[9px] text-zinc-500 italic pl-8">
                            Using Squad defaults: {targetDistance}m • {targetSprints} efforts • {maxSpeedLimit} m/s • Workload {targetWorkload}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Confirm */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 4: Preview & Confirm</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Review selected session parameters before starting the live sessional tracker.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Summary Cards */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-2">
                    <span className="text-[10px] font-bold text-brand-blue">{sessionType} Session Blueprint</span>
                    <span className="text-[10px] font-bold text-zinc-500">Duration: {duration} mins</span>
                  </div>
                  <h4 className="text-lg font-black text-zinc-900 dark:text-white">{title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold">
                    {sessionDate} | {plannedStartTime} - {plannedEndTime} | {sport} / {ageGroup} / {level}
                  </p>
                  <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">{description}</p>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850">
                  <h4 className="text-xs font-black text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-900 pb-2 mb-3">Target Session Metrics</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-500 block">Distance Target</span>
                      <span className="text-lg font-black text-zinc-900 dark:text-white mt-1 block">{targetDistance}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-500 block">Sprints Target</span>
                      <span className="text-lg font-black text-zinc-900 dark:text-white mt-1 block">{targetSprints}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-500 block">Max Speed Limit</span>
                      <span className="text-lg font-black text-zinc-900 dark:text-white mt-1 block">{maxSpeedLimit} m/s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roster Summary */}
              <div className="bg-zinc-100 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-2 mb-3">
                    <h4 className="text-xs font-black text-zinc-700 dark:text-zinc-300">Roster to Track</h4>
                    <span className="text-[10px] text-brand-blue font-bold">{selectedPlayers.length} Active</span>
                  </div>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {mockPlayers
                      .filter((p) => selectedPlayers.includes(p.id))
                      .map((player) => (
                        <div key={player.id} className="flex justify-between items-center bg-white dark:bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-850/40">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{player.name}</span>
                            {customOverrides[player.id] && (
                              <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 rounded font-black">Customized</span>
                            )}
                          </div>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold">{player.position}</span>
                        </div>
                      ))}
                    
                    {selectedPlayers.length === 0 && (
                      <p className="text-xs text-brand-blue text-center py-4">No athletes selected!</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-900">
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-500 leading-normal">
                    Device tracking status: Active. Real-time sessional tracking records will sync on device connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Actions footer */}
        <div className="flex items-center justify-between border-t border-zinc-250 dark:border-zinc-850 pt-5 mt-6 gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isActivating}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              currentStep === 1 || isActivating
                ? 'bg-zinc-200 dark:bg-zinc-950/20 text-zinc-400 border-zinc-300 dark:border-zinc-900 cursor-not-allowed'
                : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-350 dark:border-zinc-850'
            }`}
          >
            Back
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 2 && selectedPlayers.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentStep === 2 && selectedPlayers.length === 0
                  ? 'bg-zinc-200 dark:bg-zinc-950/20 text-zinc-400 border-zinc-350 dark:border-zinc-900 cursor-not-allowed'
                  : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow'
              }`}
            >
              <span>Next Step</span>
              <Icons.ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleActivateSession}
              disabled={selectedPlayers.length === 0 || isActivating}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                selectedPlayers.length === 0 || isActivating
                  ? 'bg-zinc-200 dark:bg-zinc-950/20 text-zinc-400 border-zinc-300 dark:border-zinc-900 cursor-not-allowed'
                  : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg'
              }`}
            >
              {isActivating ? (
                <>
                  <Icons.Loader2 className="h-4 w-4 animate-spin" />
                  <span>Configuring devices...</span>
                </>
              ) : (
                <>
                  <Icons.Radio className="h-4 w-4 animate-pulse" />
                  <span>Start Session</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}




