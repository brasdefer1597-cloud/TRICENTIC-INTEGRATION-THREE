import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: 'red' | 'yellow' | 'green' | 'blue';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  color = 'red'
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400">{label}</span>
          <span className="text-gray-300 font-semibold">
            {current} / {max}
          </span>
        </div>
      )}
      <div
        className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
