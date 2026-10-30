import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CellValue,
  Difficulty,
  GameMode,
  GameSettings,
  GridSize,
  MatchStats,
  Move,
  Player,
  PlayerProfile,
  WinResult,
} from './types';
import { checkWinner, computeAiMove, isBoardFull } from './utils/gameLogic';
import { sound } from './utils/audio';
import { THEMES } from './utils/theme';
import { TopBar } from './components/TopBar';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { RulesModal, StatsModal, ShortcutsModal, SettingsModal } from './components/Modals';
import { RotateCcw, Sparkles } from 'lucide-react';

const STORAGE_KEY_STATS = 'tictactoe_stats_v1';
const STORAGE_KEY_SETTINGS = 'tictactoe_settings_v1';

export default function App() {
  // Theme & Dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tictactoe_dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    const defaultSettings: GameSettings = {
      mode: 'ai',
      difficulty: 'hard',
      gridSize: 3,
      playerSymbol: 'X',
      timerSeconds: 0,
      soundEnabled: true,
      theme: 'slate',
    };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  // Player Names
  const [playerXName, setPlayerXName] = useState<string>('Player 1');
  const [playerOName, setPlayerOName] = useState<string>('AI Master');

  // Match Statistics
  const [stats, setStats] = useState<MatchStats>(() => {
    const defaultStats: MatchStats = {
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGames: 0,
      currentStreak: 0,
      streakHolder: null,
      bestStreak: 0,
    };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        try {
          return { ...defaultStats, ...JSON.parse(saved) };
        } catch {
          return defaultStats;
        }
      }
    }
    return defaultStats;
  });

  // Game Board State
  const [board, setBoard] = useState<CellValue[]>(() =>
    Array(settings.gridSize * settings.gridSize).fill(null)
  );
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Modals state
  type ModalType = 'none' | 'rules' | 'modes' | 'stats' | 'shortcuts' | 'settings';
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  // Active theme configuration
  const currentTheme = THEMES[settings.theme] || THEMES.slate;

  // Persist Dark Mode to HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tictactoe_dark', String(isDark));
  }, [isDark]);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    sound.setEnabled(settings.soundEnabled);
  }, [settings]);

  // Persist Stats
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  // Adjust player names when mode changes
  useEffect(() => {
    if (settings.mode === 'ai') {
      const humanIsX = settings.playerSymbol === 'X';
      setPlayerXName(humanIsX ? 'You' : `AI (${settings.difficulty})`);
      setPlayerOName(humanIsX ? `AI (${settings.difficulty})` : 'You');
    } else {
      setPlayerXName('Player 1');
      setPlayerOName('Player 2');
    }
  }, [settings.mode, settings.difficulty, settings.playerSymbol]);

  // Restart / Reset Round
  const handleResetRound = useCallback(() => {
    sound.playReset();
    setBoard(Array(settings.gridSize * settings.gridSize).fill(null));
    setMoveHistory([]);
    setWinResult(null);
    setIsDraw(false);
    setIsAiThinking(false);
    setCurrentTurn('X');
    if (settings.timerSeconds > 0) {
      setTimeLeft(settings.timerSeconds);
    } else {
      setTimeLeft(null);
    }
  }, [settings.gridSize, settings.timerSeconds]);

  // Re-initialize board whenever grid size changes
  useEffect(() => {
    handleResetRound();
  }, [settings.gridSize, handleResetRound]);

  // Check if AI should move first (if human is 'O' in AI mode)
  useEffect(() => {
    if (
      settings.mode === 'ai' &&
      settings.playerSymbol === 'O' &&
      currentTurn === 'X' &&
      board.every((c) => c === null) &&
      !winResult &&
      !isDraw
    ) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const aiIndex = computeAiMove(board, settings.gridSize, settings.difficulty, 'X');
        if (aiIndex !== -1) {
          const newBoard: CellValue[] = [...board];
          newBoard[aiIndex] = 'X';
          setBoard(newBoard);
          setMoveHistory([{ index: aiIndex, player: 'X', timestamp: Date.now() }]);
          sound.playMove('X');
          setCurrentTurn('O');
        }
        setIsAiThinking(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [settings.mode, settings.playerSymbol, currentTurn, board, settings.gridSize, settings.difficulty, winResult, isDraw]);

  // Record game completion
  const recordOutcome = useCallback(
    (winner: Player | 'draw', winRes: WinResult | null) => {
      setStats((prev) => {
        const next = { ...prev, totalGames: prev.totalGames + 1 };
        if (winner === 'draw') {
          next.draws += 1;
          next.currentStreak = 0;
          next.streakHolder = null;
        } else if (winner === 'X') {
          next.xWins += 1;
          if (prev.streakHolder === 'X') {
            next.currentStreak = prev.currentStreak + 1;
          } else {
            next.currentStreak = 1;
            next.streakHolder = 'X';
          }
          next.bestStreak = Math.max(next.bestStreak, next.currentStreak);
        } else {
          next.oWins += 1;
          if (prev.streakHolder === 'O') {
            next.currentStreak = prev.currentStreak + 1;
          } else {
            next.currentStreak = 1;
            next.streakHolder = 'O';
          }
          next.bestStreak = Math.max(next.bestStreak, next.currentStreak);
        }
        return next;
      });

      if (winner === 'draw') {
        setIsDraw(true);
        sound.playDraw();
      } else {
        setWinResult(winRes);
        sound.playWin();
      }
    },
    []
  );

  // Blitz Timer Countdown
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (settings.timerSeconds <= 0 || winResult || isDraw || isAiThinking) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(settings.timerSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          // Timer expired! Current turn loses round
          const losingPlayer = currentTurn;
          const winningPlayer: Player = losingPlayer === 'X' ? 'O' : 'X';
          recordOutcome(winningPlayer, null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTurn, settings.timerSeconds, winResult, isDraw, isAiThinking, recordOutcome]);

  // Make Move handler
  const handleMakeMove = useCallback(
    (index: number) => {
      if (board[index] !== null || winResult || isDraw || isAiThinking) return;

      const newBoard = [...board];
      newBoard[index] = currentTurn;
      sound.playMove(currentTurn);

      const newHistory = [...moveHistory, { index, player: currentTurn, timestamp: Date.now() }];
      setBoard(newBoard);
      setMoveHistory(newHistory);

      // Check win condition
      const win = checkWinner(newBoard, settings.gridSize);
      if (win) {
        recordOutcome(win.winner, win);
        return;
      }

      // Check tie
      if (isBoardFull(newBoard)) {
        recordOutcome('draw', null);
        return;
      }

      const nextTurn: Player = currentTurn === 'X' ? 'O' : 'X';
      setCurrentTurn(nextTurn);

      // Reset blitz timer
      if (settings.timerSeconds > 0) {
        setTimeLeft(settings.timerSeconds);
      }

      // If AI mode and next turn is AI
      const isNextAi =
        settings.mode === 'ai' &&
        ((settings.playerSymbol === 'X' && nextTurn === 'O') ||
          (settings.playerSymbol === 'O' && nextTurn === 'X'));

      if (isNextAi) {
        setIsAiThinking(true);
        const delay = settings.difficulty === 'hard' ? 420 : 350;
        setTimeout(() => {
          const aiMove = computeAiMove(newBoard, settings.gridSize, settings.difficulty, nextTurn);
          if (aiMove !== -1) {
            const aiBoard = [...newBoard];
            aiBoard[aiMove] = nextTurn;
            sound.playMove(nextTurn);

            const aiHistory = [...newHistory, { index: aiMove, player: nextTurn, timestamp: Date.now() }];
            setBoard(aiBoard);
            setMoveHistory(aiHistory);

            const aiWin = checkWinner(aiBoard, settings.gridSize);
            if (aiWin) {
              recordOutcome(aiWin.winner, aiWin);
            } else if (isBoardFull(aiBoard)) {
              recordOutcome('draw', null);
            } else {
              setCurrentTurn(currentTurn); // returns to human
              if (settings.timerSeconds > 0) {
                setTimeLeft(settings.timerSeconds);
              }
            }
          }
          setIsAiThinking(false);
        }, delay);
      }
    },
    [
      board,
      winResult,
      isDraw,
      isAiThinking,
      currentTurn,
      moveHistory,
      settings.gridSize,
      settings.timerSeconds,
      settings.mode,
      settings.playerSymbol,
      settings.difficulty,
      recordOutcome,
    ]
  );

  // Undo Move handler
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || winResult || isDraw || isAiThinking) return;

    sound.playReset();

    if (settings.mode === 'ai') {
      // In AI mode, undo both the AI move and the player's last move
      const stepsToUndo = moveHistory.length >= 2 ? 2 : 1;
      const newHistory = moveHistory.slice(0, -stepsToUndo);
      const newBoard: CellValue[] = Array(settings.gridSize * settings.gridSize).fill(null);
      newHistory.forEach((m) => {
        newBoard[m.index] = m.player;
      });

      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentTurn(settings.playerSymbol);
    } else {
      // In 2P mode, undo 1 move
      const newHistory = moveHistory.slice(0, -1);
      const newBoard: CellValue[] = Array(settings.gridSize * settings.gridSize).fill(null);
      newHistory.forEach((m) => {
        newBoard[m.index] = m.player;
      });

      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
    }

    if (settings.timerSeconds > 0) {
      setTimeLeft(settings.timerSeconds);
    }
  }, [moveHistory, winResult, isDraw, isAiThinking, settings.mode, settings.gridSize, settings.playerSymbol, currentTurn, settings.timerSeconds]);

  // Full Match Reset (clears scores & board)
  const handleNewMatch = useCallback(() => {
    handleResetRound();
  }, [handleResetRound]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys if typing inside input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        setActiveModal('none');
        return;
      }

      if (activeModal !== 'none') return;

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetRound();
        return;
      }

      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        handleUndo();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
        return;
      }

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setActiveModal('settings');
        return;
      }

      // Numpad & number row mapping for 3x3
      if (settings.gridSize === 3 && !winResult && !isDraw && !isAiThinking) {
        const numKeyMap: Record<string, number> = {
          '7': 0, '8': 1, '9': 2,
          '4': 3, '5': 4, '6': 5,
          '1': 6, '2': 7, '3': 8,
        };

        if (numKeyMap[e.key] !== undefined) {
          e.preventDefault();
          handleMakeMove(numKeyMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeModal,
    handleResetRound,
    handleUndo,
    handleMakeMove,
    settings.gridSize,
    winResult,
    isDraw,
    isAiThinking,
  ]);

  // Cycle themes
  const handleCycleTheme = () => {
    const themeKeys: (keyof typeof THEMES)[] = ['slate', 'emerald', 'indigo', 'amber'];
    const currentIndex = themeKeys.indexOf(settings.theme);
    const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  // Player profiles
  const playerXProfile: PlayerProfile = {
    name: playerXName,
    symbol: 'X',
    isAi: settings.mode === 'ai' && settings.playerSymbol === 'O',
    avatarColor: 'sky',
  };

  const playerOProfile: PlayerProfile = {
    name: playerOName,
    symbol: 'O',
    isAi: settings.mode === 'ai' && settings.playerSymbol === 'X',
    avatarColor: 'rose',
  };

  const isGameOver = winResult !== null || isDraw;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${currentTheme.bgClass}`}>
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        onOpenRules={() => setActiveModal('rules')}
        onOpenModes={() => setActiveModal('settings')}
        onOpenStats={() => setActiveModal('stats')}
        onOpenShortcuts={() => setActiveModal('shortcuts')}
        onNewMatch={handleNewMatch}
      />

      {/* Main Play Arena */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center">
        {/* Score HUD */}
        <ScoreBoard
          playerX={playerXProfile}
          playerO={playerOProfile}
          currentTurn={currentTurn}
          winner={winResult ? winResult.winner : isDraw ? 'draw' : null}
          stats={stats}
          mode={settings.mode}
          difficulty={settings.difficulty}
          gridSize={settings.gridSize}
          timeLeft={timeLeft}
          theme={currentTheme}
        />

        {/* Central Game Board */}
        <GameBoard
          board={board}
          gridSize={settings.gridSize}
          onCellClick={handleMakeMove}
          winResult={winResult}
          currentTurn={currentTurn}
          isAiThinking={isAiThinking}
          disabled={isGameOver}
          theme={currentTheme}
          showNumpadHints={settings.gridSize === 3}
        />

        {/* Post-game Play Next Action if completed */}
        {isGameOver && (
          <div className="mt-4 flex items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={handleResetRound}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${currentTheme.accentClass}`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Next Round</span>
            </button>
          </div>
        )}

        {/* Tactical Controls & Utility Bar */}
        <GameControls
          onReset={handleResetRound}
          onUndo={handleUndo}
          canUndo={moveHistory.length > 0 && !isGameOver && !isAiThinking}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
          isDark={isDark}
          onToggleDark={() => setIsDark((d) => !d)}
          onCycleTheme={handleCycleTheme}
          theme={currentTheme}
          onOpenSettings={() => setActiveModal('settings')}
          moveCount={moveHistory.length}
          totalMovesMade={stats.totalGames}
        />

        {/* Curated Feature Insights (Editorial rest area) */}
        <section className="w-full max-w-2xl mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Minimax AI Engine</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                On Unbeatable mode, the mathematical minimax engine evaluates all board states with optimal depth weighting.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Expanded 4×4 & 5×5
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect 4 straight markers on larger grid dimensions for open tactical maneuvers and multi-angle threats.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Synthesized Audio & Keyboard
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Native Web Audio harmonics for moves, ties, and wins. Full numpad 1–9 keyboard controls for lightning gameplay.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TicTacToe Studio · Built for fast, responsive web play</span>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveModal('rules')}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Rules
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('shortcuts')}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Shortcuts
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('stats')}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Stats
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RulesModal isOpen={activeModal === 'rules'} onClose={() => setActiveModal('none')} />
      <StatsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal('none')}
        stats={stats}
        playerXName={playerXName}
        playerOName={playerOName}
        onResetStats={() => {
          setStats({
            xWins: 0,
            oWins: 0,
            draws: 0,
            totalGames: 0,
            currentStreak: 0,
            streakHolder: null,
            bestStreak: 0,
          });
        }}
      />
      <ShortcutsModal isOpen={activeModal === 'shortcuts'} onClose={() => setActiveModal('none')} />
      <SettingsModal
        isOpen={activeModal === 'settings' || activeModal === 'modes'}
        onClose={() => setActiveModal('none')}
        settings={settings}
        onUpdateSettings={(newPartial) => {
          setSettings((prev) => {
            const updated = { ...prev, ...newPartial };
            return updated;
          });
        }}
        playerXName={playerXName}
        playerOName={playerOName}
        onUpdatePlayerNames={(xName, oName) => {
          setPlayerXName(xName);
          setPlayerOName(oName);
        }}
      />
    </div>
  );
}
