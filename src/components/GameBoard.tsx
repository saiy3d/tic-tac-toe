import React from 'react';
import { CellValue, GridSize, Player, WinResult } from '../types';
import { ThemeConfig } from '../utils/theme';

interface GameBoardProps {
  board: CellValue[];
  gridSize: GridSize;
  onCellClick: (index: number) => void;
  winResult: WinResult | null;
  currentTurn: Player;
  isAiThinking: boolean;
  disabled: boolean;
  theme: ThemeConfig;
  showNumpadHints: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  gridSize,
  onCellClick,
  winResult,
  currentTurn,
  isAiThinking,
  disabled,
  theme,
  showNumpadHints,
}) => {
  const winningIndices = new Set(winResult?.line || []);

  // Determine grid template classes based on grid size
  const gridColsClass =
    gridSize === 3
      ? 'grid-cols-3'
      : gridSize === 4
      ? 'grid-cols-4'
      : 'grid-cols-5';

  // Keyboard numpad mapping hint (only for 3x3 standard)
  const getNumpadKey = (index: number): number | null => {
    if (gridSize !== 3) return null;
    // Standard numpad: 7 8 9 on top row, 4 5 6 on middle, 1 2 3 on bottom
    const row = Math.floor(index / 3);
    const col = index % 3;
    if (row === 0) return 7 + col;
    if (row === 1) return 4 + col;
    if (row === 2) return 1 + col;
    return null;
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square p-3 sm:p-4 rounded-2xl border transition-all duration-300 backdrop-blur-xs select-none">
      {/* Background container with subtle border */}
      <div
        className={`w-full h-full rounded-xl p-2 sm:p-3 grid ${gridColsClass} gap-2 sm:gap-3 ${theme.boardBgClass}`}
        role="grid"
        aria-label={`${gridSize} by ${gridSize} Tic Tac Toe Board`}
      >
        {board.map((cell, index) => {
          const isWinningCell = winningIndices.has(index);
          const isCellEmpty = cell === null;
          const numpadKey = getNumpadKey(index);
          const row = Math.floor(index / gridSize) + 1;
          const col = (index % gridSize) + 1;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onCellClick(index)}
              disabled={disabled || !isCellEmpty || isAiThinking}
              aria-label={`Row ${row}, Column ${col}, ${cell ? `Marked ${cell}` : 'Empty'}${
                numpadKey ? `, Key ${numpadKey}` : ''
              }`}
              className={`group relative flex items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden
                ${
                  isWinningCell
                    ? `${theme.winningCellClass} scale-[1.03] shadow-md ring-2 ring-emerald-500/50 z-10`
                    : `${theme.cellBgClass} ${theme.cellBorderClass} ${
                        !disabled && isCellEmpty && !isAiThinking ? theme.cellHoverClass : ''
                      }`
                }
                focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500
                disabled:cursor-not-allowed
              `}
            >
              {/* Subtle Numpad Key Badge for 3x3 */}
              {showNumpadHints && numpadKey !== null && isCellEmpty && !winResult && (
                <span className="absolute top-1.5 left-2 text-[10px] font-mono text-slate-300 dark:text-slate-600 transition-opacity">
                  {numpadKey}
                </span>
              )}

              {/* Render Token */}
              {cell === 'X' && (
                <svg
                  className={`w-3/5 h-3/5 ${theme.xColorClass} transform transition-transform duration-200 scale-100`}
                  viewBox="0 0 100 100"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                >
                  <line x1="22" y1="22" x2="78" y2="78" />
                  <line x1="78" y1="22" x2="22" y2="78" />
                </svg>
              )}

              {cell === 'O' && (
                <svg
                  className={`w-3/5 h-3/5 ${theme.oColorClass} transform transition-transform duration-200 scale-100`}
                  viewBox="0 0 100 100"
                  strokeWidth="13"
                  strokeLinecap="round"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="28" />
                </svg>
              )}

              {/* Ghost preview on hover when empty */}
              {isCellEmpty && !disabled && !isAiThinking && (
                <span className="opacity-0 group-hover:opacity-20 transition-opacity duration-150 pointer-events-none">
                  {currentTurn === 'X' ? (
                    <svg
                      className={`w-3/5 h-3/5 ${theme.xColorClass}`}
                      viewBox="0 0 100 100"
                      strokeWidth="14"
                      strokeLinecap="round"
                      fill="none"
                    >
                      <line x1="22" y1="22" x2="78" y2="78" />
                      <line x1="78" y1="22" x2="22" y2="78" />
                    </svg>
                  ) : (
                    <svg
                      className={`w-3/5 h-3/5 ${theme.oColorClass}`}
                      viewBox="0 0 100 100"
                      strokeWidth="13"
                      strokeLinecap="round"
                      fill="none"
                    >
                      <circle cx="50" cy="50" r="28" />
                    </svg>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Thinking Overlay indicator */}
      {isAiThinking && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
          <div className="bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>AI calculating move...</span>
          </div>
        </div>
      )}
    </div>
  );
};
