# PowerShell script to refactor visual classes across the SSP prototype codebase
$files = Get-ChildItem -Path "C:\Users\sibulele\Downloads\SSP\website\src" -Filter *.tsx -Recurse

$replacements = @{
  # --- 1. Genuinely Serious Warning States -> rose/amber ---
  'Icons.AlertOctagon className="h-5 w-5 text-red-500 animate-pulse"' = 'Icons.AlertOctagon className="h-5 w-5 text-rose-500 animate-pulse"'
  'bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded border border-red-500/20' = 'bg-rose-500/10 text-rose-500 font-bold px-2 py-0.5 rounded border border-rose-500/20'
  'hover:border-red-500/30' = 'hover:border-rose-500/30'
  'text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20' = 'text-rose-450 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20'
  'text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20' = 'text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20'
  'border-red-500/25 hover:border-red-500/40 shadow-lg shadow-red-500/5' = 'border-rose-500/25 hover:border-rose-500/40 shadow-lg shadow-rose-500/5'
  'bg-red-500 animate-pulse' = 'bg-rose-500 animate-pulse'
  'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' = 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
  'bg-red-500/15 text-red-400 border-red-500/25 animate-pulse' = 'bg-rose-500/15 text-rose-400 border-rose-500/25 animate-pulse'
  'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' = 'bg-rose-500/20 text-rose-450 border-rose-500/30 animate-pulse'
  'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' = 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
  'text-red-400 font-bold uppercase transition-colors' = 'text-rose-500 hover:text-rose-400 font-bold uppercase transition-colors'
  'devicePaired ? ''text-emerald-400 animate-pulse'' : ''text-red-500''' = 'devicePaired ? ''text-emerald-400 animate-pulse'' : ''text-rose-500'''
  'devicePaired ? ''bg-emerald-400 animate-pulse'' : ''bg-red-400''' = 'devicePaired ? ''bg-emerald-400 animate-pulse'' : ''bg-rose-500'''
  'log.readinessScore > 85 ? ''bg-emerald-500'' : log.readinessScore > 75 ? ''bg-amber-500'' : ''bg-red-500''' = 'log.readinessScore > 85 ? ''bg-emerald-500'' : log.readinessScore > 75 ? ''bg-amber-500'' : ''bg-rose-500'''
  'log.status === ''Ready'' ? ''bg-emerald-500/10 text-emerald-400 border-emerald-500/20'' : log.status === ''Recovery'' ? ''bg-blue-500/10 text-blue-400 border-blue-500/20'' : ''bg-red-500/10 text-red-500 border border-red-500/20''' = 'log.status === ''Ready'' ? ''bg-emerald-500/10 text-emerald-400 border-emerald-500/20'' : log.status === ''Recovery'' ? ''bg-blue-500/10 text-blue-400 border-blue-500/20'' : ''bg-rose-500/10 text-rose-500 border border-rose-500/20'''
  '? ''bg-red-500/10 text-red-400 border border-red-500/20''' = '? ''bg-rose-500/10 text-rose-450 border border-rose-500/20'''
  'text-red-400 font-mono text-[10px]' = 'text-rose-400 font-mono text-[10px]'
  'text-red-500 mr-2 animate-pulse' = 'text-rose-500 mr-2 animate-pulse'
  'text-red-400 animate-pulse' = 'text-rose-400 animate-pulse'
  'bg-red-500/10 text-red-400 border border-red-500/20 shadow' = 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow'

  # --- 2. Corporate Brand Accents -> brand tokens ---
  'bg-red-600 dark:bg-red-500 text-white p-2 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-md shadow-red-500/20' = 'bg-brand-blue text-white p-2 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-md shadow-brand-blue/20'
  'SSP <span className="text-red-500 font-extrabold text-xs tracking-widest ml-1 uppercase">Pro</span>' = 'SSP <span className="text-brand-blue font-extrabold text-xs tracking-widest ml-1 uppercase">Pro</span>'
  'className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"' = 'className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/10 hover:shadow-brand-blue/20 hover:scale-[1.01] active:scale-[0.99] transition-all"'
  'className="w-full text-center py-3 text-sm font-bold rounded-xl bg-red-600 text-white shadow-lg"' = 'className="w-full text-center py-3 text-sm font-bold rounded-xl bg-brand-blue text-white shadow-lg shadow-brand-blue/15"'
  
  'bg-red-500' = 'bg-brand-blue'
  'bg-red-600' = 'bg-brand-blue'
  'bg-red-700' = 'bg-brand-blue/90'
  'bg-red-950' = 'bg-brand-navy/60'
  'text-red-500' = 'text-brand-blue'
  'text-red-600' = 'text-brand-blue'
  'text-red-400' = 'text-brand-cyan'
  'border-red-500' = 'border-brand-blue'
  'border-red-600' = 'border-brand-blue'
  'border-red-900' = 'border-brand-navy/40'
  'shadow-red-500/20' = 'shadow-brand-blue/20'
  'shadow-red-500/25' = 'shadow-brand-blue/25'
  'shadow-red-500/10' = 'shadow-brand-blue/10'
  'hover:text-red-500' = 'hover:text-brand-blue'
  'hover:text-red-400' = 'hover:text-brand-cyan'
  'hover:bg-red-700' = 'hover:bg-brand-blue/90'
  'hover:bg-red-600' = 'hover:bg-brand-blue/90'
  'hover:border-red-500' = 'hover:border-brand-blue'
  'focus:ring-red-500' = 'focus:ring-brand-blue'
  'focus:border-red-500' = 'focus:border-brand-blue'
  'from-red-600 to-amber-500' = 'from-brand-blue to-brand-cyan'
  'from-red-950/45' = 'from-brand-navy/45'
  'border-red-900/30' = 'border-brand-navy/30'
  'group-hover:text-red-400' = 'group-hover:text-brand-cyan'
  'bg-red-500/10' = 'bg-brand-blue/10'
  'bg-red-500/5' = 'bg-brand-blue/5'
  'border-red-500/20' = 'border-brand-blue/20'
  'border-red-500/10' = 'border-brand-blue/10'
  'border-red-500/30' = 'border-brand-blue/30'
  'hover:border-red-500/20' = 'hover:border-brand-blue/20'
  'hover:border-red-500/40' = 'hover:border-brand-blue/40'
  'var(--color-red-500)' = 'var(--brand-blue)'
  'active:scale-98 text-white border-red-500/20 shadow-red-500/15' = 'active:scale-98 text-white border-brand-blue/20 shadow-brand-blue/15'
}

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $modified = $false
  
  # We sort keys by length descending to prevent substring matching errors
  $sortedKeys = $replacements.Keys | Sort-Object -Descending -Property Length
  
  foreach ($key in $sortedKeys) {
    if ($content.Contains($key)) {
      $content = $content.Replace($key, $replacements[$key])
      $modified = $true
    }
  }
  
  if ($modified) {
    [System.IO.File]::WriteAllText($file.FullName, $content)
    Write-Host "Refactored brand and status colors in: $($file.FullName)"
  }
}
