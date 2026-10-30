import React from 'react';
import { X, Check, Trophy, BookOpen, Keyboard, Sliders, RotateCcw } from 'lucide-react';
import { Difficulty, GameMode, GameSettings, GridSize, MatchStats, Player } from '../types';
import { THEMES } from '../utils/theme';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<BaseModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {icon}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 text-sm text-slate-600 dark:text-slate-300 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. How to Play & Strategy Modal
export const RulesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="How to Play & Tactics" icon={<BookOpen className="w-5 h-5" />}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Objective</h3>
        <p className="leading-relaxed">
          Players take turns placing their mark (<span className="font-semibold text-sky-600">X</span> or{' '}
          <span className="font-semibold text-rose-600">O</span>) on an empty grid square. The first player to align the
          required consecutive sequence horizontally, vertically, or diagonally wins the match.
        </p>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Grid Rules</h3>
        <ul className="space-y-1.5 text-xs">
          <li>
            <strong className="text-slate-800 dark:text-slate-200">3×3 Grid:</strong> Connect 3 marks in any row,
            column, or diagonal.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">4×4 Grid:</strong> Connect 4 marks in any straight
            line.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">5×5 Grid:</strong> Connect 4 marks (Gomoku style)
            for dynamic, fast-paced tactical play.
          </li>
        </ul>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Master Strategies</h3>
        <ul className="space-y-1.5 text-xs">
          <li>
            <strong className="text-slate-800 dark:text-slate-200">Center Control:</strong> Claiming the center square
            opens up 4 winning paths simultaneously.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">The Corner Trap:</strong> Opening in a corner leaves
            fewer counter-moves for your opponent and sets up dual-threat forks.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-200">Forking:</strong> Create an intersection where two
            threat lines can be finished on your next turn; the opponent can only block one.
          </li>
        </ul>
      </div>
    </ModalWrapper>
  );
};

// 2. Statistics Modal
interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: MatchStats;
  playerXName: string;
  playerOName: string;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  playerXName,
  playerOName,
  onResetStats,
}) => {
  const total = stats.totalGames;
  const xPercent = total > 0 ? Math.round((stats.xWins / total) * 100) : 0;
  const oPercent = total > 0 ? Math.round((stats.oWins / total) * 100) : 0;
  const drawPercent = total > 0 ? Math.round((stats.draws / total) * 100) : 0;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Match Statistics" icon={<Trophy className="w-5 h-5 text-amber-500" />}>
      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 mb-1">{playerXName} (X)</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{stats.xWins}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{xPercent}% Win</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 mb-1">Ties</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{stats.draws}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{drawPercent}% Draw</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 mb-1">{playerOName} (O)</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{stats.oWins}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{oPercent}% Win</div>
        </div>
      </div>

      {/* Streaks & Totals */}
      <div className="space-y-2 pt-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Total Matches Completed</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{stats.totalGames}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Current Win Streak</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {stats.currentStreak} {stats.streakHolder ? `by ${stats.streakHolder}` : ''}
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Longest Win Streak</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{stats.bestStreak}</span>
        </div>
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="button"
          onClick={onResetStats}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Statistics</span>
        </button>
      </div>
    </ModalWrapper>
  );
};

// 3. Keyboard Shortcuts Modal
export const ShortcutsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Numpad 1–9', desc: 'Place mark on the corresponding board square (3×3)' },
    { key: 'R', desc: 'Restart the current round immediately' },
    { key: 'U', desc: 'Undo the last move' },
    { key: 'M', desc: 'Toggle sound effects on / off' },
    { key: 'S', desc: 'Open match settings drawer' },
    { key: 'Esc', desc: 'Close any active dialog or modal' },
  ];

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Keyboard Controls" icon={<Keyboard className="w-5 h-5" />}>
      <p className="text-xs text-slate-500">
        You can play the entire game hands-free using your keyboard:
      </p>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
        {shortcuts.map((sc, i) => (
          <div key={i} className="py-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{sc.desc}</span>
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono font-semibold text-[11px] shadow-xs">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
};

// 4. Match Settings & Game Mode Modal
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  playerXName: string;
  playerOName: string;
  onUpdatePlayerNames: (xName: string, oName: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  playerXName,
  playerOName,
  onUpdatePlayerNames,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Match Settings" icon={<Sliders className="w-5 h-5" />}>
      {/* Game Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Game Mode</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => onUpdateSettings({ mode: 'ai' })}
            className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
              settings.mode === 'ai'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            vs Computer AI
          </button>
          <button
            type="button"
            onClick={() => onUpdateSettings({ mode: 'pvp' })}
            className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
              settings.mode === 'pvp'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pass & Play (2P)
          </button>
        </div>
      </div>

      {/* AI Difficulty (when in AI mode) */}
      {settings.mode === 'ai' && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
            AI Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => onUpdateSettings({ difficulty: diff })}
                className={`py-2 text-xs font-medium rounded-md capitalize transition-all cursor-pointer ${
                  settings.difficulty === diff
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {diff === 'hard' ? 'Unbeatable' : diff === 'medium' ? 'Strategic' : 'Novice'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid Size */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Board Dimensions</label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {([3, 4, 5] as GridSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onUpdateSettings({ gridSize: size })}
              className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                settings.gridSize === size
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {size}×{size} {size === 3 ? '(Classic)' : size === 4 ? '(Connect 4)' : '(5-in-a-Row)'}
            </button>
          ))}
        </div>
      </div>

      {/* Play as (in AI mode) */}
      {settings.mode === 'ai' && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Play As (Starting Mark)
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['X', 'O'] as Player[]).map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => onUpdateSettings({ playerSymbol: sym })}
                className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  settings.playerSymbol === sym
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {sym} {sym === 'X' ? '(Moves First)' : '(AI Moves First)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blitz Timer */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Turn Clock (Blitz)</label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {[
            { val: 0, label: 'Off' },
            { val: 5, label: '5s Blitz' },
            { val: 10, label: '10s Blitz' },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => onUpdateSettings({ timerSeconds: opt.val })}
              className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                settings.timerSeconds === opt.val
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme selection */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Color Palette</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(THEMES).map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => onUpdateSettings({ theme: th.id })}
              className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                settings.theme === th.id
                  ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{th.name}</div>
                <div className="text-[10px] text-slate-400">{th.badge}</div>
              </div>
              {settings.theme === th.id && <Check className="w-4 h-4 text-sky-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Player Names */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Custom Names</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Player X Name</label>
            <input
              type="text"
              value={playerXName}
              onChange={(e) => onUpdatePlayerNames(e.target.value, playerOName)}
              maxLength={14}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Player O Name</label>
            <input
              type="text"
              value={playerOName}
              onChange={(e) => onUpdatePlayerNames(playerXName, e.target.value)}
              maxLength={14}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
