import React from 'react';

interface LevelBadgeProps {
  level: number;
  xp: number;
  nextLevelXP: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, xp, nextLevelXP }) => {
  const progress = (xp / nextLevelXP) * 100;

  return (
    <div className="relative inline-block">
      <div className="bg-gradient-to-br from-yellow-600 to-red-600 rounded-full p-1 shadow-lg">
        <div className="bg-gray-900 rounded-full p-4 min-w-[80px] text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Nivel</div>
          <div className="text-3xl font-black text-yellow-400">{level}</div>
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full px-2">
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LevelBadge;
