import { CellValue, Difficulty, GridSize, Player, WinDirection, WinResult } from '../types';

export interface WinningLineDefinition {
  line: number[];
  direction: WinDirection;
}

// Pre-compute winning line patterns for each grid size
export function getWinningLines(size: GridSize): WinningLineDefinition[] {
  const winLength = size === 3 ? 3 : 4; // 3 on 3x3, 4 on 4x4 and 5x5
  const lines: WinningLineDefinition[] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push(r * size + (c + k));
      }
      lines.push({ line, direction: 'horizontal' });
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((r + k) * size + c);
      }
      lines.push({ line, direction: 'vertical' });
    }
  }

  // Diagonal Main (\)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((r + k) * size + (c + k));
      }
      lines.push({ line, direction: 'diagonal-main' });
    }
  }

  // Diagonal Anti (/)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((r + k) * size + (c - k));
      }
      lines.push({ line, direction: 'diagonal-anti' });
    }
  }

  return lines;
}

export function checkWinner(board: CellValue[], size: GridSize): WinResult | null {
  const winningLines = getWinningLines(size);

  for (const { line, direction } of winningLines) {
    const firstVal = board[line[0]];
    if (firstVal && line.every((idx) => board[idx] === firstVal)) {
      return { winner: firstVal, line, direction };
    }
  }

  return null;
}

export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

export function getAvailableIndices(board: CellValue[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      indices.push(i);
    }
  }
  return indices;
}

// ----------------------------------------------------------------------
// AI ENGINE: MINIMAX & HEURISTIC ENGINE
// ----------------------------------------------------------------------

// 3x3 Unbeatable Minimax
function minimax3x3(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const win = checkWinner(board, 3);
  if (win) {
    if (win.winner === aiPlayer) return 10 - depth;
    if (win.winner === humanPlayer) return depth - 10;
  }
  if (isBoardFull(board)) return 0;

  const available = getAvailableIndices(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const idx of available) {
      board[idx] = aiPlayer;
      const evalScore = minimax3x3(board, depth + 1, false, aiPlayer, humanPlayer);
      board[idx] = null;
      maxEval = Math.max(maxEval, evalScore);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const idx of available) {
      board[idx] = humanPlayer;
      const evalScore = minimax3x3(board, depth + 1, true, aiPlayer, humanPlayer);
      board[idx] = null;
      minEval = Math.min(minEval, evalScore);
    }
    return minEval;
  }
}

// Heuristic evaluator for 4x4 and 5x5
function evaluateWindow(window: CellValue[], aiPlayer: Player, humanPlayer: Player): number {
  let score = 0;
  let aiCount = 0;
  let humanCount = 0;

  for (const val of window) {
    if (val === aiPlayer) aiCount++;
    else if (val === humanPlayer) humanCount++;
  }

  if (aiCount === 4) return 10000;
  if (humanCount === 4) return -10000;

  if (aiCount === 3 && humanCount === 0) score += 120;
  else if (aiCount === 2 && humanCount === 0) score += 15;
  else if (aiCount === 1 && humanCount === 0) score += 2;

  if (humanCount === 3 && aiCount === 0) score -= 180;
  else if (humanCount === 2 && aiCount === 0) score -= 25;

  return score;
}

function evaluateBoard(board: CellValue[], size: GridSize, aiPlayer: Player, humanPlayer: Player): number {
  const winLines = getWinningLines(size);
  let totalScore = 0;

  for (const { line } of winLines) {
    const window = line.map((idx) => board[idx]);
    totalScore += evaluateWindow(window, aiPlayer, humanPlayer);
  }

  // Slight bonus for center positions
  const mid = (size - 1) / 2;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === aiPlayer) {
      const r = Math.floor(i / size);
      const c = i % size;
      const distFromCenter = Math.abs(r - mid) + Math.abs(c - mid);
      totalScore += (size - distFromCenter);
    }
  }

  return totalScore;
}

function alphaBetaSearch(
  board: CellValue[],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  size: GridSize,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const win = checkWinner(board, size);
  if (win) {
    if (win.winner === aiPlayer) return 10000 - depth * 10;
    if (win.winner === humanPlayer) return -10000 + depth * 10;
  }
  if (isBoardFull(board) || depth === 0) {
    return evaluateBoard(board, size, aiPlayer, humanPlayer);
  }

  const available = getAvailableIndices(board);

  // Sort available by closeness to existing pieces to speed up pruning
  available.sort((a, b) => {
    const mid = (size - 1) / 2;
    const distA = Math.abs(Math.floor(a / size) - mid) + Math.abs((a % size) - mid);
    const distB = Math.abs(Math.floor(b / size) - mid) + Math.abs((b % size) - mid);
    return distA - distB;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const idx of available) {
      board[idx] = aiPlayer;
      const evalScore = alphaBetaSearch(board, depth - 1, alpha, beta, false, size, aiPlayer, humanPlayer);
      board[idx] = null;
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const idx of available) {
      board[idx] = humanPlayer;
      const evalScore = alphaBetaSearch(board, depth - 1, alpha, beta, true, size, aiPlayer, humanPlayer);
      board[idx] = null;
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function computeAiMove(
  board: CellValue[],
  size: GridSize,
  difficulty: Difficulty,
  aiPlayer: Player
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const available = getAvailableIndices(board);
  if (available.length === 0) return -1;

  // 1. Immediate Win Check for AI (All levels except occasional easy misses)
  for (const idx of available) {
    board[idx] = aiPlayer;
    const win = checkWinner(board, size);
    board[idx] = null;
    if (win) {
      if (difficulty !== 'easy' || Math.random() < 0.8) {
        return idx;
      }
    }
  }

  // 2. Immediate Block Check for Human Threat (Medium & Hard)
  if (difficulty !== 'easy') {
    for (const idx of available) {
      board[idx] = humanPlayer;
      const win = checkWinner(board, size);
      board[idx] = null;
      if (win) {
        // High priority block
        return idx;
      }
    }
  }

  // Easy mode: pick random move
  if (difficulty === 'easy') {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Medium mode: 35% chance to play heuristic/random instead of optimal
  if (difficulty === 'medium' && Math.random() < 0.35) {
    // Pick center or random near center
    const centerIdx = Math.floor(board.length / 2);
    if (board[centerIdx] === null) return centerIdx;
    return available[Math.floor(Math.random() * available.length)];
  }

  // Hard / Unbeatable Mode:
  if (size === 3) {
    let bestScore = -Infinity;
    let bestMove = available[0];

    // Shuffle moves slightly so AI isn't completely robotic on identical evaluations
    const shuffledAvailable = [...available].sort(() => Math.random() - 0.5);

    for (const idx of shuffledAvailable) {
      board[idx] = aiPlayer;
      const score = minimax3x3(board, 0, false, aiPlayer, humanPlayer);
      board[idx] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
    return bestMove;
  } else {
    // 4x4 or 5x5: Alpha-Beta search with depth 3
    const maxDepth = size === 4 ? 3 : 2;
    let bestScore = -Infinity;
    let bestMove = available[0];

    for (const idx of available) {
      board[idx] = aiPlayer;
      const score = alphaBetaSearch(board, maxDepth, -Infinity, Infinity, false, size, aiPlayer, humanPlayer);
      board[idx] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
    return bestMove;
  }
}
