import React from 'react';
import { GameMode, Difficulty, GridSize, MatchStats, Player, PlayerProfile } from '../types';
import { Bot, User, Clock, Flame } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface ScoreBoardProps {
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  currentTurn: Player;
  winner: Player | 'draw' | null;
  stats: MatchStats;
  mode: GameMode;
  difficulty: Difficulty;
  gridSize: GridSize;
  timeLeft: number | null;
  theme: ThemeConfig;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerX,
  playerO,
  currentTurn,
  winner,
  stats,
  mode,
  difficulty,
  gridSize,
  timeLeft,
  theme,
}) => {
  const isXTurn = currentTurn === 'X' && !winner;
  const isOTurn = currentTurn === 'O' && !winner;

  const modeLabel = mode === 'ai' ? `vs AI (${difficulty})` : 'Local 2-Player';
  const gridLabel = `${gridSize}×${gridSize} Grid`;
  const roundNum = stats.totalGames + (winner ? 0 : 1);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      {/* Unboxed Metadata Header */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 tracking-wide">
        <span>{gridLabel}</span>
        <span aria-hidden="true">·</span>
        <span className="capitalize">{modeLabel}</span>
        <span aria-hidden="true">·</span>
        <span>Round {roundNum}</span>
        {stats.bestStreak > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              <span>Streak: {stats.currentStreak} (Best {stats.bestStreak})</span>
            </span>
          </>
        )}
      </div>

      {/* Main Scoreboard HUD */}
      <div className={`grid grid-cols-3 items-center rounded-xl border p-4 ${theme.cardClass}`}>
        {/* Player X */}
        <div
          className={`flex flex-col items-center sm:items-start p-2 rounded-lg transition-all ${
            isXTurn
              ? 'ring-2 ring-sky-500/30 bg-sky-50/60 dark:bg-sky-950/20'
              : 'opacity-85'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${theme.xColorClass} bg-sky-100 dark:bg-sky-950/80`}>
              X
            </span>
            <span className="text-sm font-semibold truncate max-w-[90px] sm:max-w-[130px] text-slate-800 dark:text-slate-200">
              {playerX.name}
            </span>
            {playerX.isAi ? (
              <Bot className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {stats.xWins}
            </span>
            <span className="text-xs text-slate-500">Wins</span>
          </div>
        </div>

        {/* Center Game Status & Blitz Timer */}
        <div className="flex flex-col items-center text-center px-2">
          {winner === 'draw' ? (
            <div className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 py-1">
              Round Draw
            </div>
          ) : winner ? (
            <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 py-1">
              Player {winner} Wins!
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Turn
              </span>
              <span className={`text-base font-extrabold font-mono ${currentTurn === 'X' ? theme.xColorClass : theme.oColorClass}`}>
                {currentTurn === 'X' ? playerX.name : playerO.name}
              </span>
            </div>
          )}

          {/* Ties display */}
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums mt-0.5">
            {stats.draws} {stats.draws === 1 ? 'Draw' : 'Draws'}
          </span>

          {/* Blitz Timer */}
          {timeLeft !== null && !winner && (
            <div className="flex items-center gap-1 mt-1 text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
              <Clock className="w-3 h-3 animate-pulse" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Player O */}
        <div
          className={`flex flex-col items-center sm:items-end p-2 rounded-lg transition-all ${
            isOTurn
              ? 'ring-2 ring-rose-500/30 bg-rose-50/60 dark:bg-rose-950/20'
              : 'opacity-85'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold truncate max-w-[90px] sm:max-w-[130px] text-slate-800 dark:text-slate-200">
              {playerO.name}
            </span>
            {playerO.isAi ? (
              <Bot className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${theme.oColorClass} bg-rose-100 dark:bg-rose-950/80`}>
              O
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {stats.oWins}
            </span>
            <span className="text-xs text-slate-500">Wins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
