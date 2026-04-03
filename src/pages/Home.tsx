import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '@/store/gameStore';
import { Settings, Trophy } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { startGame, highScore, toggleSound, soundEnabled } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'moves' | 'time'>('moves');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartGame = () => {
    startGame(selectedMode, selectedDifficulty);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {/* 游戏标题 */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-yellow-400 mb-4">
          开心消消乐
        </h1>
        <p className="text-gray-600 text-lg">点击相同图案的方块，获得高分！</p>
      </div>

      {/* 游戏模式选择 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">游戏设置</h2>
        
        {/* 游戏模式 */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">游戏模式</label>
          <div className="flex space-x-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${selectedMode === 'moves' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedMode('moves')}
            >
              步数模式
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${selectedMode === 'time' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedMode('time')}
            >
              时间模式
            </button>
          </div>
        </div>

        {/* 游戏难度 */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">游戏难度</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-2 rounded-lg text-center ${selectedDifficulty === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedDifficulty('easy')}
            >
              简单
            </button>
            <button
              className={`py-2 px-2 rounded-lg text-center ${selectedDifficulty === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedDifficulty('medium')}
            >
              中等
            </button>
            <button
              className={`py-2 px-2 rounded-lg text-center ${selectedDifficulty === 'hard' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedDifficulty('hard')}
            >
              困难
            </button>
          </div>
        </div>

        {/* 开始游戏按钮 */}
        <button
          className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          onClick={handleStartGame}
        >
          开始游戏
        </button>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-between w-full max-w-md">
        {/* 排行榜按钮 */}
        <button
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          <Trophy size={18} />
          <span>排行榜</span>
        </button>

        {/* 设置按钮 */}
        <button
          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} />
          <span>设置</span>
        </button>
      </div>

      {/* 排行榜弹窗 */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">排行榜</h2>
            <div className="text-center mb-4">
              <p className="text-gray-600">最高分</p>
              <p className="text-3xl font-bold text-blue-500">{highScore}</p>
            </div>
            <button
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
              onClick={() => setShowLeaderboard(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">设置</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">音效</span>
              <button
                className={`w-12 h-6 rounded-full ${soundEnabled ? 'bg-blue-500' : 'bg-gray-300'} relative`}
                onClick={toggleSound}
              >
                <div className={`absolute top-0.5 ${soundEnabled ? 'right-0.5' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`} />
              </button>
            </div>
            <button
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg"
              onClick={() => setShowSettings(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}