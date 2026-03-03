import React, { useState } from 'react';
import type { CenterType } from '@/types';

const OXYGEN_TYPES: Array<{ id: CenterType; label: string; icon: string; classes: string }> = [
  {
    id: 'head',
    label: 'Mental Oxygen',
    icon: '🧠',
    classes: 'bg-blue-900 bg-opacity-30 hover:bg-blue-800 text-blue-300',
  },
  {
    id: 'heart',
    label: 'Emotional Oxygen',
    icon: '💔',
    classes: 'bg-red-900 bg-opacity-30 hover:bg-red-800 text-red-300',
  },
  {
    id: 'body',
    label: 'Physical Oxygen',
    icon: '🦶',
    classes: 'bg-green-900 bg-opacity-30 hover:bg-green-800 text-green-300',
  },
];

const BreathingSection: React.FC = () => {
  const [activeOxygen, setActiveOxygen] = useState<CenterType | null>(null);

  return (
    <section className="py-12 bg-black bg-opacity-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-6">🌬️ DID IT HURT? GOOD. NOW BREATHE</h2>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-red-800">
          <div
            className={`breathing-crudo w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-500 ${
              activeOxygen ? 'animate-[breathe-crudo_2s_ease-in-out_infinite]' : ''
            }`}
          >
            <span className="text-3xl">💨</span>
          </div>

          <p className="text-gray-300 mb-6">
            <strong className="text-yellow-400">DECIDE:</strong> Which of the three centers needs more oxygen TODAY?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {OXYGEN_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveOxygen(type.id)}
                className={`py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold ring-2 ${type.classes} ${activeOxygen === type.id ? 'ring-yellow-400' : 'ring-transparent'}`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-400 italic">
            There is no correct answer. Only choices and their consequences. Wisdom is in choosing conscious of what
            you are sacrificing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BreathingSection;
