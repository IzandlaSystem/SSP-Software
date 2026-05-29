'use client';

import * as React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme, Theme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    {
      id: 'light' as Theme,
      label: 'Light',
      desc: 'Client-ready sports operations mode',
      icon: Sun,
      activeColor: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30',
      activeText: 'text-brand-blue',
    },
    {
      id: 'dark' as Theme,
      label: 'Dark',
      desc: 'Calm performance mode',
      icon: Moon,
      activeColor: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
      activeText: 'text-brand-blue',
    },
    {
      id: 'performance' as Theme,
      label: 'Contrast',
      desc: 'Sunlight-legible field-side view',
      icon: Zap,
      activeColor: 'bg-brand-blue text-black border-brand-blue font-extrabold',
      activeText: 'text-brand-blue',
    },
  ];

  return (
    <div className="flex flex-col space-y-2.5 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg backdrop-blur-md max-w-sm w-full transition-all shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          Display mode
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 text-zinc-500 capitalize">
          Active: {theme}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border text-center transition-all cursor-pointer select-none group focus:outline-none focus:ring-2 focus:ring-zinc-700 ${
                isActive
                  ? opt.activeColor
                  : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
              title={opt.desc}
            >
              <Icon className={`h-5 w-5 mb-1.5 transition-transform ${
                isActive ? 'scale-110' : 'group-hover:scale-105'
              } ${
                opt.id === 'performance' && isActive ? 'text-black animate-pulse' : ''
              }`} />
              <span className="text-[11px] font-black tracking-tight block">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-zinc-500 font-medium text-center leading-relaxed pt-1">
        {theme === 'light' && 'Client-ready sports operations interface.'}
        {theme === 'dark' && 'Calm dark mode with restrained contrast.'}
        {theme === 'performance' && 'High-contrast mode active. High readability under bright sunlight.'}
      </p>
    </div>
  );
}

