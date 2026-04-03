import { create } from 'zustand';

// 定义游戏状态类型
type GameState = {
  // 游戏状态
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver';
  // 游戏模式：步数模式或时间模式
  gameMode: 'moves' | 'time';
  // 游戏难度
  difficulty: 'easy' | 'medium' | 'hard';
  // 棋盘大小
  boardSize: number;
  // 棋盘数据
  board: number[][];
  // 分数
  score: number;
  // 剩余步数
  moves: number;
  // 剩余时间（秒）
  time: number;
  // 最高分
  highScore: number;
  // 选中的方块位置
  selectedTile: { row: number; col: number } | null;
  // 游戏音效开关
  soundEnabled: boolean;
  
  // 操作方法
  startGame: (mode: 'moves' | 'time', difficulty: 'easy' | 'medium' | 'hard') => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  selectTile: (row: number, col: number) => void;
  swapTiles: (row1: number, col1: number, row2: number, col2: number) => void;
  checkMatches: () => boolean;
  fillEmptySpaces: () => void;
  updateScore: (points: number) => void;
  updateTime: () => void;
  resetGame: () => void;
  toggleSound: () => void;
};

// 方块类型数量
const TILE_TYPES = 6;

// 初始化棋盘
const initializeBoard = (size: number): number[][] => {
  const board: number[][] = [];
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      // 生成随机方块类型
      let tileType;
      do {
        tileType = Math.floor(Math.random() * TILE_TYPES);
      } while (checkInitialMatch(board, i, j, tileType));
      board[i][j] = tileType;
    }
  }
  return board;
};

// 检查初始生成的方块是否会形成匹配
const checkInitialMatch = (board: number[][], row: number, col: number, tileType: number): boolean => {
  // 检查横向匹配
  if (col >= 2) {
    if (board[row][col - 1] === tileType && board[row][col - 2] === tileType) {
      return true;
    }
  }
  // 检查纵向匹配
  if (row >= 2) {
    if (board[row - 1][col] === tileType && board[row - 2][col] === tileType) {
      return true;
    }
  }
  return false;
};

// 创建游戏状态管理
const useGameStore = create<GameState>((set, get) => ({
  // 初始状态
  gameStatus: 'idle',
  gameMode: 'moves',
  difficulty: 'medium',
  boardSize: 6,
  board: initializeBoard(6),
  score: 0,
  moves: 30,
  time: 60,
  highScore: parseInt(localStorage.getItem('highScore') || '0'),
  selectedTile: null,
  soundEnabled: true,
  
  // 开始游戏
  startGame: (mode, difficulty) => {
    let boardSize, moves, time;
    
    // 根据难度设置参数
    switch (difficulty) {
      case 'easy':
        boardSize = 6;
        moves = 40;
        time = 90;
        break;
      case 'medium':
        boardSize = 6;
        moves = 30;
        time = 60;
        break;
      case 'hard':
        boardSize = 8;
        moves = 25;
        time = 45;
        break;
    }
    
    set({
      gameStatus: 'playing',
      gameMode: mode,
      difficulty,
      boardSize,
      board: initializeBoard(boardSize),
      score: 0,
      moves,
      time,
      selectedTile: null
    });
  },
  
  // 暂停游戏
  pauseGame: () => {
    set({ gameStatus: 'paused' });
  },
  
  // 恢复游戏
  resumeGame: () => {
    set({ gameStatus: 'playing' });
  },
  
  // 结束游戏
  endGame: () => {
    const { score, highScore } = get();
    const newHighScore = score > highScore ? score : highScore;
    localStorage.setItem('highScore', newHighScore.toString());
    
    set({
      gameStatus: 'gameOver',
      highScore: newHighScore
    });
  },
  
  // 选择方块
  selectTile: (row, col) => {
    const { selectedTile, gameStatus } = get();
    
    if (gameStatus !== 'playing') return;
    
    // 如果没有选中的方块，直接选中
    if (!selectedTile) {
      set({ selectedTile: { row, col } });
      return;
    }
    
    // 检查是否相邻
    const isAdjacent = (
      (Math.abs(selectedTile.row - row) === 1 && selectedTile.col === col) ||
      (Math.abs(selectedTile.col - col) === 1 && selectedTile.row === row)
    );
    
    if (isAdjacent) {
      // 交换方块
      get().swapTiles(selectedTile.row, selectedTile.col, row, col);
    } else {
      // 选中新的方块
      set({ selectedTile: { row, col } });
    }
  },
  
  // 交换方块
  swapTiles: (row1, col1, row2, col2) => {
    const { board, moves, gameMode } = get();
    
    // 复制棋盘
    const newBoard = board.map(row => [...row]);
    
    // 交换方块
    [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
    
    // 更新棋盘
    set({ board: newBoard, selectedTile: null });
    
    // 检查是否有匹配
    const hasMatch = get().checkMatches();
    
    if (!hasMatch) {
      // 如果没有匹配，交换回来
      setTimeout(() => {
        const { board: currentBoard } = get();
        const revertBoard = currentBoard.map(row => [...row]);
        [revertBoard[row1][col1], revertBoard[row2][col2]] = [revertBoard[row2][col2], revertBoard[row1][col1]];
        set({ board: revertBoard });
      }, 300);
    } else {
      // 如果有匹配，减少步数
      if (gameMode === 'moves') {
        set({ moves: moves - 1 });
        
        // 检查是否步数用尽
        if (moves - 1 <= 0) {
          get().endGame();
        }
      }
    }
  },
  
  // 检查匹配
  checkMatches: () => {
    const { board, score, boardSize } = get();
    let hasMatch = false;
    let newScore = score;
    const newBoard = board.map(row => [...row]);
    
    // 标记要消除的方块
    const toRemove: { row: number; col: number }[] = [];
    
    // 检查横向匹配
    for (let i = 0; i < boardSize; i++) {
      let count = 1;
      let currentType = board[i][0];
      
      for (let j = 1; j < boardSize; j++) {
        if (board[i][j] === currentType) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = j - count; k < j; k++) {
              toRemove.push({ row: i, col: k });
            }
            hasMatch = true;
            newScore += count * 10;
          }
          count = 1;
          currentType = board[i][j];
        }
      }
      
      // 检查最后一组
      if (count >= 3) {
        for (let k = boardSize - count; k < boardSize; k++) {
          toRemove.push({ row: i, col: k });
        }
        hasMatch = true;
        newScore += count * 10;
      }
    }
    
    // 检查纵向匹配
    for (let j = 0; j < boardSize; j++) {
      let count = 1;
      let currentType = board[0][j];
      
      for (let i = 1; i < boardSize; i++) {
        if (board[i][j] === currentType) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = i - count; k < i; k++) {
              toRemove.push({ row: k, col: j });
            }
            hasMatch = true;
            newScore += count * 10;
          }
          count = 1;
          currentType = board[i][j];
        }
      }
      
      // 检查最后一组
      if (count >= 3) {
        for (let k = boardSize - count; k < boardSize; k++) {
          toRemove.push({ row: k, col: j });
        }
        hasMatch = true;
        newScore += count * 10;
      }
    }
    
    // 移除匹配的方块
    if (hasMatch) {
      toRemove.forEach(({ row, col }) => {
        newBoard[row][col] = -1; // 标记为待填充
      });
      
      set({ board: newBoard, score: newScore });
      
      // 填充空格
      setTimeout(() => {
        get().fillEmptySpaces();
      }, 300);
    }
    
    return hasMatch;
  },
  
  // 填充空格
  fillEmptySpaces: () => {
    const { board, boardSize } = get();
    const newBoard = board.map(row => [...row]);
    
    // 从下往上填充
    for (let j = 0; j < boardSize; j++) {
      let emptyCount = 0;
      
      // 计算每列的空格数
      for (let i = boardSize - 1; i >= 0; i--) {
        if (newBoard[i][j] === -1) {
          emptyCount++;
        } else if (emptyCount > 0) {
          // 将方块向下移动
          newBoard[i + emptyCount][j] = newBoard[i][j];
          newBoard[i][j] = -1;
        }
      }
      
      // 填充新方块
      for (let i = 0; i < emptyCount; i++) {
        newBoard[i][j] = Math.floor(Math.random() * TILE_TYPES);
      }
    }
    
    set({ board: newBoard });
    
    // 检查是否有新的匹配
    setTimeout(() => {
      get().checkMatches();
    }, 100);
  },
  
  // 更新分数
  updateScore: (points) => {
    set((state) => ({ score: state.score + points }));
  },
  
  // 更新时间
  updateTime: () => {
    set((state) => {
      if (state.time <= 1) {
        get().endGame();
        return { time: 0 };
      }
      return { time: state.time - 1 };
    });
  },
  
  // 重置游戏
  resetGame: () => {
    set({
      gameStatus: 'idle',
      board: initializeBoard(6),
      score: 0,
      moves: 30,
      time: 60,
      selectedTile: null
    });
  },
  
  // 切换音效
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  }
}));

export default useGameStore;