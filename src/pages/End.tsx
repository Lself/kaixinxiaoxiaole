import { useNavigate } from 'react-router-dom';
import useGameStore from '@/store/gameStore';

export default function End() {
  const navigate = useNavigate();
  const { score, highScore, startGame, resetGame } = useGameStore();

  // 处理重新开始游戏
  const handleRestart = () => {
    // 重置游戏状态
    resetGame();
    // 重新开始游戏（使用默认设置）
    startGame('moves', 'medium');
    navigate('/game');
  };

  // 处理返回主界面
  const handleBackToHome = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">游戏结束</h1>
        
        <div className="mb-8">
          <p className="text-gray-600 mb-2">你的得分</p>
          <p className="text-5xl font-bold text-yellow-500 mb-4">{score}</p>
          
          {score === highScore && score > 0 && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded-lg mb-4">
              <p className="font-semibold">🎉 新纪录！</p>
            </div>
          )}
          
          <p className="text-gray-600">最高分: <span className="font-bold text-blue-500">{highScore}</span></p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            className="py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105"
            onClick={handleRestart}
          >
            重新开始
          </button>
          <button
            className="py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105"
            onClick={handleBackToHome}
          >
            返回主界面
          </button>
        </div>
      </div>
    </div>
  );
}