import React from 'react';
import { RotateCcw, Undo2, Volume2, VolumeX, Moon, Sun, Palette, SlidersHorizontal } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onCycleTheme: () => void;
  theme: ThemeConfig;
  onOpenSettings: () => void;
  moveCount: number;
  totalMovesMade: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onUndo,
  canUndo,
  soundEnabled,
  onToggleSound,
  isDark,
  onToggleDark,
  onCycleTheme,
  theme,
  onOpenSettings,
  moveCount,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mt-5">
      {/* Primary Actions Row */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl border bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-xs backdrop-blur-xs">
        {/* Restart Round */}
        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          title="Restart Round (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>

        {/* Undo Move */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Undo Last Move (U)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>

        {/* Match Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          title="Game Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Auxiliary Utility Controls Row */}
      <div className="flex items-center justify-between px-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="text-[11px] font-mono tabular-nums">
          {moveCount} {moveCount === 1 ? 'move' : 'moves'} played
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound (M)' : 'Enable sound (M)'}
            title={soundEnabled ? 'Mute Sound (M)' : 'Enable Sound (M)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Theme Palette Switcher */}
          <button
            type="button"
            onClick={onCycleTheme}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label={`Theme: ${theme.name}. Click to change.`}
            title={`Theme: ${theme.name}`}
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
