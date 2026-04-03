import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '@/store/gameStore';
import { Pause } from 'lucide-react';

export default function Game() {
  const navigate = useNavigate();
  const {
    gameStatus,
    gameMode,
    board,
    score,
    moves,
    time,
    boardSize,
    selectedTile,
    selectTile,
    pauseGame,
    resumeGame,
    endGame,
    updateTime
  } = useGameStore();
  
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // 处理时间模式的倒计时
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'time' && gameStatus === 'playing') {
      interval = setInterval(() => {
        updateTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, gameStatus, updateTime]);

  // 处理游戏结束
  useEffect(() => {
    if (gameStatus === 'gameOver') {
      navigate('/end');
    }
  }, [gameStatus, navigate]);

  // 方块颜色映射
  const tileColors = [
    'bg-red-400', // 红色
    'bg-blue-400', // 蓝色
    'bg-green-400', // 绿色
    'bg-yellow-400', // 黄色
    'bg-purple-400', // 紫色
    'bg-orange-400' // 橙色
  ];

  // 方块图案（使用emoji）
  const tileSymbols = ['🍎', '🍇', '🍊', '🍋', '🍒', '🥝'];

  // 处理方块点击
  const handleTileClick = (row: number, col: number) => {
    selectTile(row, col);
  };

  // 处理暂停按钮点击
  const handlePauseClick = () => {
    pauseGame();
    setShowPauseMenu(true);
  };

  // 处理继续游戏
  const handleContinue = () => {
    resumeGame();
    setShowPauseMenu(false);
  };

  // 处理返回主界面
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {/* 游戏信息栏 */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 w-full max-w-md flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">分数</p>
          <p className="text-2xl font-bold text-blue-500">{score}</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">{gameMode === 'moves' ? '剩余步数' : '剩余时间'}</p>
          <p className="text-2xl font-bold text-yellow-500">{gameMode === 'moves' ? moves : time}</p>
        </div>
        
        <button
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md"
          onClick={handlePauseClick}
        >
          <Pause size={24} />
        </button>
      </div>

      {/* 游戏棋盘 */}
      <div 
        className={`grid gap-1 bg-gray-200 rounded-xl p-2 shadow-lg ${boardSize === 6 ? 'grid-cols-6' : 'grid-cols-8'}`}
        style={{
          width: boardSize === 6 ? '300px' : '360px',
          height: boardSize === 6 ? '300px' : '360px'
        }}
      >
        {board.map((row, rowIndex) => 
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rounded-lg cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center text-2xl ${tileColors[tile]} ${selectedTile?.row === rowIndex && selectedTile?.col === colIndex ? 'ring-4 ring-yellow-300' : ''}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            >
              {tileSymbols[tile]}
            </div>
          ))
        )}
      </div>

      {/* 暂停菜单 */}
      {showPauseMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6 text-center">游戏暂停</h2>
            <div className="flex flex-col space-y-3">
              <button
                className="py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md"
                onClick={handleContinue}
              >
                继续游戏
              </button>
              <button
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
                onClick={handleBackToHome}
              >
                返回主界面
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}