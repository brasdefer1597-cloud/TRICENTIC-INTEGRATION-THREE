import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'ANALIZANDO...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="relative w-16 h-16" aria-hidden="true">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-2 flex items-center justify-center text-2xl">💀</div>
      </div>
      <p className="text-gray-400 font-semibold animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
