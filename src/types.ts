export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type GameMode = 'ai' | 'pvp';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GridSize = 3 | 4 | 5;

export interface Move {
  index: number;
  player: Player;
  timestamp: number;
}

export type WinDirection = 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';

export interface WinResult {
  winner: Player;
  line: number[];
  direction: WinDirection;
}

export type GameStatus = 'playing' | 'won' | 'draw';

export interface PlayerProfile {
  name: string;
  symbol: Player;
  isAi: boolean;
  avatarColor: string;
}

export interface MatchStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
  currentStreak: number;
  streakHolder: Player | null;
  bestStreak: number;
}

export type ThemeId = 'slate' | 'emerald' | 'indigo' | 'amber';

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  gridSize: GridSize;
  playerSymbol: Player; // for AI mode: human's symbol
  timerSeconds: number; // 0 for disabled, or 10 for blitz
  soundEnabled: boolean;
  theme: ThemeId;
}
