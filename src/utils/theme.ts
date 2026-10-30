import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  bgClass: string;
  cardClass: string;
  boardBgClass: string;
  cellBgClass: string;
  cellHoverClass: string;
  cellBorderClass: string;
  xColorClass: string;
  oColorClass: string;
  accentClass: string;
  winningCellClass: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  slate: {
    id: 'slate',
    name: 'Modern Slate',
    badge: 'Neutral & Crisp',
    bgClass: 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100',
    cardClass: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm',
    boardBgClass: 'bg-slate-200/80 dark:bg-slate-800/80',
    cellBgClass: 'bg-white dark:bg-slate-900',
    cellHoverClass: 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
    cellBorderClass: 'border-slate-200 dark:border-slate-800',
    xColorClass: 'text-sky-600 dark:text-sky-400 stroke-sky-600 dark:stroke-sky-400',
    oColorClass: 'text-rose-600 dark:text-rose-400 stroke-rose-600 dark:stroke-rose-400',
    accentClass: 'bg-sky-600 hover:bg-sky-700 text-white',
    winningCellClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Felt',
    badge: 'Classic Green Table',
    bgClass: 'bg-emerald-50/50 dark:bg-stone-950 text-stone-900 dark:text-stone-100',
    cardClass: 'bg-white dark:bg-stone-900 border-emerald-200/60 dark:border-stone-800 shadow-sm',
    boardBgClass: 'bg-emerald-900/20 dark:bg-emerald-950/60',
    cellBgClass: 'bg-white dark:bg-stone-900',
    cellHoverClass: 'hover:bg-emerald-50/60 dark:hover:bg-stone-800',
    cellBorderClass: 'border-emerald-200/50 dark:border-stone-800',
    xColorClass: 'text-emerald-700 dark:text-emerald-400 stroke-emerald-700 dark:stroke-emerald-400',
    oColorClass: 'text-amber-600 dark:text-amber-400 stroke-amber-600 dark:stroke-amber-400',
    accentClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    winningCellClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/50',
  },
  indigo: {
    id: 'indigo',
    name: 'Midnight Azure',
    badge: 'Cosmic Contrast',
    bgClass: 'bg-slate-50 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100',
    cardClass: 'bg-white dark:bg-slate-900/90 border-indigo-100 dark:border-indigo-900/40 shadow-sm',
    boardBgClass: 'bg-indigo-200/60 dark:bg-indigo-950/80',
    cellBgClass: 'bg-white dark:bg-slate-900',
    cellHoverClass: 'hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30',
    cellBorderClass: 'border-indigo-100 dark:border-indigo-900/50',
    xColorClass: 'text-indigo-600 dark:text-indigo-400 stroke-indigo-600 dark:stroke-indigo-400',
    oColorClass: 'text-teal-600 dark:text-teal-400 stroke-teal-600 dark:stroke-teal-400',
    accentClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    winningCellClass: 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-400/50',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Copper',
    badge: 'Warm & Tactile',
    bgClass: 'bg-amber-50/40 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100',
    cardClass: 'bg-white dark:bg-zinc-900 border-amber-200/50 dark:border-zinc-800 shadow-sm',
    boardBgClass: 'bg-amber-200/60 dark:bg-zinc-800',
    cellBgClass: 'bg-white dark:bg-zinc-900',
    cellHoverClass: 'hover:bg-amber-50/50 dark:hover:bg-zinc-800/60',
    cellBorderClass: 'border-amber-200/60 dark:border-zinc-800',
    xColorClass: 'text-orange-600 dark:text-orange-400 stroke-orange-600 dark:stroke-orange-400',
    oColorClass: 'text-amber-600 dark:text-amber-400 stroke-amber-600 dark:stroke-amber-400',
    accentClass: 'bg-orange-600 hover:bg-orange-700 text-white',
    winningCellClass: 'bg-orange-50 dark:bg-orange-950/40 border-orange-500/50',
  },
};
